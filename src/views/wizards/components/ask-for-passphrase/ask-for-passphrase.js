import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  Input,
} from 'base_components';
import {
  FORWARD,
} from 'constants/wizard';

import './ask-for-passphrase.scss';

class AskForPassphrase extends PureComponent {
  static propTypes = {
    /*
     Callback thar controls the movement to next step
    */
    move: PropTypes.func.isRequired,
    /*
     Callback to trigger when move forward to retrieve the decrypted master seed
    */
    getMasterSeed: PropTypes.func.isRequired,
  };

  state = {
    passphrase: '',
  };

  /**
   * Handle the Input controlled components values when changed. Set the
   * state of each input with current  value.
   *
   * @param value
   * @param input
   */
  handleInputChange = (value, input) => {
    this.setState({ [input]: value });
  };

  /*
  * Callback to handle the forward movement to next wizard step
  */
  moveForward = () => {
    if (this.state.passphrase) {
      this.props.getMasterSeed(this.state.passphrase)
        .then(() => this.props.move(FORWARD));
    }
  };

  render() {
    return (
      <div className="i3-ww-ssw__ask-passphrase">
        <div>
          <p>
            We need your passphrase to decrypt the mnemonic passphrase that you are going to keep.
            We remind you that entering a private key on a website is dangerous. Please, be sure
            that you are in an Iden3 website and it is not compromised.
          </p>
        </div>
        <div>
          <form>
            <div className="i3-ww-ssw__input-wrapper">
              <Input
                placeholder="Enter passphrase"
                value={this.state.passphrase}
                onChange={e => this.handleInputChange(e.target.value, 'passphrase')}
                isPasswordType />
            </div>
          </form>
        </div>
        <div className="i3-ww-ssw__buttons">
          <Button
            onClick={this.moveForward}
            type="primary"
            htmlType="button">
            Continue
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  }
}

export default AskForPassphrase;
