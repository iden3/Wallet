import iden3 from 'iden3';
import * as APP_SETTINGS from 'constants/app';
import * as CLAIMS from 'constants/claim';
import identitiesHelper from 'helpers/identities';
import Claim from 'helpers/claims';

const API = {
  /**
   * Create an identity, creating the keys that are stored in the local storage
   * by the iden3 library. Then set the relay, and finally call the Relay
   * set to create the identity (the promise returned).
   * So this is an AJAX call to the Relay.
   *
   * @param {string } passphrase - The passphrase to unlock for 30 seconds the key container
   * @param {string} relayAddr - with the URL of the relay to get the counterfactual address
   * @returns {Promise<any>} Return a Promise with the field "idaddr" that contains
   * the address of the counterfactual contract of the new identity
   */
  createIdentity(passphrase, relayAddr = APP_SETTINGS.RELAY_ADDR) {
    const keys = identitiesHelper.createKeys(passphrase);
    const relay = identitiesHelper.setRelay(relayAddr);
    const id = new iden3.Id(keys.keyRecovery, keys.keyRevoke, keys.keyOp, relay, '');
    const storage = APP_SETTINGS.LOCAL_STORAGE;

    return new Promise((resolve, reject) => {
      id.createID()
        .then((idAddr) => {
          // once we have the address returned by the ID, set it in the local storage
          const createdId = this.createIdentityInStorage(idAddr, { keys, relay }, storage);
          Object.keys(createdId).length > 0
            ? resolve({
              id,
              idAddr,
              keys,
              relay,
              icon: createdId.icon,
              date: createdId.date,
              time: createdId.time,
            })
            : reject(
              new Error(`Couldn't create the identity because already exists or can't access to the ${storage}`),
            );
        })
        .catch(error => reject(new Error(error)));
    });
  },

  /**
   * Call to the Relay to bind the label/name of an identity to an address.
   *
   * @param {Object} identity - With its information, above all, it's needed the keys and the id address
   * @param {Object} data - With label or name field to bind it to the identity
   * @param {string} passphrase - to sign the petition
   * @returns {Promise<void>}
   */
  bindIdToUsername(identity, data, passphrase) {
    let identityUpdated = {};

    // identity.keys.keyContainer.unlock(passphrase); // for 30 seconds to update the identity
    identity.keys.keyContainer.unlock('a');
    identity.id.vinculateID(identity.keys.keyContainer, data.label || data.name)
      .then(res => identityUpdated = Object.assign({}, identityUpdated, res.data));
    return identityUpdated;
  },

  /**
   * Create the identity in the storage selected.
   *
   * @param {string} idAddress - address of the identity
   * @param {Object} data - with the data of the identity
   * @param {string} data.label - First time is empty
   * @param {Object} data.keys - With the keys of recovery, revoke and operational
   * @param {Array} data.seed - With the words of seed of the identity
   * @param {Object} data.relay - Object with the Relay information, sucha as the url field
   * @param {string} storage - where to store this information
   * @returns {Object} - Populated if was successfully created, empty otherwise
   */
  createIdentityInStorage(idAddress, data, storage = APP_SETTINGS.LOCAL_STORAGE) {
    if (storage === APP_SETTINGS.LOCAL_STORAGE) {
      return identitiesHelper.createIdentity(idAddress, data);
    }
    return {};
  },

  /**
   * Delete all the identities from the storage.
   *
   * @returns {boolean} - True if there were deleted from the storage, false otherwise
   */
  deleteAllIdentities(storage = APP_SETTINGS.LOCAL_STORAGE) {
    if (storage === APP_SETTINGS.LOCAL_STORAGE) {
      return identitiesHelper.deleteAllIdentities();
    }
    return false;
  },

  /**
   * Update the counter of the identities in the current storage.
   *
   * @param {boolean} isToAdd - True for adding, false for subtract
   * @param {string} storage - The storage in which should be updated
   * @returns {boolean} - True if successful, false otherwise
   */
  updateIdentitiesNumber(isToAdd, storage = APP_SETTINGS.LOCAL_STORAGE) {
    if (storage === APP_SETTINGS.LOCAL_STORAGE) {
      return identitiesHelper.updateIdentitiesNumber(isToAdd);
    }
    return false;
  },

  /**
   * Update an identity in the storage and if we are changing the label,
   * send to relay to Vinculate the identity address to this new label.
   *
   * @param {Object} identity - The identity to update
   * @param {Object} data - With the identity's data to update
   * @param {string } passphrase - The passphrase to unlock for 30 seconds the key container
   * @param {string } storage - The storage in which should be updated
   * @returns {Object} - With the identity object with new data and the data received from the Relay
   */
  updateIdentity(identity, data, passphrase, storage = APP_SETTINGS.LOCAL_STORAGE) {
    let identityUpdated = Object.assign({}, identity, data);

    if (storage === APP_SETTINGS.LOCAL_STORAGE) {
      // if label changed, we need to bind it to the identity and call the Relay
      if (data.hasOwnProperty('label') || data.hasOwnProperty('name')) {
        identityUpdated = this.bindIdToUsername(identity, data, passphrase);
      }
      // dataUpdated should contain (if we called the Relay) this fields:
      // ethId, name and signature
      const storedIdentity = identitiesHelper.updateIdentity(identity, identityUpdated);
      return Promise.resolve(storedIdentity);
    }
    return Promise.reject(new Error('Not storage found when update identity'));
  },

  /**
   * Call iden3 library to send authorization to the centralized server
   * to do the action requested in the QR read before.
   *
   * @param {ImmutableMap} data - With the values
   * @returns {*} - Response from the server with universal code of success or not
   */
  sendClaimToCentralizedServer(data) {
    return iden3.auth.resolv(...data.valueSeq().toJS());
  },

  /**
   * Authorize a claim.
   *
   * @param {ImmutableMap} identity - With the identity which is authorizing the claim
   * @param {string} data - The data read from the claim to authorize (use to be a QR)
   * @param {string} claimId - Id of the claim in the local storage, nothing about relay or dapp, etc...
   * @returns {Promise<void>}
   */
  authorizeClaim(identity, data, claimId) {
    const claim = new Claim(identity);

    claim.createClaimInStorage(identity.get('idAddr'), data, claimId, CLAIMS.TYPE.EMITTED.NAME);
    return Promise.resolve(claim.decodeReadedData(data));
  },

  /**
   * Authorize an identity use their keys to sign a claim.
   *
   * @param {ImmutableMap} identity - With the identity which is authorizing the claim
   * @param {ImmutableMap} data - With the keys and data to sign
   * @param {Object} keysContainer - Created when the identity was created
   * @param {string} ko - Operational key
   * @param {string} krec - Recovery key
   * @param {string} krev - Revoke key
   * @returns {Promise<any>}
   */
  authorizeKSignClaim(identity, data, keysContainer, ko, krec, krev) {
    // TODO: fix this hack
    const idRelay = identity.get('relay');
    const relay = new iden3.Relay(idRelay.url || idRelay.toJS().url);
    const id = new iden3.Id(krec, krev, ko, relay, '');

    id.idaddr = identity.get('idAddr');
    return Promise.resolve(id.AuthorizeKSignClaim(...data.valueSeq().toJS()));
  },

  /**
   * Get from the storage all the claims stored and their information.
   * Usually used (i.e.) first time we load the application to hydrate the app state.
   *
   * @param {string} storage - type of storage selected
   * @returns {Promise<any>} - Promise with an Object containing the claims and their information
   */
  getAllClaims() {
    const claim = new Claim();

    return claim.getAllClaimsFromStorage();
  },
};

export default API;
