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
      this.DAL = this.keysHelper.DAL;
    }

    /**
     * Call iden3 helper to encrypt the data of the wallet and then
     * call utils helper to create the file and download it.
     *
     * @param {string} passphrase
     *
     * @returns {boolean} True if encrypted file was successfully created
     */
    exportData = (passphrase) => {
      this.keysContainer.unlock(passphrase);
      return utils.saveFile((this.db.exportWallet(this.keysContainer)));
    };

    /**
     * Call utils helper to select a file from the user device.
     * Once done, call iden3 helper to decrypt it.
     *
     * @param {string} passphrase
     * @param {object} file - selected by the user
     *
     * @returns {Promise}
     */
    importData = (passphrase, file) => {
      // const fileContent = await utils.readFileContent(file).catch(error => console.log('--->', error));

      return utils.readFileContent(file)
        .then(async (fileContent) => {
          this.keysContainer.unlock(passphrase);
          await this.DAL.clear();
          return fileContent;
        })
        .then(fileContent => this.db.importWallet(this.keysContainer, fileContent))
        .catch(error => new Error(error));

      /* await this.keysHelper.DAL.clear();
      try {
        return this.db.importWallet(this.keysContainer, fileContent);
      } catch (error) {
        throw new Error(error);
      } */

      /* return new Promise((resolve, reject) => {
        const decryptedFile = this.db.importWallet(this.keysContainer, fileContent);
        decryptedFile ? resolve(true) : reject();
      }); */
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
