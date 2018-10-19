import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as FORMS from 'constants/forms';
import {
  Button,
  Icon, Input,
} from 'base_components';

import './step-set-name.scss';

/**
 * Show an input to ask to users which name they want
 * TODO: Select domain regarding the Relay selected (for now mocked with @iden3.eth)
 */
class StepSetName extends PureComponent {
  static propTypes = {
    /*
     To indicate to the container next step (if moving forward or backwards)
     */
    move: PropTypes.func.isRequired,
    /*
     Action to update in the app state the identity name introduced
     */
    updateForm: PropTypes.func.isRequired,
    /*
     Callback to retrieve the value of the identity name form is there
     was any before moving over the different views of the wizard
     */
    getFormValue: PropTypes.func.isRequired,
    /*
     Call back to trigger when moving forward and bind the label with the identity address
     */
    updateIdentity: PropTypes.func.isRequired,
  };

  state = {
    label: this.props.getFormValue(FORMS.IDENTITY_NAME),
    domain: 'iden3.eth',
  };

  /**
   * Handle the Input controlled components values when changed. Set the
   * state of each input with current  value.
   * @param {string} value from the input
   */
  handleInputChange = (value) => {
    this.setState({ label: value });
  };

  /**
   * Update the app state with the current identity name introduced
   * and trigger callback to move former view of the wizard
   */
  moveBackwards = () => {
    this._updateForm();
    this.props.move('backwards');
  };

  /**
   * Before moving forward to next screen check, clean
   * the passphrase from the app state, we don't need it anymore
   */
  moveForward = () => {
    this.props.updateIdentity({ label: this.state.label, domain: this.state.domain });
    this._updateForm();
    this.props.move('forward');
  };

  /**
   * Trigger call back from props to update the identity
   * name in the app state
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
      <div className="i3-ww-ci__step i3-ww-ci__set-name">
        <div className="i3-ww-ci__title">
          <p className="i3-ww-title">Your name</p>
        </div>
        <div className="i3-ww-ci__content">
          <span>
            You are almost there!
            <br />
            Please, insert a name in the selected domain to create your identity.
          </span>
          <div>
            <Input
              value={this.state.label}
              placeholder="Enter a name"
              onChange={e => this.handleInputChange(e.target.value)} />
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
            Go to my dashboard
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  }
}

export default StepSetName;
