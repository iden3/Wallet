import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  withIdentities,
} from 'hocs';
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
  ReadQR,
  AskForConfirmation,
} from '../components';

import './read-qr-wizard.scss';

const sortedSteps = [
  ReadQR,
  AskForConfirmation,
];

class ReadQRWizard extends Component {
  static propTypes = {
    loginCB: PropTypes.func,
    toggleVisibility: PropTypes.func,
  };

  static defaultProps = {
    loginCB: () => {},
  };

  /**
   * Remove the master seed from the state, hide the wizard box
   * and call the action to set the master seed flag as saved
   * to don't show anymore any UI warning
   */
  finishWizard = () => {
    return new Promise(async (resolve, reject) => {
      const response = await this.props.loginCB();
      if (response) {
        this.props.toggleVisibility();
        resolve();
      } else {
        reject(response);
      }
    });
  };

  _getSortedSteps = () => {
    return [
      {
        content: sortedSteps[0],
        ownProps: {
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
  };

  render() {
    return (
      <div />
    );
  }
}

export default compose(
  withIdentities,
)(ReadQRWizard);
