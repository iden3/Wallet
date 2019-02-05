import iden3 from 'iden3';
import schemas from 'schemas';
import DALFactory from 'dal';
import {
  API,
} from 'helpers';
import * as SCHEMAS from 'constants/schemas';
import * as APP_SETTINGS from 'constants/app';

/**
 * Helper to deal with identities, like create it, change the default, its relay, etc...
 * Module pattern used.
 *
 * @type {
 * {
 *  createId,
 *  createIdentity,
 *  createIdentityInStorage,
 *  deleteAllIdentities,
 *  getAllIdentities,
 *  getCurrentIdentity,
 *  removeIdentity,
 *  setIdentityAsCurrent,
 *  setIdentityRelay,
 *  updateCurrentId,
 *  updateIdentity,
 *  updateIdentitiesNumber
 *  }
 * }
 */
const identitiesHelper = (function () {
  const DAL = new DALFactory(APP_SETTINGS.LOCAL_STORAGE);

  /**
   * Check if in the storage if we really have identities that make sense. This method
   * is used (i.e.) when we want to show the wizard of create a new identity since it's not
   * enough to know the number of identities but check if the keys exist and if they have
   * information.
   *
   * A right identity is has a key with like (i.e.):
   *  i3-id-0x6689c5688da6dc32d84f95b151b5c976a9f9db46
   *
   * And has information about its id address, has a key container, relay and keys (operational,
   * revocation and recovery)
   *
   * @returns {boolean} - True if identities exist and they have right information, false, otherwise
   */
  function _areIdentitiesConsistent() {
    let rightIds = 0;
    const storageIdKeys = DAL.getKeys(APP_SETTINGS.IDENTITY_STORAGE_PREFIX);
    const storageKeysLength = storageIdKeys.length;

    for (let i = 0; i < storageKeysLength; i++) {
      const currentItem = DAL.getItem(storageIdKeys[i]);
      const isIdConsistent = _isIdentityConsistent(currentItem);
      rightIds = isIdConsistent
        ? rightIds + 1
        : deleteIdentity(storageIdKeys[i]) && (rightIds > 0 && rightIds - 1);
    }

    return rightIds > 0;
  }

  /**
   * Create an identity with address and data received.
   * This is defined to create it in the storage selected, not in the Relay.
   *
   * @param {Object} data - with the data of the identity
   *
   * @returns {Object} With the identity created or an Error if already existed
   */
  function _checkIdentitySchema(data) {
    return schemas.parseIdentitySchema(data);
  }

  /**
   * Create the keys of an identity and sets them in the storage selected.
   * Also create the master seed only if it is the first identity of this wallet.
   *
   * @param {string} passphrase - to sign the keys
   * @param {string} storage - where to store this information
   * @param {boolean} isFirstIdentity - Indicating if it's first identity
   *
   * @returns {{keyRecovery: string, keyRevoke: string, keyOp: string. keyContainer: Object}}
   */
  function _createKeys(passphrase, isFirstIdentity) {
    try {
      const keysContainer = new iden3.KeyContainer(DAL.storageName, new iden3.Db());
      keysContainer.unlock(passphrase);
      // const newKeys = keysContainer.generateKeysMnemonic();
      // const [keyRecovery, keyRevoke, keyOp] = newKeys.keys;
      // new iden3
      isFirstIdentity && keysContainer.generateMasterSeed();

      const [keyOpEtherAddress, keyOpPublic, keyRecovery, keyRevoke] = keysContainer.createKeys();

      return {
        keyRecovery, keyRevoke, keyOp: keyOpPublic, keysContainer,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if exists an identity in the current storage.
   *
   * @param {string} iddAddr - Counterfactual address of the identity sent by the Relay.
   *
   * @returns {object | undefined} with the settings of the identity in the LS or undefined ir doesn't exist
   */
  function _getIdentity(iddAddr) {
    let identity;

    // if not identity address sent, look for the first found in the storage
    if (!iddAddr) {
      getAllIdentities()
        .then(ids => identity = ids[0]
          && DAL.getItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${ids[0].iddAddr}`));
    } else {
      identity = DAL.getItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${iddAddr}`);
    }

    return identity;
  }

  /**
  * Retrieve from the DAL the number of identities available
  *
  * @returns {number} with the number of identities
  */
  function _getNumberOfIdentities() {
    const idsNumberItem = DAL.getItem(APP_SETTINGS.ST_IDENTITIES_NUMBER);
    return idsNumberItem && idsNumberItem.constructor === Number ? idsNumberItem : 0;
  }
  /**
   * Check if an identity is consistent. It means that has iddAddr field, keys object
   * with their keys, a key container object, a Relay object and a name or label field.
   *
   * @param {object} identity - Retrieved from the selected store
   *
   * @returns {boolean} - True if this identity is consistent and has right data, False otherwise
   */
  function _isIdentityConsistent(identity) {
    return schemas.compareSchemas(SCHEMAS.IDENTITY, identity);
  }

  /**
   * Create a Relay object with its prototype and new keys before call the Relay with the new identity data.
   *
   * @param {string} passphrase - To unlock keys for some seconds and create the keys
   * @param {string} relayAddress - URL of the Relay in which create the identity
   * @param {boolean} isFirstIdentity - Indicating if it's first identity
   *
   * @returns {{id: Id, keys: (*|{keyRecovery: string, keyRevoke: string, keyOp: string, keyContainer: Object}), relay: (*|Object)}}
   */
  function _prepareCreateIdentity(passphrase, relayAddress, isFirstIdentity) {
    if (passphrase && relayAddress) {
      try {
        const keys = _createKeys(passphrase, isFirstIdentity);
        if (keys) {
          const relay = setIdentityRelay(relayAddress);

          return Promise.resolve({
            id: createId(
              { recovery: keys.keyRecovery, revoke: keys.keyRevoke, operational: keys.keyOp },
              relay.url,
            ),
            keys,
            relay,
          });
        }
        return Promise.reject(new Error('Looks like your passphrase is not correct'));
      } catch {
        return Promise.reject();
      }

    }

    return Promise.reject(Error('No passphrase or relay address set'));
  }

  /**
   * Call to the Relay to bind the label/name of an identity to an address.
   *
   * @param {Object} identity - With its information, above all, it's needed the keys and the id address
   * @param {string} label - With label to bind it to the identity
   * @param {string} passphrase - to sign the request
   *
   * @returns {Promise<void>}
   */
  async function bindLabelToUsername(identity, label, passphrase) {
    let identityUpdated = {};

    identity.keys.keysContainer.unlock(passphrase);
    await API.bindLabelToUsername(identity, label)
      .then(res => identityUpdated = Object.assign({}, identityUpdated, res.data));
    return identityUpdated;
  }

  /**
   * Return an iden3 Id object to use basically prototype.
   *
   * @param {Object} keys - With the keys of the identity
   * @param {string} keys.recovery - With the recovery key of the identity
   * @param {string} keys.revoke - With the revoke key of the identity
   * @param {string} keys.operational - With the operational key of the identity
   * @param {string} relayURL - URL of the current Relay of the identity
   * @param {string} idAddress - Of the current identity
   *
   * @returns {iden3.Id}
   */
  function createId(keys, relayURL) {
    const id = new iden3.Id(
      keys.operational,
      keys.recovery,
      keys.revoke,
      new iden3.Relay(relayURL), // to get the prototype
      '',
    );

    return id;
  }

  /**
   * Create an identity, creating the keys that are stored in the local storage
   * by the iden3 library. Then set the relay, and finally call the Relay
   * set to create the identity (the promise returned).
   * So this is an AJAX call to the Relay.
   *
   * @param {Object} data - with new identity values
   * @param {string} passphrase - The passphrase to unlock for 30 seconds the key container
   * @param {string} relayAddr - with the URL of the relay to get the counterfactual address
   *
   * @returns {Promise<any>} Return a Promise with the field "address" that contains
   * the address of the counterfactual contract of the new identity
   */
  function createIdentity(data, passphrase, isCurrent = false, relayAddr = APP_SETTINGS.RELAY_ADDR) {
    const idsNumber = _getNumberOfIdentities();
    const isFirstIdentity = idsNumber === 0;

    return new Promise((resolve, reject) => {
      _prepareCreateIdentity(passphrase, relayAddr, isFirstIdentity)
        .then(async (identity) => {
          const address = await API.createIdentity(identity.id);
          return { address, identity };
        })
        .then(async (createIdentityRes) => {
          const _bindLabelUsername = await bindLabelToUsername(createIdentityRes.identity, data.label, passphrase);
          return {
            createdIdentity: createIdentityRes,
            proofOfClaimAssignName: _bindLabelUsername,
          };
        })
        .then((res) => {
          // once we have the address returned by the ID, set it in the local storage
          // set the flag hasSavedIdentity at false to show a notification in the app
          // to warn user to keep the seed and show them it
          const newIdentity = _checkIdentitySchema({
            address: res.createdIdentity.address.idAddr,
            proofOfClaimKSign: res.createdIdentity.address.proofOfClaim,
            proofOfEthLabel: res.proofOfClaimAssignName,
            ...res.createdIdentity.identity,
            ...data,
            isCurrent,
          });

          // TODO: With the proofOfClaim field in the res.address.proofOfClaim
          // create a new Entry and then create an emitted AuthorizeKSign
          // with the signature authorized to the Relay to sign

          // TODO: Create an AssignName claim, that is one received by the Name resolver
          // (in this case is the relay)

          if (newIdentity && createIdentityInStorage(newIdentity)) {
            if (newIdentity.isCurrent) {
              setIdentityAsCurrent(newIdentity.address);
            }
            if (idsNumber === 0) { // if first identity mark it to save master seed by the user
              newIdentity.needsToSaveMasterKey = true;
            }
            resolve(newIdentity);
          } else {
            reject(new Error('New identity could not be created'));
          }
        })
        .catch((error) => {
          if (error.response.data.error === 'error on GetClaimByHi') {
            reject(new Error('We are sorry. This label is already taken. Please come back and choose another one'));
          } else {
            reject(new Error(error.response.data.error || error.response.statusText));
          }
        });
    });
  }

  /**
   * Create identity in the storage requested.
   *
   * @param {Object} identity - With identity information
   *
   * @returns {boolean} - True if created, false otherwise
   */
  function createIdentityInStorage(identity) {
    let created = false;

    if (identity) {
      const key = `id-${identity.address}`;
      created = DAL.setItem(key, identity); // returns a boolean
    }

    return created;
  }

  /**
   * Remove all the information in the local storage domain from the app
   */
  function deleteAllIdentities() {
    const areDeleted = DAL.clear();
    // if are deleted we get an 'undefined', for tha we return the negation
    return areDeleted === undefined;
  }

  /**
   * Get from the storage all the identities stored and their information.
   * Usually used (i.e.) first time we load the application to hydrate the app state.
   *
   * @returns {Promise<any>} - Promise with an Object containing the identities and their information
   */
  function getAllIdentities() {
    const idsInStorage = DAL.getKeys(APP_SETTINGS.IDENTITY_STORAGE_PREFIX);
    const idsInStorageLength = idsInStorage.length;
    const ids = {};
    const needsMasterSeedToBeSaved = DAL.getItem(APP_SETTINGS.NEEDS_SAVE_MASTER_SEED);

    for (let i = 0; i < idsInStorageLength; i++) {
      const idKey = idsInStorage[i];
      const idFromStorage = DAL.getItem(idKey);
      const identity = idFromStorage;
      const keysContainerProto = Object.getPrototypeOf(new iden3.KeyContainer(APP_SETTINGS.LOCAL_STORAGE));

      // set again prototypes of the objects because can't be stored in the local storage
      identity.keys.container = Object.assign({ __proto__: keysContainerProto }, identity.keys.container);
      identity.relay = Object.getPrototypeOf(setIdentityRelay(identity.relayURL));
      identity.id = Object.getPrototypeOf(
        new iden3.Id(
          identity.keys.recovery,
          identity.keys.revoke,
          identity.keys.operational,
          identity.relay,
          '',
        ),
      );

      ids[idFromStorage.address] = _checkIdentitySchema(identity);
    }

    return Promise.resolve({ needsMasterSeedToBeSaved, ids });
  }

  /**
   * Returns the default identity from the storage.
   *
   * @returns {string} - With the default identity address
   */
  function getCurrentIdentity() {
    return DAL.getItem(`${APP_SETTINGS.ST_DEFAULT_ID}`);
  }

  /**
   * Remove from the storage the identity key-value.
   *
   * @param {string} identityKey - With format 'id-Address of the id'
   * @param {string} storage - where to store this information
   *
   * @returns {boolean} True if removed, false otherwise
   */
  function deleteIdentity(identityKey) {
    return identityKey ? DAL.deleteItem(identityKey) : false;
  }

  /**
   * Set the new default identity which is the one loaded now in the app.
   * Set the field isCurrent inside the identity and the key indicating which identity is the default
   * in the selected storage.
   *
   * @param {string} newIdAddress - With the information of the new identity that will be the default
   * @throws Will throw an error if the no identity provided.
   *
   * @returns {boolean} - True if could be updated, false, otherwise
   */
  function setIdentityAsCurrent(newIdAddress = null) {
    const currentIdKey = DAL.getItem(`${APP_SETTINGS.ST_DEFAULT_ID}`);
    const currentId = _getIdentity(currentIdKey);
    const newCurrentId = _getIdentity(newIdAddress);

    // it's not the first time we create an identity and set the former default identity to false
    if (newIdAddress && currentId) {
      currentId.isCurrent = false;
      DAL.updateItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${currentId.address}`, currentId);
    }

    // set the new default identity
    if (newIdAddress) { // if it's not first identity created
      newCurrentId.isCurrent = true;
      DAL.updateItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${newIdAddress}`, newCurrentId);
      DAL.updateItem(`${APP_SETTINGS.ST_DEFAULT_ID}`, newIdAddress);
      return true;
    }

    // first identity created, already is default, so return true
    if (!newIdAddress && currentId) {
      return true;
    }

    throw new Error('No identity provided to set as default');
  }

  /**
   * Create the object with the Relay information
   *
   * @param {string} relay - The url of the relay
   *
   * @returns {Object} with the information of the relay, including the url field
   */
  function setIdentityRelay(relay = APP_SETTINGS.RELAY_ADDR) {
    return new iden3.Relay(relay);
  }

  /**
   * Update the default id field in the storage. If we can't update it because
   * there are no right identities, storage is removed since all the information
   * does not make sense anymore.
   *
   * @returns {boolean} - True if success, false otherwise
   */
  function updateCurrentId() {
    // set the object storage
    const currentIdAddr = DAL.getItem(APP_SETTINGS.ST_DEFAULT_ID);
    const identity = DAL.getItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${currentIdAddr}`);

    // the default identity is alright
    if (identity && _isIdentityConsistent(identity)) {
      return true;
    }

    // default identity it's not ok or does not exist, get another one or remove all the storage
    const rightIds = _areIdentitiesConsistent();

    if (rightIds > 0) {
      // if we have right id's set the de default the first that we find
      const idItems = DAL.getKeys(APP_SETTINGS.IDENTITY_STORAGE_PREFIX);

      if (idItems > 0) {
        if (DAL.setItem(`${APP_SETTINGS.ST_DEFAULT_ID}`, idItems[0])) return true;
      }
    }

    // if not default id set, and not right identities in the storage, remove the storage
    DAL.clear();
    return false;
  }

  /**
   * Update an identity with new data in the storage selected.
   *
   * @param {Object} identity - With all the data
   * @param {Object} data - With the new data to update
   *
   * @returns {Object} - The updated identity if was updated the number, false otherwise
   */
  function updateIdentity(identity, data) {
    // set the object storage
    const idAddrLabel = `${APP_SETTINGS.ST_IDENTITY_PREFIX}-${identity.idAddr}`;
    const _identity = DAL.getItem(idAddrLabel);

    if (_identity) {
      const updatedIdentity = Object.assign({}, identity, data);

      // if there was no identities before or default field, put it in the storage
      // to load this identity next time that wallet is loaded
      const existsCurrentId = DAL.getItem(`${APP_SETTINGS.ST_DEFAULT_ID}`);
      const identitiesNumber = DAL.getItem(`${APP_SETTINGS.ST_IDENTITIES_NUMBER}`);

      // if does not exist field of default id or if ther are zero identities number
      if (!existsCurrentId || (existsCurrentId && identitiesNumber && identitiesNumber === 0)) {
        DAL.setItem(`${APP_SETTINGS.ST_DEFAULT_ID}`, identity.address);
      }

      return DAL.updateItem(idAddrLabel, updatedIdentity)
        ? updatedIdentity
        : null;
    }
    return null;
  }

  /**
   * Update the number of identities in the application.
   *
   * @param {boolean} isToAdd - True if we are adding an identity, false if we are removing it
   *
   * @returns {boolean} - True if was updated the number, false otherwise
   */
  function updateIdentitiesNumber(isToAdd) {
    const idsNumber = _getNumberOfIdentities();

    // if it's the first identity set it as default and create in DAL the flag to indicate that
    // we need to warn user to save master seed
    if (idsNumber === 0) {
      setIdentityAsCurrent();
      DAL.setItem(APP_SETTINGS.NEEDS_SAVE_MASTER_SEED, true);
    }

    return isToAdd
      ? DAL.updateItem(APP_SETTINGS.ST_IDENTITIES_NUMBER, idsNumber + 1)
      : idsNumber > 0 && DAL.updateItem(APP_SETTINGS.ST_IDENTITIES_NUMBER, idsNumber - 1);
  }

  /**
  * Get from iden3js the master seed decrypted
  *
  * @param {string} passphrase - To unlock the key container
  *
  * @return {string} with the master seed (a mnemonic phrase with some words)
  */
  function getMasterSeed(passphrase) {
    const keysContainer = new iden3.KeyContainer(DAL.storageName, new iden3.Db());

    keysContainer.unlock(passphrase);
    return keysContainer.getMasterSeed();
  }

  /**
  * Remove from the DAL the flag to know if master seed has been saved or not
  *
  * @returns {boolean} if key could be deleted
  */
  function setMasterSeedSaved() {
    return DAL.deleteItem(APP_SETTINGS.NEEDS_SAVE_MASTER_SEED);
  }

  return {
    bindLabelToUsername,
    createId,
    createIdentity,
    createIdentityInStorage,
    deleteAllIdentities,
    getAllIdentities,
    getCurrentIdentity,
    getMasterSeed,
    deleteIdentity,
    setIdentityAsCurrent,
    setIdentityRelay,
    setMasterSeedSaved,
    updateCurrentId,
    updateIdentity,
    updateIdentitiesNumber,
  };
}());

export default identitiesHelper;
