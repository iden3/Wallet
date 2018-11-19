import iden3 from 'iden3';
import { List as ImmutableList } from 'immutable';
import { format } from 'date-fns';
import {
  API,
  identitiesHelper,
  utils,
} from 'helpers';
import * as APP_SETTINGS from 'constants/app';
import * as CLAIMS from 'constants/claim';
import DAL from 'dal';

let instance;

/**
 *
 * Class related to everything about claims: authorize, creates, decode what is read from a QR, etc...
 * Singleton to create it only once when we change to another identity, create the first one or (re) load the app
 *
 */
class Claim {
  /**
   *
   * @param {Immutable.Map} identity - Identity to work with this claim
   */
  constructor(identity) {
    if (!instance) {
      this.identity = identity;
      // this.storage = new LocalStorage(APP_SETTINGS.ST_DOMAIN);
      this.DAL = new DAL(APP_SETTINGS.LOCAL_STORAGE);
      instance = this;
    }

    this.authorizeClaim = this.authorizeClaim.bind(this);
    this.createClaimInStorage = this.createClaimInStorage.bind(this);
    this.createGenericClaim = this.createGenericClaim.bind(this);
    this.getAllClaimsFromStorage = this.getAllClaimsFromStorage.bind(this);

    return instance;
  }

  //
  // Private methods
  //

  /**
   * Call the API to send to centalized server an authorization of a claim.
   *
   * @param {Object} proofOfClaim - With the proof of claim
   * @param {Object} JSONData - With the data of the claim sent by the centralized server (read by a QR i.e.)
   * @param {string} keyToAuthorize - Key returned by the Relay to authorize this claim
   * @returns {Promise<any>}
   */
  _authClaimToCentralizedServer(proofOfClaim, JSONData, keyToAuthorize) {
    return Promise.resolve(
      API.authClaimToCentralizedServer(new ImmutableList([
        JSONData.url,
        this.identity.get('address'),
        JSONData.challenge,
        JSONData.signature,
        keyToAuthorize,
        proofOfClaim,
      ])),
    );
  }

  /**
   * Authorize an identity use their keys to sign a claim.
   *
   * @param {Immutable.Map} identity - With the identity which is authorizing the claim
   * @param {Immutable.List} data - With the keys and data to sign
   * @returns {Promise<any>}
   */
  _authorizeKSignClaim(data) {
    const id = identitiesHelper.createId(
      this.identity.get('keys').toJS(),
      this.identity.get('relayURL'),
      this.identity.get('address'),
    );

    return Promise.resolve(API.authorizeKSignClaim(id, data));
  }

  /**
   * Decode the data read from a QR code or copied data that is in a QR code.
   *
   * @param {Object} data - With the data to decode
   * @param {string} data.challenge - Challenge that proofs the claim
   * @param {string} data.signature - Of the claim
   * @param {string} data.url - From the third party that ask the identity to authorize a claim
   * @returns {Promise<{dataForAuthorization: Immutable.List | Immutable.List<any>, JSONData: {challenge, signature, url}, keyToAuthorize: String}>}
   */
  _decodeReadData(data, keysContainer) {
    const JSONData = iden3.auth.parseQRhex(data); // Object {challenge, signature, url}
    const keyToAuthorize = iden3.utils.addrFromSig(JSONData.challenge, JSONData.signature); // string
    const unixTime = utils.getUnixTime(); // number
    const operationalKey = this.identity.get('keys').get('operational');
    const dataForAuthorization = new ImmutableList([
      keysContainer,
      operationalKey, // kSign in this case is the operational
      keyToAuthorize,
      'appToAuthName',
      'authz',
      unixTime,
      unixTime,
    ]);

    // keysContainer.unlock(this.identity.get('passphrase')); // for 30 seconds available
    return Promise.resolve({ dataForAuthorization, JSONData, keyToAuthorize });
  }

  _preNewClaim() {
    const keysContainer = this.identity.get('keys').get('container');
    const id = identitiesHelper.createId(
      this.identity.get('keys').toJS(),
      this.identity.get('relayURL'),
      this.identity.get('address'),
    );

    keysContainer.unlock(this.identity.get('passphrase'));
    return { keysContainer, id };
  }

  //
  // Public methods
  //

