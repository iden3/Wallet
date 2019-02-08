import iden3 from '@iden3/iden3';
import DALFactory from 'dal';
import * as APP_SETTINGS from 'constants/app';
let instance;

class Keys {
  constructor() {
    if (!instance) {
      this.db = new iden3.Db();
      this.DAL = new DALFactory(APP_SETTINGS.LOCAL_STORAGE);
      this.container = new iden3.KeyContainer(this.DAL.storageName, this.db);
    }
    return this;
  }
}

export default Keys;
