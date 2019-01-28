import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  withIdentities,
} from 'hocs';
import {
  utils,
} from 'helpers';
import * as BOX_CONSTANTS from 'constants/box';
import { Wizard } from 'views';
import {
  Box,
} from 'base_components';
import {
  ReadQROrCode,
  AskForPermissionToSign,
} from '../../components';

import './sign-in-permission.scss';

const sortedSteps = [
  ReadQROrCode,
  AskForPermissionToSign,
];

/**
 * Wizard to sign in in a third party application.
 * User can read a QR or introduce a code. A view with
 * the clear information about where the user is going to
 * sign in is clearly shown. No claim is created. When
 * sign in is confirmed by user (accepts to sign the request)
 * a call back to the third party application back-end is sent
 * with the request signed.
 */
class SignInPermission extends Component {
  static propTypes = {
    toggleVisibility: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
  };

  state = {
    signInData: '',
  };

  /**
   * Remove the master seed from the state, hide the wizard box
   * and call the action to set the master seed flag as saved
   * to don't show anymore any UI warning
   */
  finishWizard = () => {
    return new Promise(async (resolve, reject) => {
      const response = await this.props.signInCB();

      if (response) {
        this.props.toggleVisibility();
        resolve();
      } else {
        reject(response);
      }
    });
  };

  /**
   *
   * @param {Object} signIngData - With the data related to the QR or code introduced
   */
  handleReadData = (signInData) => {
    this.setState({ signInData });
  };

  handleConfirmSignIn = () => {
    console.log('-----> CONFIRM SIGN IN');
    this.props.toggleVisibility();
  };

  /**
   * Construct an array to send to the Wizard constructor with information of each step.
   *
   * @returns {Object[]} - With the information of each step
   * @private
   */
  _getSortedSteps = () => {
    return [
      {
        content: sortedSteps[0],
        ownProps: {
          isVisible: this.props.isVisible,
          handleReadData: this.handleReadData,
        },
        classes: ['i3-ww-read-qr-code-to-sign-in'],
        title: 'QR code',
        subtitle: 'Please, read the QR code or introduce it manually to sign in another application',
      },
      {
        content: sortedSteps[1],
        ownProps: {
          signInData: this.state.signInData,
          confirmSignIn: this.handleConfirmSignIn,
        },
        classes: ['i3-ww-confirm-sign-in'],
        title: 'Confirm sign in',
      },
    ];
  };

  render() {
    const sortedStepsObj = this._getSortedSteps();
    const content = (
      <Wizard
        isVisible={this.props.isVisible}
        toggleVisibility={this.props.toggleVisibility}
        className="i3-ww-sipw"
        sortedSteps={sortedStepsObj}
        lastAction={this.finishWizard} />
    );

    return (
      <div>
        <Box
          type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
          side={BOX_CONSTANTS.SIDE.RIGHT}
          onClose={this.props.toggleVisibility}
          content={content}
          title={utils.capitalizeFirstLetter('Sign in')}
          show={this.props.isVisible} />
      </div>
    );
  }
}

export default compose(
  withIdentities,
)(SignInPermission);
