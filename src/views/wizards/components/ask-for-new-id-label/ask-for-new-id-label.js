import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as FORMS from 'constants/forms';
import * as APP_SETTINGS from 'constants/app';
import { TYPE as NOTIFICATIONS } from 'constants/notifications';
import { FORWARD, BACKWARDS } from 'constants/wizard';
import {
  Button,
  Icon,
  Input,
} from 'base_components';
import { notificationsHelper } from 'helpers';

import './ask-for-new-id-label.scss';

/**
 * Show an input to ask to users which label they want
 * TODO: Select domain regarding the Relay selected (for now mocked with @iden3.io)
 */
class AskForNewIdLabel extends PureComponent {
  static propTypes = {
    /*
     To indicate to the container next step (if moving forward or backwards)
     */
    move: PropTypes.func,
    /*
     Action to update in the app state the identity label introduced
     */
    updateForm: PropTypes.func.isRequired,
    /*
     Callback to retrieve the value of the identity label form is there
     was any before moving over the different views of the wizard
     */
    getFormValue: PropTypes.func.isRequired,
    /*
     Call back to trigger when moving forward and bind the label with the identity address
     */
    setLabel: PropTypes.func.isRequired,
  };

  state = {
    label: this.props.getFormValue(FORMS.IDENTITY_NAME),
    domain: APP_SETTINGS.DEFAULT_RELAY_DOMAIN,
  };

  /**
   * Handle the Input controlled components values when changed. Set the
   * state of each input with current  value.
   *
   * @param {string} value - from the input
   */
  handleInputChange = (value) => {
    this.setState({ label: value });
  };

  /**
   * Update the app state with the current identity label introduced
   * and trigger callback to move former view of the wizard.
   */
  moveBackwards = () => {
    this._updateForm();
    this.props.move(BACKWARDS);
  };

  /**
   * Before moving forward to next screen check, clean
   * the passphrase from the app state, we don't need it anymore.
   */
  moveForward = () => {
    const isValidLabel = this._checkLabel();

    if (isValidLabel) {
      this.props.setLabel({ label: this.state.label, domain: this.state.domain });
      this._updateForm();
      this.props.move(FORWARD);
    } else {
      // show notification with error
      notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        description: 'Not valid label, please try again.',
      });
    }
  };

  /**
   * Check if the label entered has no spaces, is an alphanumeric string
   * and if there are symbols are only allowed dashes and underscores.
   * Also, at least is necessary a letter.
   *
   * @returns {boolean} True with a valid label, false otherwise
   * @private
   */
  _checkLabel() {
    const regexp = /^(?=.*[a-zA-Z])([a-zA-Z0-9-_]+)$/;
    return this.state.label.search(regexp) !== -1;
  }

  /**
   * Trigger call back from props to update the identity
   * label in the app state.
   *
   * @private
   */
  _updateForm() {
    this.props.updateForm(FORMS.IDENTITY_NAME,
      {
        [FORMS.IDENTITY_NAME]: this.state.label,
      });
  }

  render() {
    return (
      <div className="i3-ww-ci__set-name">
        <p>
          You are almost there!
          <br />
          <br />
          Please, write an username in the selected domain to create your identity.
          Only alphanumeric characters, dashes and underscores are allowed.
          At least should have one letter.
          Not allowed other symbols (i.e. @) or spaces.
        </p>

        <div>
          <Input
            value={this.state.label}
            placeholder="Enter a name/label"
            onChange={e => this.handleInputChange(e.target.value)} />
          <span className="i3-ww-ci__relay_text">@iden3.io</span>
          {' '}
          (default Relay)
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

export default AskForNewIdLabel;
