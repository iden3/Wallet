import React, { Component } from 'react';
import {
  Keys,
  utils,
} from 'helpers';

function withImportExportData(ImportExportComponent) {
  class ImportExportDataWrapper extends Component {
    constructor(props) {
      super(props);
      this.keysHelper = new Keys();
      this.keysContainer = this.keysHelper.container;
      this.db = this.keysHelper.db;
    }

    /**
     * Call iden3 helper to encrypt the data of the wallet and then
     * call utils helper to create the file and download it.
     *
     * @param {string} passphrase
     *
     * @returns {Promise}
     * */
    exportData = async (passphrase) => {
      this.keysContainer.unlock(passphrase);
      const exported = await utils.decryptUUID(passphrase);
      if (exported) {
        return utils.saveFile((this.db.exportWallet(this.keysContainer)));
      }
      return false;
    };

    /**
     * Call utils helper to select a file from the user device.
     * Once done, call iden3 helper to decrypt it.
     *
     * @param {string} passphrase
     * @param {object} file - selected by the user
     * @param {Function} onLoadCB - callback to trigger when on load ends
     *
     * @returns {Promise}
     */
    importData = (passphrase, file, onLoadCB) => {
      return utils.readFileContent(file, onLoadCB)
        .then(async (fileContent) => {
          this.keysContainer.unlock(passphrase);
          // await this.DAL.clear();
          return fileContent;
        })
        .then(fileContent => this.db.importWallet(this.keysContainer, fileContent))
        .catch(error => new Error(error));
    };

    render() {
      return (
        <ImportExportComponent
          {...this.props}
          importData={this.importData}
          exportData={this.exportData} />
      );
    }
  }

  return ImportExportDataWrapper;
}

export default withImportExportData;
