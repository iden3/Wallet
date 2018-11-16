import * as APP_SETTINGS from 'constants/app';
import LocalStorageDriver from './local-storage';

/**
 * Data access layer to the possible storages.
 * It's a Factory: depending on the storage we use one driver or other
 */
class DAL {
  constructor(storage, domain = APP_SETTINGS.ST_DOMAIN) {
    switch (storage) {
      case APP_SETTINGS.LOCAL_STORAGE:
        this.storage = new LocalStorageDriver(domain);
        break;
      default:
        this.storage = null;
    }
  }

  clear() {
    return this.storage.clear();
  }

  itemExists(key) {
    return this.storage.itemExists(key);
  }

  getItem(key) {
    return this.storage.getItem(key);
  }

  setItem(key, value) {
    return this.storage.setItem(key, value);
  }

  deleteItem(key) {
    return this.storage.deleteItem(key);
  }

  deleteAllItems(items) {

  }

  updateItem(key, value) {
    return this.storage.updateItem(key, value);
  }

  getAll() {

  }

  getAllItems(items) {

  }

  getKeys(prefix) {
    return this.storage.getKeys(prefix);
  }
}

export default DAL;
