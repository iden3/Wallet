import iden3 from 'iden3';
import bip39 from 'bip39';
import LocalStorage from 'helpers/local-storage';
import * as APP_SETTINGS from 'constants/app';

const ls = new LocalStorage(APP_SETTINGS.ST_DOMAIN);

const identitiesHelper = {
  /**
   * Return the interface of the storage in which we are keep the data
   * (localStorage, USB, etc...)
   *
   * @param {string} storage - type of storage selected
   * @returns {Object} - With the interface/API of the storage selected
   */
  getStorage(storage) {
    switch (storage) {
      case (APP_SETTINGS.LOCAL_STORAGE):
        return ls;
      default:
        return ls;
    }
  },

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
  isIdentityConsistent(identity) {
    return !!(identity.idAddr
    && identity.keys
    && identity.keys.keyOp
    && identity.keys.keyRecovery
    && identity.keys.keyRevoke
    && identity.id
    && identity.id.relay
    && identity.id.keyOperational
    && identity.id.keyRecover
    && identity.id.keyRevoke
    && identity.id.idaddr
    && identity.id.implementation.constructor === String // because use to be ""
    && identity.relay);
  },

  /**
   * Create an identity with address and data received.
   * This is defined to create it in the storage selecte, not in the Relay.
   *
   * @param {string} idAddr - Counterfactual address of the new identity (sent by the Relay)
   * @param {Object} data - with the data of the identity
   * @param {string} data.label - First time is empty
   * @param {Object} data.keys - With the keys of recovery, revoke and operational
   * @param {Array} data.seed - With the words of seed of the identity
   * @param {Object} data.relay - Object with the Relay information, sucha as the url field
   * @param {string} storage - where to store this information
   * @returns {boolean} True if created successfully, false otherwise
   */
  createIdentity(idAddr, data, storage = APP_SETTINGS.LOCAL_STORAGE) {
    // set the object storage
    const _storage = this.getStorage(storage);

    // if doesn't exist identity
    if (!this.getIdentity(idAddr)) {
      // update the counter of the number of identities in the LS
      const mnemonic = bip39.generateMnemonic();
      const key = `id-${idAddr}`;
      const value = {
        label: '',
        keys: {
          recovery: data.keys.keyRecovery,
          revoke: data.keys.keyRevoke,
          operational: data.keys.keyOp,
          container: data.keys.keyContainer,
        },
        relay: data.relay,
        mnemonic,
        isDefault: false,
      };
      return _storage.setItem(key, value); // returns a boolean
    }

    // if already exists
    return false;
  },

  /**
 * Create the keys of an identity and sets them in the storage selected
 *
 * @param {string} passphrase - to sign the keys
 * @param {string} storage - where to store this information
 * @returns {{keyRecovery: string, keyRevoke: string, keyOp: string. keyContainer: Object}}
 */
  createKeys(passphrase, storage = APP_SETTINGS.LOCAL_STORAGE) {
    const keyContainer = new iden3.KeyContainer(storage.toLowerCase());
    // keyContainer.unlock(passphrase); // for 30 seconds available
    keyContainer.unlock('a');
    const keyRecovery = keyContainer.generateKey();
    const keyRevoke = keyContainer.generateKey();
    const keyOp = keyContainer.generateKey();

    return {
      keyRecovery, keyRevoke, keyOp, keyContainer,
    };
  },

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
 * @param {string} storage - where to get the information
 * @returns {boolean} - True if identities exist and they have right information, false, otherwise
 */
  areIdentitiesConsistent(storage = APP_SETTINGS.LOCAL_STORAGE) {
    let rightIds = 0;
    const _storage = this.getStorage(storage);
    const storageIdKeys = _storage.getKeys('id-0x');
    const storageKeysLength = storageIdKeys.length;

    for (let i = 0; i < storageKeysLength; i++) {
      const currentItem = _storage.getItem(storageIdKeys[i]);
      const isIdConsistent = this.isIdentityConsistent(currentItem, storage);
      rightIds = isIdConsistent
        ? rightIds + 1
        : this.removeIdentity(storageIdKeys[i]) && (rightIds > 0 && rightIds - 1);
    }

    return rightIds > 0;
  },

  /**
 * Get from the storage all the identities stored and their information.
 * Usually used (i.e.) first time we load the application to hydrate the app state.
 *
 * @param {string} storage - type of storage selected
 * @returns {Promise<any>} - Promise with an Object containing the identities and their information
 */
  getAllIdentities(storage = APP_SETTINGS.LOCAL_STORAGE) {
    const _storage = this.getStorage(storage);
    const idsInStorage = _storage.getKeys('id-0x');
    const idsInStorageLength = idsInStorage.length;
    const ids = {};

    for (let i = 0; i < idsInStorageLength; i++) {
      const idKey = idsInStorage[i];
      const idFromStorage = _storage.getItem(idKey);
      ids[idFromStorage.idAddr] = idFromStorage;
    }

    return Promise.resolve(ids);
  },

  /**
 * Check if exists an identity in the current localStorage
 * @param {string} iddAddr - Counterfactual address of the identity sent by the Relay.
 * @param {string} storage - type of storage selected
 * @returns {object | undefined} with the settings of the identity in the LS or undefined ir doesn't exist
 */
  getIdentity(iddAddr, storage = APP_SETTINGS.LOCAL_STORAGE) {
    const _storage = this.getStorage(storage);
    let identity;

    // if not identity address sent, look for the first found in the storage
    if (!iddAddr) {
      this.getAllIdentities()
        .then(ids => identity = ids[0]
        && _storage.getItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${ids[0].iddAddr}`));
    } else {
      identity = _storage.getItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${iddAddr}`);
    }

    return identity;
  },

  /**
 * Remove from the storage the identity key-value.
 *
 * @param {string} identityKey - with format 'id-Address of the id'
 * @param {string} storage - where to store this information
 * @returns {boolean} True if removed, false otherwise
 */
  removeIdentity(identityKey, storage = APP_SETTINGS.LOCAL_STORAGE) {
    const _storage = this.getStorage(storage);

    return _storage.removeItem(identityKey);
  },

  /**
 * Set the new default identity which is the one loaded now in the app.
 * Set the field isDefault inside the identity and the key indicating which identity is the default
 * in the selected storage.
 *
 * @param {Object} identity - With the information of the new identity that will be the default
 * @param {string} storage - type of storage selected
 * @returns {boolean} - True if could be updated, false, otherwise
 */
  setIdentityAsDefault(identity = null, storage = APP_SETTINGS.LOCAL_STORAGE) {
    const _storage = this.getStorage(storage);
    const newDefaultId = identity ? this.getIdentity(identity.idAddr) : this.getIdentity();
    const currentDefaultIdKey = _storage.getItem(`${APP_SETTINGS.ST_DEFAULT_ID}`);
    const currentDefaultId = this.getIdentity(currentDefaultIdKey);

    // set the former default identity to false
    if (currentDefaultId) {
      currentDefaultId.isDefault = false;
      _storage.updateKey(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${currentDefaultId.idAddr}`, currentDefaultId);
    }

    // set the new default identity
    if (newDefaultId) {
      newDefaultId.isDefault = true;
      _storage.updateKey(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${newDefaultId.idAddr}`, newDefaultId);
      _storage.updateKey(`${APP_SETTINGS.ST_DEFAULT_ID}`, newDefaultId.idAddr);
      return true;
    }

    return false;
  },

  /**
 * Create the object with the Relay information
 *
 * @param {string} relay - The url of the relay
 * @returns {Object} with the information of the relay, including the url field
 */
  setRelay(relay = APP_SETTINGS.RELAY_ADDR) {
    return new iden3.Relay(relay);
  },

  /**
 * Update the default id field in the storage. If we can't update it because
 * there are no right identities, storage is removed since all the information
 * does not make sense anymore.
 * @param {string} storage - In which set de the default identity
 * @returns {boolean} - True if success, false otherwise
 */
  updateDefaultId(storage = APP_SETTINGS.LOCAL_STORAGE) {
  // set the object storage
    const _storage = this.getStorage(storage);
    const defaultIdAddr = _storage.getItem(APP_SETTINGS.ST_DEFAULT_ID);
    const identity = _storage.getItem(`${APP_SETTINGS.ST_IDENTITY_PREFIX}-${defaultIdAddr}`);

    // the default identity is alright
    if (identity && this.isIdentityConsistent(identity)) {
      return true;
    }

    // default identity it's not ok or does not exist, get another one or remove all the storage
    const rightIds = this.areIdentitiesConsistent();

    if (rightIds > 0) {
    // if we have right id's set the de default the first that we find
      const idItems = _storage.getKeys('id-0x');

      if (idItems > 0) {
        if (_storage.setItem(`${APP_SETTINGS.ST_DEFAULT_ID}`, idItems[0])) return true;
      }
    }

    // if not default id set, and not right identities in the storage, remove the storage
    _storage.clear();
    return false;
  },

  /**
 * Update an identity with new data in the storage selected.
 *
 * @param {Object} identity - With all the data
 * @param {Object} data - With the new data to update
 * @param {string} storage - where to store this information
 * @returns {Object} - The updated identity if was updated the number, false otherwise
 */
  updateIdentity(identity, data, storage = APP_SETTINGS.LOCAL_STORAGE) {
  // set the object storage
    const _storage = this.getStorage(storage);
    const idAddrLabel = `${APP_SETTINGS.ST_IDENTITY_PREFIX}-${identity.idAddr}`;
    const _identity = _storage.getItem(idAddrLabel);

    if (_identity) {
      const updatedIdentity = Object.assign({}, identity, data);

      // if there was no identities before or default field, put it in the storage
      // to load this identity next time that wallet is loaded
      const existsDefaultID = _storage.getItem(`${APP_SETTINGS.ST_DEFAULT_ID}`);
      const identitiesNumber = _storage.getItem(`${APP_SETTINGS.ST_IDENTITIES_NUMBER}`);

      // if does not exist field of default id or if ther are zero identities number
      if (!existsDefaultID || (existsDefaultID && identitiesNumber && identitiesNumber === 0)) {
        _storage.setItem(`${APP_SETTINGS.ST_DEFAULT_ID}`, identity.idAddr);
      }

      return _storage.updateKey(idAddrLabel, updatedIdentity)
        ? updatedIdentity
        : null;
    }
    return null;
  },

  /**
 * Update the number of identities in the application.
 *
 * @param {boolean} isToAdd - True if we are adding an identity, false if we are removing it
 * @param {string} storage - where to store this information
 * @returns {boolean} - True if was updated the number, false otherwise
 */
  updateIdentitiesNumber(isToAdd, storage = APP_SETTINGS.LOCAL_STORAGE) {
  // set the object storage
    const _storage = this.getStorage(storage);
    const idsNumberItem = _storage.getItem(APP_SETTINGS.ST_IDENTITIES_NUMBER);
    const idsNumber = idsNumberItem ? 0 : idsNumberItem;

    // if it's the first identity set it as default
    if (idsNumber === 0) {
      this.setIdentityAsDefault();
    }

    return isToAdd
      ? _storage.updateKey(APP_SETTINGS.ST_IDENTITIES_NUMBER, idsNumber + 1)
      : idsNumber > 0 && _storage.updateKey(APP_SETTINGS.ST_IDENTITIES_NUMBER, idsNumber - 1);
  },

  /**
 * Returns the default identity from the storage.
 *
 * @param {string} storage - From where to get the information
 * @returns {string} - With the default identity address
 */
  getDefaultIdentity(storage = APP_SETTINGS.LOCAL_STORAGE) {
  // set the object storage
    const _storage = this.getStorage(storage);

    return _storage.getItem(`${APP_SETTINGS.ST_DEFAULT_ID}`);
  },

};

export default identitiesHelper;
