import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as FORMS from 'constants/forms';
import { TYPE as NOTIFICATIONS } from 'constants/notifications';
import { FORWARD, BACKWARDS } from 'constants/wizard';
import { notificationsHelper } from 'helpers';
import classNames from 'classnames';
import {
  Button,
  Icon,
  Input,
} from 'base_components';

import './ask-for-new-passphrase.scss';

/**
 * View that belong to the steps for creating an identity.
 * It shows to inputs asking for a passphrase.
 */
class AskForNewPassphrase extends PureComponent {
  static propTypes = {
    /*
      Callback triggered when one of the action buttons are pressed
     */
    move: PropTypes.func,
    /*
     Callback to retrieve the value of the passphrase form is there was any before moving
     over the different views of the wizard
     */
    getFormValue: PropTypes.func.isRequired,
    /*
     Callback to update the passphrase
     */
    updateForm: PropTypes.func.isRequired,
    /*
     Callback to set the passphrase in the store
    */
    setPassphrase: PropTypes.func.isRequired,
    /*
     Flag to know is first identity or not, to show one text or other in the move forward button
    */
    isFirstIdentity: PropTypes.bool.isRequired,
  };

  state = {
    passphrase: this.props.getFormValue(FORMS.PASSPHRASE).get('first'),
    repeatedPasshphrase: this.props.getFormValue(FORMS.PASSPHRASE).get('second'),
    areSamePassphrases: true,
  };

  /**
   * Handle the Input controlled components values when changed. Set the
   * state of each input with current  value.
   * @param value
   * @param input
   */
  handleInputChange = (value, input) => {
    this.setState({ [input]: value });
  };

  /**
   * Update the app state with the current passphrase introduced
   * and trigger callback to move former view of the wizard
   */
  moveBackwards = () => {
    this._updatePassphrase();
    this.props.move(BACKWARDS);
  };

  /**
   * Before moving forward to next screen check if both inputs
   * have the same value. If not, a notification is shown.
   */
  moveForward = async () => {
    let errMsg = '';
    this._updatePassphrase();

    if (this.props.isFirstIdentity) {
      if (this.state.passphrase !== this.state.repeatedPasshphrase) {
        // show error nofitication
        this.setState({ areSamePassphrases: false });
        errMsg = 'Is not the same passphrase in both fields';
      } else if (this.state.passphrase.length === 0 || this.state.repeatedPasshphrase.length === 0) {
        // show error notification
        this.setState({ areSamePassphrases: false });
        // show notification with error
        errMsg = 'Passphrase can\'t be empty';
      }
    } else if (this.state.passphrase.length === 0) {
      // show notification with error
      errMsg = 'Passphrase can\'t be empty';
    }

    if (errMsg) {
      // show notification with error
      notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        description: errMsg,
      });
    } else {
      // move forward
      this.setState({ areSamePassphrases: true });
      await this.props.setPassphrase(this.state.passphrase);
      this.props.move(FORWARD);
    }
  };

  /**
   * Trigger the call back sent via props to update in
   * the app state the passphrasses introduced by the
   * user, just to have them if user is moving forward
   * or backwards.
   * @private
   */
  _updatePassphrase() {
    if (this.props.isFirstIdentity) {
      this.props.updateForm(FORMS.PASSPHRASE,
        {
          first: this.state.passphrase,
          second: this.state.repeatedPasshphrase,
        });
    } else {
      this.props.updateForm(FORMS.PASSPHRASE,
        {
          first: this.state.passphrase,
        });
    }
  }

  render() {
    const inputClasses = classNames({
      'i3-ww-ci__passphrase-inputs': true,
      'i3-ww-input--error': !this.state.areSamePassphrases,
    });
    const infoText = this.props.isFirstIdentity
      ? (
        <p>
          Secure your identity to encrypt your private key.
          This passphrase will be common for all your identities of your wallet.
          A good passphrase
          {' '}
          <span className="i3-ww-ci__passphrase-content-description1--bold">
            should have at least 15 characters with upper and lower case letters,
            digits and some special characters.
          </span>
          <span className="i3-ww-ci__passphrase-content-description2">
            {' '}
            But it should be a text which you are able to remember,
            {' '}
            since it will be asked in some of your activities with your identity.
          </span>
        </p>
      )
      : (
        <p>
          Please, introduce the passphrase that you created with your first identity.
        </p>
      );

    return (
      <div>
        <div>
          {infoText}
        </div>
        <div className={inputClasses}>
          <form>
            <div className="i3-ww-ci__input-wrapper">
              <Input
                placeholder="Enter a passphrase"
                value={this.state.passphrase}
                onChange={e => this.handleInputChange(e.target.value, 'passphrase')}
                isPasswordType />
            </div>
            { this.props.isFirstIdentity
            && (
              <div className="i3-ww-ci__input-wrapper">
                <Input
                  placeholder="Repeat the passphrase"
                  value={this.state.repeatedPasshphrase}
                  onChange={e => this.handleInputChange(e.target.value, 'repeatedPasshphrase')}
                  isPasswordType />
              </div>
            )
            }
          </form>
        </div>
        <div className="i3-ww-ci__buttons">
          <Button
            onClick={this.moveBackwards}
            type="primary"
            htmlType="button">
            <Icon type="left" />
            Back
          </Button>
          <Button
            onClick={this.moveForward}
            type="primary"
            htmlType="button">
            Create my identity!
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  }
}

export default AskForNewPassphrase;