  /**
   * Authorize a claim read from a QR or because a code was introduced.
   * This case is for a centralized app.
   *
   * @param {Object} data - Read from the QR or introduced by the user
   * @param {string} data.challenge - Challenge that proofs the claim
   * @param {string} data.signature - Of the claim
   * @param {string} data.url - From the third party that ask the identity to authorize a claim
   * @param {string} localId - the id of the claim in the app storage
   * @returns {Promise<any>}
   */
  authorizeClaim(data, localId) {
    let JSONData;
    let keyToAuthorize;
    let proofOfClaim;
    const { keysContainer } = this._preNewClaim();

    return new Promise((resolve, reject) => {
      this._decodeReadData(data, keysContainer)
        .then((res) => {
          ({ JSONData, keyToAuthorize } = res);
          return this._authorizeKSignClaim(res.dataForAuthorization);
        })
        .then((res) => {
          if (res && res.status === 200) {
            ({ proofOfClaim } = res.data);
            return this._authClaimToCentralizedServer(proofOfClaim, JSONData, keyToAuthorize);
          }

          return reject(new Error(`Error authorizing claim. Reason: ${res.status}`));
        })
        .then((res) => {
          if (res && res.status === 200) {
            const createdClaim = this.createClaimInStorage(
              CLAIMS.TYPE.EMITTED.NAME,
              this.identity.get('address'),
              data,
              localId,
              proofOfClaim,
              JSONData.url,
            );

            resolve(createdClaim);
          }

          return reject(new Error(`Error sending the claim created to the Relay. Reason: ${res.status}`));
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Create in storage the claim.
   *
   * @param {string} type - OF the claim: emitted or received
   * @param {string} idAddrOwner - Address of the owner of this claim
   * @param {Object} claimData - Claim information
   * @param {string} claimId - Local id of the claim
   * @param {Object} proofOfClaim - Proof of the claim
   * @param {string} sourceUrl - Of the app/dapp (if needed)
   * @returns {*}
   */
  createClaimInStorage(type, idAddrOwner, claimData, claimId, proofOfClaim, sourceUrl = '') {
    const claimKey = `claim-${claimId}`;
    const date = new Date();
    const newClaimData = {
      identity: idAddrOwner,
      introducedContent: !sourceUrl ? claimData : '',
      data: claimData,
      date: format(date, 'd/MMM/yyyy'),
      time: format(date, 'HH:mm'),
      id: claimId,
      proof: proofOfClaim.ClaimProof, // Leaf, Root and Proof
      url: sourceUrl,
      type,
    };

    // return this.storage.setItem(claimKey, newClaimData) ? newClaimData : null;
    return this.DAL.setItem(claimKey, newClaimData) ? newClaimData : null;
  };

  /**
   * Create a Generic (or default) claim.
   *
   * @param {Immutable.Map} identity - Identity object owner of this claim
   * @param {string} data - Of the claim
   * @param {string} localClaimId - The local storage id of this claim to store it
   * @returns {Promise<any>}
   */
  createGenericClaim(data, localClaimId) {
    return new Promise((resolve, reject) => {
      const { keysContainer, id } = this._preNewClaim();

      API.createGenericClaim(
        id,
        keysContainer,
        this.identity.get('keys').get('operational'),
        APP_SETTINGS.DEFAULT_RELAY_DOMAIN,
        data,
      )
        .then((res) => {
          const createdClaim = this.createClaimInStorage(
            CLAIMS.TYPE.EMITTED.NAME,
            this.identity.get('address'),
            data,
            localClaimId,
            res.data.proofOfClaim,
            res.url || '',
          );
          resolve(createdClaim);
        })
        .catch(error => reject(new Error(`Could not create the claim: ${error.message || error}`)));
    });
  }

  /**
   * Retrieve all the claims stored in the storage.
   *
   * @returns {Promise<{}>} - With an object with claims grouped by emitted, received and grouped
   */
  getAllClaimsFromStorage() {
    const claimsInStorage = this.DAL.getKeys(APP_SETTINGS.CLAIM_STORAGE_PREFIX);
    const claimsInStorageLength = claimsInStorage.length;
    const claims = {
      [CLAIMS.TYPE.EMITTED.NAME]: {},
      [CLAIMS.TYPE.RECEIVED.NAME]: {},
      [CLAIMS.TYPE.GROUPED.NAME]: {},
    };

    for (let i = 0; i < claimsInStorageLength; i++) {
      const idKey = claimsInStorage[i];
      const claimFromStorage = this.DAL.getItem(idKey);
      claims[claimFromStorage.type][claimFromStorage.id] = claimFromStorage;
    }
    return Promise.resolve(claims);
  }

  /* getPinnedClaimsFromStorage = () => {
    return (this.DAL.getItem('pinned-claims'));
  };

  setPinnedClaimsInStorage = (list) => {
    return this.DAL.setItem('pinned-claims', list);
  }

  updateClaimInStorage = (id, claim) => {
    return this.DAL.setItem(`claim-${id}`, claim) ? claim : null;
  } */
}

export default Claim;
