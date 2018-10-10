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
      if (!this.doesDomainExist()) {
        this.createDomain();
      }
    }

    return instance;
  }

  get domain() {
    return this._domain;
  }

  set domain(value) {
    if (value.constructor === String) {
      this._domain = value;
    }
  }

  /**
   * Create the main key at the local storage. If it exists, return an error
   */
  createDomain = () => {
    if (!this.doesDomainExist()) {
      localStorage.setItem(this._domain, JSON.stringify({}));
    }
  };

  /**
   * Set a key value in the local storage. Should not exist before, otherwise throw an error
   * @param {string} key
   * @param {*} value
   */
  createKey = (key, value) => {
    if (this.doesDomainExist()) {
      const domainStorage = this.getDomainStorage();

      if (domainStorage) {
        if (!domainStorage[key]) {
          domainStorage[key] = value;
          localStorage.setItem(this._domain, JSON.stringify(domainStorage));
          return true;
        }
        throw new Error(`Can not create Key ${key} because already exists`);
      }
    }

    throw new Error(`Can not create Key ${key} because domain ${this._domain} does not exist`);
  };

  /**
   * Check if root key of the domain exists at the local storage
   * @returns {boolean} true if exists, false otherwise
   */
  doesDomainExist = () => {
    return !!localStorage.getItem(this._domain);
  };

  /**
   * Check if a key exists in the domain stored in the local storage
   * @param {string} key - The key to look for
   * @returns {boolean} True if exists, false otherwise
   */
  doesKeyExist = (key) => {
    if (this.doesDomainExist()) {
      const values = this.getDomainStorage();
      return !!values[key];
    }
    return false;
  };

  /**
   * Get the key and its information from local storage of the root of current domain.
   * @returns {any} with the information in the local storage of the domain
   */
  getDomainStorage = () => {
    return JSON.parse(localStorage.getItem(this._domain));
  };

  /**
   * Remove the domain root from local storage.
   * This operation causes set to null the instance of this singleton class.
   * So it's needed to call constructor again to create again the domain.
   */
  removeDomain = () => {
    const domainStorage = this.doesDomainExist();

    if (domainStorage) {
      localStorage.removeItem(this._domain);
      instance = null;
      return true;
    }

    throw new Error(`Can not remove domain ${this._domain} because it does not exist`);
  };

  /**
   * Remove a key from the local storage. If it does not exist
   * throw an error
   * @param {string} key to update
   */
  removeKey = (key) => {
    if (this.doesDomainExist()) {
      const domainStorage = this.getDomainStorage();

      if (domainStorage) {
        if (domainStorage[key]) {
          delete domainStorage[key];
          localStorage.setItem(this._domain, JSON.stringify(domainStorage));
          return true;
        }
        throw new Error(`Can not remove Key ${key} because it does not exist`);
      }
    }

    throw new Error(`Can not remove Key ${key} because the domain ${this._domain} does not exist`);
  };

  /**
   * Updates a key of our domain in the local storage.
   * If doesn't exist throw an error
   * @param {string} key to update
   * @param {*} newValue to update
   */
  updateKey = (key, newValue) => {
    if (this.doesDomainExist()) {
      const domainStorage = this.getDomainStorage();

      if (domainStorage && domainStorage[key]) {
        if (domainStorage[key]) {
          domainStorage[key] = newValue;
          localStorage.setItem(this._domain, JSON.stringify(domainStorage));
          return true;
        }
        throw new Error(`Can not update Key ${key} because it does not exist`);
      }
    }

    throw new Error(`Can not update Key ${key} because the domain ${this._domain} does not exist`);
  }
}

export default LocalStorage;
