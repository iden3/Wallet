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
    /**
    * Callback that controls the movement to next step
    */
    move: PropTypes.func.isRequired,
    /**
     * Generic call back that can be different regarding the component calling this view
     */
    actionForward: PropTypes.func.isRequired,
    /**
     * Informative text to place before the input
     */
    infoText: PropTypes.string,
  };

  static defaultProps = {
    infoText: '',
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

  /**
  * Callback to handle the forward movement to next wizard step
  */
  moveForward = () => {
    if (this.state.passphrase) {
      this.props.actionForward(this.state.passphrase)
        .then(() => this.props.move(FORWARD))
        .catch(error => new Error(error.message));
    }
  };

  render() {
    return (
      <div className="i3-ww-ssw__ask-passphrase">
        {this.props.infoText
        && (
        <div>
          <p>
            {this.props.infoText}
          </p>
        </div>
        )
       }
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
