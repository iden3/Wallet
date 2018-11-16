import iden3 from 'iden3';
import * as APP_SETTINGS from 'constants/app';
import * as CLAIMS from 'constants/claim';
import identitiesHelper from 'helpers/identities';
import Claim from 'helpers/claims';

/**
 * Any interaction with a Storage, Relay or external agent should be by a call set here.
 */
const API = {
  /**
   * Call to the relay to authorize sign a new claim.
   *
   * @param {Object} id - The id object to call the Relay
   * @param {Immutable.List} data - With the data of the claim to authorize
   * @returns {*|Promise<any>|Object|void}
   */
  authorizeKSignClaim(id, data) {
    return id.authorizeKSignClaim(...data.valueSeq().toJS());
  },

  /**
   * Call iden3 library to send authorization to the centralized server
   * to do the action requested in the QR read before.
   *
   * @param {Immutable.List} data - With the values
   * @returns {*} - Response from the server with universal code of success or not
   */
  authClaimToCentralizedServer(data) {
    return iden3.auth.resolv(...data.valueSeq().toJS());
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
    // TODO: Move this to identitiesHelper and only leave here the call to the Relay
    let identityUpdated = {};

    // identity.keys.keyContainer.unlock(passphrase); // for 30 seconds to update the identity
    identity.keys.container.unlock(passphrase);
    identity.id.bindID(identity.keys.container, data.label || data.name)
      .then(res => identityUpdated = Object.assign({}, identityUpdated, res.data));
    return identityUpdated;
  },

  createGenericClaim(identity, data, claimId) {
    const claim = new Claim(identity);
    const address = identity.get('address');

    return new Promise((resolve, reject) => {
      const keysContainer = new iden3.KeyContainer(APP_SETTINGS.LOCAL_STORAGE);
      // TODO: hack, change this
      const idRelay = identity.get('relay');
      const relay = new iden3.Relay(idRelay.url || idRelay.toJS().url);
      const id = new iden3.Id(
        identity.get('keys').get('recovery'),
        identity.get('keys').get('revoke'),
        identity.get('keys').get('operational'),
        relay,
        '',
      );
      id.address = identity.get('address');
      keysContainer.unlock(identity.get('passphrase'));
      id.genericClaim(
        keysContainer,
        identity.get('keys').get('keyOp'),
        'iden3.io',
        'default',
        data,
        '',
      )
        .then((res) => {
          const createdClaim = claim.createClaimInStorage(
            CLAIMS.TYPE.EMITTED.NAME,
            address,
            data,
            claimId,
            res.data.proofOfClaim,
            res.url || '',
          );
          resolve(createdClaim);
        })
        .catch(error => reject(new Error('Could not create the claim')));
    });
  },

  /**
   * Create an identity, creating the keys that are stored in the local storage
   * by the iden3 library. Then set the relay, and finally call the Relay
   * set to create the identity (the promise returned).
   * So this is an AJAX call to the Relay.
   *
   * @param {Object} data - with new identity values
   * @param {string} passphrase - The passphrase to unlock for 30 seconds the key container
   * @param {string} relayAddr - with the URL of the relay to get the counterfactual address
   * @returns {Promise<any>} Return a Promise with the field "address" that contains
   * the address of the counterfactual contract of the new identity
   */
  createIdentity(data, passphrase, isDefault = false, relayAddr = APP_SETTINGS.RELAY_ADDR) {
    // TODO: Move this to identitiesHelper and only leave here the call to the Relay
    const identity = identitiesHelper.prepareCreateIdentity(passphrase, relayAddr);

    return new Promise((resolve, reject) => {
      identity.id.createID()
        .then((address) => {
          // once we have the address returned by the ID, set it in the local storage
          const newIdentity = identitiesHelper.createIdentity({
            address, ...identity, ...data, passphrase, isDefault,
          });

          if (newIdentity && this.createIdentityInStorage(newIdentity)) {
            if (newIdentity.isDefault) {
              identitiesHelper.setIdentityAsDefault(newIdentity);
            }
            resolve(newIdentity);
          } else {
            reject(new Error('New identity could not be created'));
          }
        })
        .catch(error => reject(new Error(error)));
    });
  },

  /**
   * Create the identity in the storage selected.
   *
   * @param {Object} data - with the data of the identity
   * @param {string} storage - where to store this information
   * @returns {Object} - Populated if was successfully created, empty otherwise
   */
  createIdentityInStorage(data, storage = APP_SETTINGS.LOCAL_STORAGE) {
    if (storage === APP_SETTINGS.LOCAL_STORAGE) {
      return identitiesHelper.createIdentityInStorage(data);
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

  /**
   * Just a function to do a generic AJAX call.
   *
   * @param {function} callBack - That contains the async call
   * @param {Object | Array } args - Something that we need to destructure
   * @param {Object} bindObject - The object to bind in the call if needed
   * @returns {*}
   */
  genericCall(callBack, args, bindObject = undefined) {
    return callBack.call(bindObject, ...args);
  },

  /* getPinnedClaims() {
    const claim = new Claim();
    const pinnedClaims = claim.getPinnedClaimsFromStorage();

    return pinnedClaims || new ImmutableMap({});
  },

  updatePinnedClaims(allClaims, pinnedClaimsMap, idToUpdate) {
    let newPinnedMap;
    const claim = new Claim();
    const keys = pinnedClaimsMap.keySeq().toArray();
    if (keys.indexOf(idToUpdate) !== -1) {
      // id exists, remove it (has been unpinned)
      newPinnedMap = pinnedClaimsMap.delete(idToUpdate);
    } else { // add it to the end because has been pinned
      const _claim = allClaims.get(idToUpdate);
      _claim.isPinned = !_claim.isPinned;
      claim.updateClaimInStorage(allClaims.get(idToUpdate).id, _claim)
      newPinnedMap = pinnedClaimsMap.set(idToUpdate, _claim);
    }

    return claim.setPinnedClaimsInStorage(newPinnedMap.toJS())
      ? Promise.resolve(newPinnedMap)
      : Promise.reject(new Error('Could not store the pinned claims in the storage'));
  }, */

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
    // TODO: Move this to identitiesHelper and only leave here the call to the Relay
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
};

export default API;
