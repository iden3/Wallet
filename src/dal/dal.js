import * as APP_SETTINGS from 'constants/app';
import LocalStorageDriver from './local-storage';

let instance;

/**
 * Singleton class with the Data access layer to the possible storage.
 * It's a Factory: depending on the storage we use one driver or other
 */
class DAL {
  constructor(storageName, domain = APP_SETTINGS.ST_DOMAIN) {
    if (!instance) {
      if (storageName) {
        switch (storageName) {
          case APP_SETTINGS.LOCAL_STORAGE:
            this._storage = new LocalStorageDriver(domain);
            this._storageName = storageName;
            break;
          default:
            this._storageName = null;
            this._storage = null;
        }
        instance = this;
      } else {
        return new Error('No Storage provided');
      }
    }

    return instance;
  }

  /**
   * Getter for the storage object.
   *
   * @returns {Object} - Storage object with its prototype
   */
  get storage() {
    return this._storage;
  }

  /**
   * Setter for the storate object.
   *
   * @param {Object} storage - With the storage object with its prototype
   */
  set storage(storage) {
    if (storage) {
      this._storage = storage;
    }
  }

  /**
   * Getter of the storage used right now.
   *
   * @returns {string|null} - With the name of the storage used
   */
  get storageName() {
    return this._storageName;
  }

  /**
   * Setter for the storage name to use from now on.
   *
   * @param {string} storageName - With the name of the storage to use
   */
  set storageName(storageName) {
    if (storageName) {
      this._storageName = storageName;
    }
  }

  /**
   * Remove all the items of the application.
   *
   * @returns {*}
   */
  clear() {
    return this.storageName.clear();
  }

  /**
   * Check if exists an item in the storage. I.e. an identity.
   * Since we are storing key/values, we need the key.
   *
   * @param {string} key - Of the item to check if exists
   * @returns {boolean} - True if found, False otherwise
   */
  itemExists(key) {
    return this._storage.itemExists(key);
  }

  /**
   * Get an item from the storage.
   * Since we are storing key/values, we need the key and value is returned.
   *
   * @param {string} key - Of the item to get
   * @returns {any|null} - With the value of the item. Null if could not be found
   */
  getItem(key) {
    return this._storage.getItem(key);
  }

  /**
   * Set a new item in the storage.
   * Since we are storing key/values, we need the key and value.
   *
   * @param {string} key - Of the item to store
   * @param {any} value - Of the value to store
   * @returns {boolean} - True if created, False otherwise
   */
  setItem(key, value) {
    return this._storage.setItem(key, value);
  }

  /**
   * Delete a single item from the storage.
   * Since we are storing key/values, we need the key.
   *
   * @param {string} key - Of the item to delete
   * @returns {boolean} - True if deleted, false otherwise
   */
  deleteItem(key) {
    return this._storage.deleteItem(key);
  }

  /**
   * Updates an item that already exists in the storage.
   * Since we are storing key/values, we need the key and value.
   *
   * @param {string} key - Of the key to update
   * @param {any} value - Of the new value to set
   * @returns {boolean} - True if updated, False otherwise
   */
  updateItem(key, value) {
    return this._storage.updateItem(key, value);
  }

  /**
   * Get all the keys of the application stored.
   *
   * @param {string} prefix - Pointing of the type of the item that is going to be retrieved (i.e. 'claim-')
   * @returns {string[]} - An array with the keys
   */
  getKeys(prefix) {
    return this._storage.getKeys(prefix);
  }
}

export default DAL;
