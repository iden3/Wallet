import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as FORMS from 'constants/forms';
import { TYPE as NOTIFICATIONS } from 'constants/notifications';
import { notificationsHelper } from 'helpers';
import classNames from 'classnames';
import {
  Button,
  Icon,
  Input,
} from 'base_components';

import './step-set-passphrase.scss';

/**
 * View that belong to the steps for creating an identity.
 * It shows to inputs asking for a passphrase.
 */
class StepSetPassphrase extends PureComponent {
  static propTypes = {
    /*
      Callback triggered when one of the action buttons are pressed
     */
    move: PropTypes.func.isRequired,
    /*
     Callback to retrieve the value of the passphrase form is there was any before moving
     over the different views of the wizard
     */
    getFormValue: PropTypes.func.isRequired,
    /*
     Callback to update the passphrase
     */
    updateForm: PropTypes.func.isRequired,
    setPassphrase: PropTypes.func.isRequired,
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
    this.props.move('backwards');
  };

  /**
   * Before moving forward to next screen check if both inputs
   * have the same value. If not, a notification is shown.
   */
  moveForward = async () => {
    this._updatePassphrase();
    // move backwards
    if (this.state.passphrase !== this.state.repeatedPasshphrase) {
      // show error nofitication
      this.setState({ areSamePassphrases: false });
      // show notification with error
      notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        description: 'Is not the same passphrase in both fields',
      });
    } else if (this.state.passphrase.length === 0 || this.state.repeatedPasshphrase.length === 0) {
      // show error nofitication
      this.setState({ areSamePassphrases: false });
      // show notification with error
      notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        description: 'Passphrase can\'t be empty',
      });
    } else {
      // move forward
      this.setState({ areSamePassphrases: true });
      await this.props.setPassphrase(this.state.passphrase);
      this.props.move('forward');
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
    this.props.updateForm(FORMS.PASSPHRASE,
      {
        first: this.state.passphrase,
        second: this.state.repeatedPasshphrase,
      });
  }

  render() {
    const inputClasses = classNames({
      'i3-ww-ci__passphrase-inputs': true,
      'i3-ww-input--error': !this.state.areSamePassphrases,
    });

    return (
      <div className="i3-ww-ci__step i3-ww-ci__passphrase">
        <div className="i3-ww-ci__title">
          <p className="i3-ww-title">Create a passphrase</p>
        </div>
        <div className="i3-ww-ci__content">
          <p>
            Secure your identity to encrypt your private key.
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
          <div className={inputClasses}>
            <form>
              <div className="i3-ww-ci__input-wrapper">
                <Input
                  placeholder="Enter a passphrase"
                  value={this.state.passphrase}
                  onChange={e => this.handleInputChange(e.target.value, 'passphrase')}
                  isPasswordType />
              </div>
              <div className="i3-ww-ci__input-wrapper">
                <Input
                  placeholder="Repeat the passphrase"
                  value={this.state.repeatedPasshphrase}
                  onChange={e => this.handleInputChange(e.target.value, 'repeatedPasshphrase')}
                  isPasswordType />
              </div>
            </form>
          </div>
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
            Next
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  }
}

export default StepSetPassphrase;
