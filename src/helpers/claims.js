import iden3 from 'iden3';
import { List as ImmutableList } from 'immutable';
import { format } from 'date-fns';
import { getUnixTime } from 'helpers/utils';
import * as APP_SETTINGS from 'constants/app';
import * as CLAIMS from 'constants/claim';
import API from 'helpers/api';
import LocalStorage from 'helpers/local-storage';

/**
 * Class related to everything about claims: authorize, creates, decode what is read from a QR, etc...
 */
class Claim {
  /**
   *
   * @param {Immutable.Map} identity - Identity to work with this claim
   */
  constructor(identity) {
    this.identity = identity;
    this.storage = new LocalStorage(APP_SETTINGS.ST_DOMAIN);
  }

  authorizeClaim(data, localId) {
    let JSONData;
    let KSign;
    let proofOfClaim;

    return new Promise((resolve, reject) => {
      this.decodeReadData(data)
        .then((res) => {
          ({ JSONData, KSign } = res);
          return this.authorizeKSignClaim(res.dataForAuthorization);
        })
        .then((res) => {
          ({ proofOfClaim } = res.data.proofOfClaim);

          return API.sendClaimToCentralizedServer(new ImmutableList([
            JSONData.url,
            this.identity.get('address'),
            JSONData.challenge,
            JSONData.signature,
            KSign,
            proofOfClaim,
          ]));
        })
        .then((res) => {
          const createdClaim = this.createClaimInStorage(
            this.identity.get('address'),
            data,
            localId,
            proofOfClaim,
            JSONData.url,
            CLAIMS.TYPE.EMITTED.NAME,
          );

          resolve(createdClaim);
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Authorize an identity use their keys to sign a claim.
   *
   * @param {Immutable.Map} identity - With the identity which is authorizing the claim
   * @param {Immutable.List} data - With the keys and data to sign
   * @returns {Promise<any>}
   */
  authorizeKSignClaim(data) {
    // TODO: fix this hack
    /* const idRelay = identity.get('relay');
    const relay = new iden3.Relay(idRelay.url || idRelay.toJS().url);
    const id = new iden3.Id(krec, krev, ko, relay, ''); */

    const id = Object.assign({}, this.identity.toJS());
    id.idaddr = this.identity.get('address');
    return Promise.resolve(id.authorizeKSignClaim(...data.valueSeq().toJS()));
  }

  /*createAuthorizeKSignClaim = (data, keysContainer, ko, krec, krev) => {
    return API.authorizeKSignClaim(this.identity, data, keysContainer, ko, krec, krev);
  };*/

  /**
   * Decode the data read from a QR code or copied data that is in a QR code.
   *
   * @param {Object} data - With the data to decode
   * @param {string} data.challenge - Challenge that proofs the claim
   * @param {string} data.signature - Of the claim
   * @param {string} data.url - From the third party that ask the identity to authorize a claim
   * @returns {Promise<{dataForAuthorization: Immutable.List | Immutable.List<any>, JSONData: {challenge, signature, url}, KSign: String}>}
   */
  decodeReadData = (data) => {
    const JSONData = iden3.auth.parseQRhex(data); // Object {challenge, signature, url}
    const KSign = iden3.utils.addrFromSig(JSONData.challenge, JSONData.signature); // string
    const unixTime = getUnixTime(); // number
    const keysContainer = this.identity.get('keysContainer').toJS();
    const ko = this.identity.get('keys').get('operational');
    /*const krec = this.identity.keys.recovery;
    const krev = this.identity.keys.revoke;*/
    const dataForAuthorization = new ImmutableList([
      keysContainer,
      ko,
      APP_SETTINGS.DEFAULT_RELAY_DOMAIN,
      KSign,
      'appToAuthName',
      'authz',
      unixTime,
      unixTime,
    ]);

    keysContainer.unlock('a'); // for 30 seconds available
    return Promise.resolve({ dataForAuthorization, JSONData, KSign });
    /*return new Promise((resolve, reject) => {
      this.createAuthorizeKSignClaim(dataToCreateAuth, keysContainer, ko, krec, krev)
        .then((res) => {
          // if (res.states === 200) {
          const dataToTheServer = new ImmutableList([
            JSONdata.url,
            identity.address,
            JSONdata.challenge,
            JSONdata.signature,
            KSign,
            res.data.proofOfClaim,
          ]);
          resolve({
            proofOfClaim: res.data.proofOfClaim,
            dataToTheServer,
            url: JSONdata.url,
          });
          // }
        })
        .catch(error => reject(error));
    });*/
  };

  createClaimInStorage = (idAddrOwner, claimData, claimId, proofOfClaim, sourceUrl, type) => {
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

    return this.storage.setItem(claimKey, newClaimData) ? newClaimData : null;
  };

  getAllClaimsFromStorage = () => {
    const claimsInStorage = this.storage.getKeys('claim-');
    const claimsInStorageLength = claimsInStorage.length;
    const claims = {
      [CLAIMS.TYPE.EMITTED.NAME]: {},
      [CLAIMS.TYPE.RECEIVED.NAME]: {},
      [CLAIMS.TYPE.GROUPED.NAME]: {},
    };

    for (let i = 0; i < claimsInStorageLength; i++) {
      const idKey = claimsInStorage[i];
      const claimFromStorage = this.storage.getItem(idKey);
      claims[claimFromStorage.type][claimFromStorage.id] = claimFromStorage;
    }
    return Promise.resolve(claims);
  };

  /*getPinnedClaimsFromStorage = () => {
    return (this.storage.getItem('pinned-claims'));
  };

  setPinnedClaimsInStorage = (list) => {
    return this.storage.setItem('pinned-claims', list);
  }

  updateClaimInStorage = (id, claim) => {
    return this.storage.setItem(`claim-${id}`, claim) ? claim : null;
  }*/
}

export default Claim;
