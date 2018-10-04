import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Button, Icon,
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
     Callback triggered when there is an error about the passphrase to show a notification
     */
    showNotification: PropTypes.func.isRequired,
  };

  state = {
    passphrase: '',
    repeatedPasshphrase: '',
    areSamePassphrases: true,
    passphraseIsMasked: true,
    repeatedPasshphraseIsMasked: true,
  };

  /**
   * Triggered when user clicks in the "eye" button to toggle the view of
   * way they are typing. So state is set to the opposite value that was set
   * to set the type of each input as password or test
   * @param {string} input - should be 'passphrase' or 'repeatedPasshphrase'
   */
  changeInputMask = (input) => {
    if (input === 'passphrase' || input === 'repeatedPasshphrase') {
      const inputState = `${input}IsMasked`;
      this.setState(prevState => ({ [inputState]: !prevState[inputState] }));
    }
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
   * Before moving forward to next screen check if both inputs
   * have the same value. If not, a notification is shown.
   */
  moveForward = () => {
    if (this.state.passphrase !== this.state.repeatedPasshphrase) {
      this.setState({ areSamePassphrases: false });
      // show notification with error
      this.props.showNotification('error', {
        message: 'Error',
        description: 'Passphrases don\'t have the same value',
        style: {
          background: '#f95555',
          color: 'white',
        },
      });
    } else {
      // move forward
      this.setState({ areSamePassphrases: true });
      this.props.move('forward');
    }
  };

  /**
   * Set the icon with an eye to indicate an user that can click to
   * toggle the view of what they are writing. Set the proper handlers
   * regarding the input. With the key, triggers the callback the keys
   * Enter or Space
   * @param {string} input - Should be 'passphrase' or 'repeatedPassphrase'
   * @returns {element} React element with Icon eye and proper handlers
   */
  setViewIcon = (input) => {
    return (
      <div
        role="button"
        tabIndex={0}
        onKeyUp={(e) => {
          (e.key === 'Enter' || e.key === ' ') && this.changeInputMask(input);
        }}
        onClick={() => this.changeInputMask(input)}>
        <Icon type="eye" />
      </div>);
  };

  render() {
    const inputClasses = classNames({
      'i3-ww-steps-new-identity__passphrase-inputs': true,
      'i3-ww-input--error': !this.state.areSamePassphrases,
    });

    return (
      <div className="i3-ww-steps-new-identity__passphrase">
        <div className="i3-ww-step__title">
          <p className="i3-ww-title">Create a passphrase</p>
        </div>
        <div className="i3-ww-step__content">
          <p>
            Secure your identity to encrypt your private key.
            A good passphrase
            {' '}
            <span className="i3-ww-step__content-description1--bold">
            should have at least 15 characters with upper and lower case letters,
            digits and some special character.
            </span>
            <span className="i3-ww-step__content-description2">
            But it should be a text which you are able to remember,
              {' '}
            since it will be asked in some of your activities with your identity.
            </span>
          </p>
          <div className={inputClasses}>
            <form>
              <Input
                autoComplete="off"
                value={this.state.passphrase}
                type={this.state.passphraseIsMasked ? 'password' : 'text'}
                placeholder="Enter a passphrase"
                onChange={e => this.handleInputChange(e.target.value, 'passphrase')}
                addonAfter={this.setViewIcon('passphrase')} />
              <Input
                autoComplete="off"
                value={this.state.repeatedPasshphrase}
                type={this.state.repeatedPasshphraseIsMasked ? 'password' : 'text'}
                placeholder="Repeat the passphrase"
                onChange={e => this.handleInputChange(e.target.value, 'repeatedPasshphrase')}
                addonAfter={this.setViewIcon('repeatedPasshphrase')} />
            </form>
          </div>
        </div>
        <div className="i3-ww-step__buttons">
          <Button
            onClick={() => this.props.move('backwards')}
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
