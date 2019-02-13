import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Map as ImmutableMap } from 'immutable';
import {
  withAuthorizations,
  withIdentities,
} from 'hocs';
import {
  notificationsHelper,
  utils,
} from 'helpers';
import { TYPE as NOTIFICATIONS } from 'constants/notifications';
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
    //
    // from withIdentities HoC
    //
    /*
     Selector to get the current loaded identity information
     */
    currentIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
    //
    // from withAuthorizations HoC
    //
    handleCAppSignIn: PropTypes.func.isRequired,
    /*
     Flag to know if we are doing an async call
     */
    isFetchingAuthorization: PropTypes.bool.isRequired,
  };

  state = {
    signInData: '',
  };

  /**
   *
   * @param {Object} signIngData - With the data related to the QR or code introduced
   */
  handleReadData = (signInData) => {
    try {
      const parsedData = utils.parseQRInfoToSignIn(signInData);
      if (!parsedData.body) {
        throw new Error();
      } else {
        this.setState({ signInData: parsedData });
        return true;
      }
    } catch {
      notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        message: 'There is an error!',
        description: 'Sorry! We can not understand the read code',
      });
      return false;
    }
  };

  /**
   * Confirm sign in. So, toggle the visibility of the wizard and call
   * the third party call back (back end) with the permission signed
   */
  handleConfirmSignIn = (passphrase) => {
    this.props.handleCAppSignIn(this.props.currentIdentity, passphrase, this.state.signInData)
      .then(() => {
        this.props.toggleVisibility();
        notificationsHelper.showNotification({
          type: NOTIFICATIONS.SUCCESS,
          message: 'Oh yes!',
          description: `You have signed in at ${this.state.signInData.body.data.origin}`,
        });
      })
      .catch(error => notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        message: 'Sig in error!',
        description: `OooopS! Something went wrong! ${error}`,
      }));
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
          identityLabel: this.props.currentIdentity.get('label'),
          identityDomain: this.props.currentIdentity.get('domain'),
          isFetching: this.props.isFetchingAuthorization,
        },
        classes: ['i3-ww-confirm-sign-in'],
        title: 'Confirm',
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
  withAuthorizations,
)(SignInPermission);
