import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Map as ImmutableMap } from 'immutable';
import {
  withFormsValues,
  withIdentities,
} from 'hocs';
import * as FORMS from 'constants/forms';
import {
  utils,
  notificationsHelper,
} from 'helpers';
import * as BOX_CONSTANTS from 'constants/box';
import { TYPE as NOTIFICATIONS } from 'constants/notifications';
import { Wizard } from 'views';
import {
  Box,
} from 'base_components';
import {
  AskForPassphrase,
  ShowSeed,
  AskForSeed,
  ShowQR,
} from '../components';

import './save-seed-wizard.scss';

const sortedSteps = [
  AskForPassphrase,
  ShowSeed,
  AskForSeed,
  ShowQR,
];

/**
* Class that creates the view to show the wizard of save the master seed.
* It trigger a Box with the content inside.
* sortedSteps array indicates the order of the steps. Please, change there the order if needed.
* Visibility is not the responsibility of this component. Should be received in the props
* from the component (usually a button) that triggers this wizard-
*/
class SaveSeedWizard extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    /*
      Callback to change the visibility
    */
    toggleVisibility: PropTypes.func.isRequired,
    //
    // from withFormsValues HOC
    //
    /*
      Action to set a new passphrase in the app state
     */
    handleUpdateForm: PropTypes.func.isRequired,
    /*
     Selector to retrieve the value of a form
     */
    getForm: PropTypes.func.isRequired,
    //
    // from withIdentities HoC
    //
    /*
     Selector to get the current loaded identity information
     */
    currentIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
    /*
     Action creator to update the master seed has been saved
     */
    handleSetMasterSeedAsSaved: PropTypes.func.isRequired,
    /*
     Action to get decrypted master seed sending the passphrase introduced
    */
    handleGetIdentityMasterSeed: PropTypes.func.isRequired,
  }

  state = {
    masterSeed: '',
    passphrase: '',
  }

  /**
   * Get the fields of the two inputs of when passphrase is asked
   * just to fill them if we are moving forward or backwards to the
   * that step.
   */
  componentDidMount() {
    this.props.getForm(FORMS.PASSPHRASE);
    this.props.getForm(FORMS.SHOW_SEED);
  }

  componentWillUnmount() {
    this.removePassphrase();
    this.removeMasterSeed();
  }

  /**
   */
  checkIntroducedMasterSeed = (givenMasterSeed) => {
    return new Promise((resolve, reject) => {
      this.props.handleGetIdentityMasterSeed(this.props.currentIdentity, this.state.passphrase)
        .then((decryptedMasterSeed) => {
          if (decryptedMasterSeed === givenMasterSeed) {
            this.removePassphrase();
            resolve();
          } else {
            const errMsg = 'Ooops! We are sorry! Not the same words :(';
            notificationsHelper.showNotification({
              type: NOTIFICATIONS.ERROR,
              description: errMsg,
            });
            reject(new Error(errMsg));
          }
        })
        .catch((error) => {
          notificationsHelper.showNotification({
            type: NOTIFICATIONS.ERROR,
            description: `Something went wrong checking the introduced seed. \n ${error.msg}`,
          });
        });
    });
  }

  /**
  * Remove the master seed from the state, hide the wizard box
  * and call the action to set the master seed flag as saved
  * to don't show anymore any UI warning
  */
  finishWizard = () => {
    return new Promise((resolve) => {
      this.props.toggleVisibility();
      this.setAsSaved();
      resolve();
    });
  }

  /**
  * Trigger action to retrieve the decrypted master seed.
  * Clear the passphrase from the state and store it in the state to
  * send it to the step that shows the master seed to the user.
  *
  * @param passphrase - Introduced by the user
  */
  getDecryptedMasterSeed = (passphrase) => {
    return new Promise((resolve) => {
      this.props.handleGetIdentityMasterSeed(this.props.currentIdentity, passphrase)
        .then((decryptedMasterSeed) => {
          this.setMasterSeed(decryptedMasterSeed);
          this.setPassphrase(passphrase);
          resolve();
        })
        .catch(() => notificationsHelper.showNotification({
          type: NOTIFICATIONS.ERROR,
          description: 'Something went wrong decrypting the master seed.\nIs your passphrase correct?',
        }));
    });
  }

  removePassphrase = () => {
    this.setState({ passphrase: '' });
  }

  removeMasterSeed = () => {
    this.setState({ masterSeed: '' });
  }

  /*
  * Set the master seed in the component state
  */
  setMasterSeed = (decryptedMasterSeed) => {
    this.setState({ masterSeed: decryptedMasterSeed });
  }

  setPassphrase = (passphrase) => {
    this.setState({ passphrase });
  }

  /*
  * Callback to set in the store that seed has already saved.
  * Already iden3js will be informed to set it.
  */
  setAsSaved = () => {
    this.props.handleSetMasterSeedAsSaved();
  }

  /**
   * Call the action to update the form in the app state.
   *
   * @param {string} form - from one of the forms in the app (given from a constants file)
   * @param {object} newValues - with the new values
   */
  updateForm = (form, newValues) => {
    this.props.handleUpdateForm(form, newValues);
  }

  /**
  * Create the object to send to the Wizard component with the content of each step and titles/subtitles
  * @private
  */
  _getSortedSteps = () => {
    return [
      {
        content: sortedSteps[0],
        ownProps: {
          updateForm: this.updateForm,
          getFormValue: this.props.getForm,
          getMasterSeed: this.getDecryptedMasterSeed,
        },
        classes: ['i3-ww-save-master-seed__passphrase'],
        title: 'Keep your master seed phrase',
        subtitle: 'Introduce your passphrase',
      },
      {
        content: sortedSteps[1],
        ownProps: {
          updateForm: this.updateForm,
          getFormValue: this.props.getForm,
          masterSeed: this.state.masterSeed,
        },
        classes: ['i3-ww-save-master-seed__show'],
        title: 'Your one and only master seed phrase',
      },
      {
        content: sortedSteps[2],
        ownProps: {
          updateForm: this.updateForm,
          getFormValue: this.props.getForm,
          checkIntroducedSeed: this.checkIntroducedMasterSeed,
        },
        classes: ['i3-ww-save-master-seed__write'],
        title: 'Introduce master seed phrase',
      },
      {
        content: sortedSteps[3],
        ownProps: {
          finishWizard: this.finishWizard,
          masterSeed: this.state.masterSeed,
          identityAddress: this.props.currentIdentity.get('address'),
        },
        classes: ['i3-ww-save-master-seed__saved'],
        title: 'Last step!',
      },
    ];
  }

  render() {
    const sortedStepsObj = this._getSortedSteps();
    const content = (
      <Wizard
        isVisible={this.props.isVisible}
        toggleVisibility={this.props.toggleVisibility}
        className="i3-ww-ssw"
        sortedSteps={sortedStepsObj}
        lastAction={this.setSeedAsSaved} />
    );

    return (
      <div>
        <Box
          type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
          side={BOX_CONSTANTS.SIDE.RIGHT}
          onClose={this.props.toggleVisibility}
          content={content}
          title={utils.capitalizeFirstLetter('Keep your keys')}
          show={this.props.isVisible} />
      </div>
    );
  }
}

export default compose(
  withFormsValues,
  withIdentities,
)(SaveSeedWizard);
