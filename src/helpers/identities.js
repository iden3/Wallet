import iden3 from 'iden3';
import schemas from 'schemas';
import DALFactory from 'dal';
import { API } from 'helpers';
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
 *  getDefaultIdentity,
 *  removeIdentity,
 *  setIdentityAsDefault,
 *  setIdentityRelay,
 *  updateDefaultId,
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
        : removeIdentity(storageIdKeys[i]) && (rightIds > 0 && rightIds - 1);
    }

    return rightIds > 0;
  }

  /**
   * Create an identity with address and data received.
   * This is defined to create it in the storage selected, not in the Relay.
   *
   * @param {Object} data - with the data of the identity
   * @returns {Object} With the identity created or an Error if already existed
   */
  function _checkIdentitySchema(data) {
    let newIdentity;

    if (!_getIdentity(data.address)) { // if doesn't exist identity
      newIdentity = schemas.parseIdentitySchema(data);
    } else {
      throw new Error('Identity already exists');
    }

    return newIdentity;
  }

  /**
   * Create the keys of an identity and sets them in the storage selected.
   *
   * @param {string} passphrase - to sign the keys
   * @param {string} storage - where to store this information
   * @returns {{keyRecovery: string, keyRevoke: string, keyOp: string. keyContainer: Object}}
   */
  function _createKeys(passphrase) {
    const keysContainer = new iden3.KeyContainer(DAL.storageName);
    keysContainer.unlock(passphrase);
    const newKeys = keysContainer.generateKeysMnemonic();
    const [keyRecovery, keyRevoke, keyOp] = newKeys.keys;

    return {
      keyRecovery, keyRevoke, keyOp, keysContainer, mnemonic: newKeys.mnemonic,
    };
  }

  /**
   * Check if exists an identity in the current storage.
   *
   * @param {string} iddAddr - Counterfactual address of the identity sent by the Relay.
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
   * Check if an identity is consistent. It means that has iddAddr field, keys object
   * with their keys, a key container object, a Relay object and a name or label field.
   *
   * @param {object} identity - Retrieved from the selected store
   * @returns {boolean} - True if this identity is consistent and has right data, False otherwise
   *
   * TODO: not the best check. Light check only looking if values exist. So need to improve it a lot.
   *
   */
  function _isIdentityConsistent(identity) {
    return schemas.compareSchemas(SCHEMAS.IDENTITY, identity);
  }

  /**
   * Create a Relay object with its prototype and new keys before call the Relay with the new identity data.
   *
   * @param {string} passphrase - To unlock keys for some seconds and create the keys
   * @param {string} relayAddress - URL of the Relay in which create the identity
   * @returns {{id: Id, keys: (*|{keyRecovery: string, keyRevoke: string, keyOp: string, keyContainer: Object}), relay: (*|Object)}}
   */
  function _prepareCreateIdentity(passphrase, relayAddress) {
    if (passphrase && relayAddress) {
      const keys = _createKeys(passphrase);
      const relay = setIdentityRelay(relayAddress);

      return {
        id: createId(
          { recovery: keys.keyRecovery, revoke: keys.keyRevoke, operational: keys.keyOp },
          relay.url,
        ),
        keys,
        relay,
      };
    }

    throw new Error('No passphrase or relay address set');
  }

  /**
   * Call to the Relay to bind the label/name of an identity to an address.
   *
   * @param {Object} identity - With its information, above all, it's needed the keys and the id address
   * @param {Object} data - With label or name field to bind it to the identity
   * @param {string} passphrase - to sign the petition
   * @returns {Promise<void>}
   */
  function bindIdToUsername(identity, data, passphrase) {
    let identityUpdated = {};

    identity.keys.container.unlock(passphrase);
    API.bindIdToUsername(identity, data.label || data.name)
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
   * @returns {iden3.Id}
   */
  function createId(keys, relayURL, idAddress = '') {
    const id = new iden3.Id(
      keys.recovery,
      keys.revoke,
      keys.operational,
      new iden3.Relay(relayURL), // to get the prototype
      '',
    );

    id.idaddr = idAddress;
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
   * @returns {Promise<any>} Return a Promise with the field "address" that contains
   * the address of the counterfactual contract of the new identity
   */
  function createIdentity(data, passphrase, isDefault = false, relayAddr = APP_SETTINGS.RELAY_ADDR) {
    const identity = _prepareCreateIdentity(passphrase, relayAddr);

    return new Promise((resolve, reject) => {
      API.createIdentity(identity.id)
        .then((address) => {
          // once we have the address returned by the ID, set it in the local storage
          const newIdentity = _checkIdentitySchema({
            address, ...identity, ...data, passphrase, isDefault,
          });

          if (newIdentity && createIdentityInStorage(newIdentity)) {
            if (newIdentity.isDefault) {
              setIdentityAsDefault(newIdentity);
            }
            resolve(newIdentity);
          } else {
            reject(new Error('New identity could not be created'));
          }
        })
        .catch(error => reject(new Error(error)));
    });
  }

  /**
   * Create identity in the storage requested.
   *
   * @param {Object} identity - With identity information
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

    for (let i = 0; i < idsInStorageLength; i++) {
      const idKey = idsInStorage[i];
      const idFromStorage = DAL.getItem(idKey);
      const identity = idFromStorage;
      const keysContainerProto = Object.getPrototypeOf(new iden3.KeyContainer(APP_SETTINGS.LOCAL_STORAGE));

      // set again prototypes of the objects because can't be stored in the local storage
      // TODO: Change this in iden3js to get functions, because now returning Objects that can't be stored in Local Storage
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

      ids[idFromStorage.address] = identity;
    }

    return Promise.resolve(ids);
  }

  /**
   * Returns the default identity from the storage.
   *
   * @returns {string} - With the default identity address
   */
  function getDefaultIdentity() {
    return DAL.getItem(`${APP_SETTINGS.ST_DEFAULT_ID}`);
  }

  /**
   * Remove from the storage the identity key-value.
   *
   * @param {string} identityKey - With format 'id-Address of the id'
   * @param {string} storage - where to store this information
   * @returns {boolean} True if removed, false otherwise
   */
  function removeIdentity(identityKey) {
    return DAL.deleteItem(identityKey);
  }

  /**
   * Set the new default identity which is the one loaded now in the app.
   * Set the field isDefault inside the identity and the key indicating which identity is the default
   * in the selected storage.
   *
   * @param {Object} identity - With the information of the new identity that will be the default
   * @throws Will throw an error if the no identity provided.
   * @returns {boolean} - True if could be updated, false, otherwise
   */
  function setIdentityAsDefault(identity = null) {
    const currentDefaultIdKey = DAL.getItem(`${APP_SETTINGS.ST_DEFAULT_ID}`);
    const currentDefaultId = _getIdentity(currentDefaultIdKey);

    // set the former default identity to false
    if (currentDefaultId) {
      currentDefaultId.isDefault = false;
      DAL.updateItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${currentDefaultId.address}`, currentDefaultId);
    }

    // set the new default identity
    if (identity) {
      DAL.updateItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${identity.address}`, identity);
      DAL.updateItem(`${APP_SETTINGS.ST_DEFAULT_ID}`, identity.address);
      return true;
    }

    throw new Error('No identity provided to set as default');
  }

  /**
   * Create the object with the Relay information
   *
   * @param {string} relay - The url of the relay
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
  function updateDefaultId() {
    // set the object storage
    const defaultIdAddr = DAL.getItem(APP_SETTINGS.ST_DEFAULT_ID);
    const identity = DAL.getItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${defaultIdAddr}`);

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
      const existsDefaultID = DAL.getItem(`${APP_SETTINGS.ST_DEFAULT_ID}`);
      const identitiesNumber = DAL.getItem(`${APP_SETTINGS.ST_IDENTITIES_NUMBER}`);

      // if does not exist field of default id or if ther are zero identities number
      if (!existsDefaultID || (existsDefaultID && identitiesNumber && identitiesNumber === 0)) {
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
   * @returns {boolean} - True if was updated the number, false otherwise
   */
  function updateIdentitiesNumber(isToAdd) {
    const idsNumberItem = DAL.getItem(APP_SETTINGS.ST_IDENTITIES_NUMBER);
    const idsNumber = idsNumberItem ? 0 : idsNumberItem;

    // if it's the first identity set it as default
    if (idsNumber === 0) {
      setIdentityAsDefault();
    }

    return isToAdd
      ? DAL.updateItem(APP_SETTINGS.ST_IDENTITIES_NUMBER, idsNumber + 1)
      : idsNumber > 0 && DAL.updateItem(APP_SETTINGS.ST_IDENTITIES_NUMBER, idsNumber - 1);
  }

  return {
    bindIdToUsername,
    createId,
    createIdentity,
    createIdentityInStorage,
    deleteAllIdentities,
    getAllIdentities,
    getDefaultIdentity,
    removeIdentity,
    setIdentityAsDefault,
    setIdentityRelay,
    updateDefaultId,
    updateIdentity,
    updateIdentitiesNumber,
  };
}());

export default identitiesHelper;
