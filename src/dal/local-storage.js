let instance;

/**
 *  Singleton class to access to the local storage and operate with it.
 *  If we remove the domain in the local storage, we need to instantiate again
 *  this class to set the instance.
 */
class LocalStorage {
  constructor(domainName) {
    if (!instance) {
      instance = this;
      this._domain = domainName;
    }

    return instance;
  }

  /**
   * Getter of the domain of the application (i.e: i3)
   *
   * @returns {string} - With the domain of the application
   */
  get domain() {
    return this._domain;
  }

  /**
   * Setter to the domain of the application used to store the key/values.
   * (i.e: i3)
   *
   * @param {string} value - With the chosen domain
   */
  set domain(domain) {
    if (domain && domain.constructor === String) {
      this._domain = domain;
    }
  }

  /**
   * Return all the local storage
   */
  backup = () => {
    return localStorage;
  };

  /**
   * Remove all the local storage
   */
  clear = () => {
    localStorage.clear();
  };

  /**
   * Dump all the local storage from given information.
   *
   * @param {object} data - with the data to dump to the local storage
   *
   * @returns {boolean} if all data was dump
   */
  dump = (data) => {
    let dumpedData = true;

    Object.keys(data).forEach((key) => {
      dumpedData = this.setItem(key, data[key]);
    });

    return dumpedData;
  };

  /**
   * Compose the key to search in the storage. Basically if hasn't the domain
   * as prefix, add it.
   *
   * @param {string} key - to search
   * @returns {string} - With the key well formed
   */
  composeKey(key) {
    return key.startsWith(`${this.domain}-`)
      ? key
      : `${this.domain}-${key}`;
  }

  /**
   * Check if a key exists in the domain stored in the local storage.
   *
   * @param {string} key - The key to look for
   * @returns {boolean} True if exists, false otherwise
   */
  itemExists = (key) => {
    const item = this.getItem(key);
    return item !== null && item !== undefined;
  };

  /**
   * Retrieve all the local storage.
   *
   * @returns {Storage} - All the local storage
   */
  getAll = () => {
    return localStorage;
  };

  /**
   * Get an item from the local storage with the prefix of current domain
   *
   * @param {string} key - to get from the local storage
   * @returns {any} the content stored that belong to the item sent
   */
  getItem = (key) => {
    const item = localStorage.getItem(this.composeKey(key));

    return item ? JSON.parse(item).d : null;
  };

  /**
   * Retrieve an array with all the keys in the local storage.
   * If prefix sent, return only keys with this prefix inside.
   *
   * @param {string} prefix - to check inside the value of a key
   * @returns {string[]} - with the keys retrieved
   */
  getKeys(prefix) {
    const keys = Object.keys(localStorage); // all keys
    if (prefix) {
      const keysLength = keys.length;
      const filteredKeys = [];

      for (let i = 0; i < keysLength; i++) {
        if (keys[i].includes(prefix)) filteredKeys.push(keys[i]);
      }

      return filteredKeys;
    }

    return keys;
  }

  /**
   * Remove a key from the local storage. If it does not exist
   * throw an error.
   *
   * @param {string} key - to remove
   * @returns {boolean} - True if exists key and was removed, false otherwise
   */
  deleteItem = (key) => {
    const finalKey = this.composeKey(key);

    if (this.getItem(finalKey)) { // if exists key delete it
      localStorage.removeItem(finalKey);
      return true;
    }

    return false;
  };

  /**
   * Set an item in the local storage with a prefix of the current domain.
   *
   * @param {string} key - new key to set
   * @param {*} value - data to set in with this key
   */
  setItem(key, value) {
    if (key && value !== undefined && value !== null) {
      const finalKey = this.composeKey(key);
      const data = { d: value };
      localStorage.setItem(finalKey, JSON.stringify(data));
      return true;
    }
    return false;
  }

  /**
   * Updates a key of our domain in the local storage.
   * If doesn't exist throw an error.
   *
   * @param {string} key to update
   * @param {*} newValue to update
   */
  updateItem = (key, newValue) => {
    if (this.getItem(key) !== null || this.getItem(key) !== undefined) {
      return this.setItem(key, newValue);
    }
    return false;
  }
}

export default LocalStorage;
