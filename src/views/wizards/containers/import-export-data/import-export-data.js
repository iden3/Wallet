import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  withImportExportData,
} from 'hocs';
import {
  notificationsHelper,
} from 'helpers';
import { Wizard } from 'views';
import {
  IMPORT,
  EXPORT,
} from 'constants/app';
import { TYPE as NOTIFICATIONS } from 'constants/notifications';
import {
  AskForImportOrExport,
  AskForPassphrase,
  WaitingStep,
} from '../../components';

import './import-export-data.scss';

const sortedSteps = [
  AskForImportOrExport,
  AskForPassphrase,
  WaitingStep,
];

/**
 * Wizard that used to import a backupt or export the data of the wallet
 */
class ImportExportData extends Component {
  static propTypes = {
    toggleVisibility: PropTypes.func.isRequired,
    //
    // from withImportExportData HOC
    //
    /*
     Import data function, upload a file and set it in the storage
    */
    importData: PropTypes.func.isRequired,
    /*
     Export data function, download to user device a file with all the storage
    */
    exportData: PropTypes.func.isRequired,
  };

  state = {
    action: '',
    passphrase: '',
    finished: false,
    goToFirstStep: false,
  };

  /**
   * Triggered when a file is selected in the system browser window to choose
   * a file to import the data in the wallet
   *
   * @param {object} file - the selected file of the system
   *
   * @returns {Promise} resolved if data was imported, rejected otherwise
   */
  handleImportFile = async (file) => {
    let importedData = false;
    let errorMsg = '';

    if (this.state.passphrase) {
      importedData = await this.props.importData(this.state.passphrase, file);
    } else {
      errorMsg = 'Please, introduce your passphrase.';
    }

    if (errorMsg || !importedData) {
      // not finished properly
      notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        description: 'File could not be decrypted. Right passphrase? Right file?',
      });
      this.setState({ goToFirstStep: true });
    }

    this.setState({ finished: true });
  };

  /**
   * To place the right info text in the last step regarding the action (import / export)
   *
   * @returns {string} with the information text
   */
  getLastStepInfoText = () => {
    if (this.state.action === EXPORT) {
      return 'Your data has been successfully exported. Please, keep it in a safe place. We remind you '
        + 'that it has been encrypted and you will need to use your passphrase to restore it.';
    }

    return 'Your backup has been successfully imported and has replaced all your wallet data.';
  };

  /**
   * To place the right title depending the state of the action and
   * if we are exporting or importing.
   *
   * @returns {string} with the title of the last step
   */
  getLastStepTitle = () => {
    if (this.state.finished) {
      if (this.state.action === EXPORT) {
        return 'Data exported';
      }
      return 'Data imported';
    }

    // not finished
    if (this.state.action === EXPORT) {
      return 'Exporting data';
    }

    // not finished and importing data
    return 'Importing backup';
  };

  /**
   * Create the object to send to the Wizard component with the content of each step and titles/subtitles
   *
   * @returns {array} with steps and their attributes
   * @private
   */
  getSortedSteps = () => {
    return [
      {
        content: sortedSteps[0],
        ownProps: {
          setAction: this.setAction,
        },
        classes: ['i3-ww-ask-for-import-or-export'],
        title: 'Manage your data',
      },
      {
        content: sortedSteps[1],
        ownProps: {
          actionForward: this.triggerAction,
        },
        title: 'Your passphrase',
        subtitle: `Please, introduce your passphrase to
                  ${this.state.action === EXPORT ? 'encrypt' : 'decrypt'} the data file`,
      },
      {
        content: sortedSteps[2],
        ownProps: {
          finishedAction: this.state.finished,
          getInfoText: this.getLastStepInfoText,
          buttonText: 'Finish',
        },
        title: this.getLastStepTitle(),
      },
    ];
  };

  /**
   * Set in the state the action to do after ask for passphrase.
   *
   * @param {string} action - should be 'import' or 'export'
   *
   * @returns {Promise} after state set with the action to do
   */
  setAction = (action) => {
    this.setState({ action });
  };

  /**
   * Do the last action, call to upload a file if importing or export data.
   *
   * @param {string} passphrase
   *
   * @returns {Promise} resolved or rejected regarding if success action
   */
  triggerAction = (passphrase) => {
    this.setState({ passphrase });
    if (this.state.action === IMPORT) {
      this.uploadFile.click();
      return Promise.resolve();
    }

    if (this.state.action === EXPORT) {
      const exported = this.props.exportData(passphrase);
      this.setState({ finished: exported });
      return Promise.resolve();
    }

    return Promise.reject(new Error('No action set: Import or export?'));
  };

  render() {
    const sortedStepsObj = this.getSortedSteps();

    return (
      <div>
        <Wizard
          className="i3-ww-my-data"
          lastAction={this.props.toggleVisibility}
          sortedSteps={sortedStepsObj}
          resetWizard={this.state.goToFirstStep}
          existsError={false} />
        <input
          type="file"
          id="i3-ww-my-data--upload-file"
          onChange={el => this.handleImportFile(el.target.files[0])}
          ref={(el) => { this.uploadFile = el; }}
          style={{ display: 'none' }} />
      </div>
    );
  }
}

export default compose(withImportExportData)(ImportExportData);
