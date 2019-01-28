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

class AskForMasterSeed extends PureComponent {
  static propTypes = {
    /*
     Callback thar controls the movement to next step
    */
    move: PropTypes.func.isRequired,
    /*
     Callback to check with iden3js if introduced seed is right
    */
    checkIntroducedSeed: PropTypes.func.isRequired,
  };

  state = {
    seed: '',
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
    if (this.state.seed) {
      this.props.checkIntroducedSeed(this.state.seed.trim())
        .then(() => this.props.move(FORWARD));
    }
  };

  render() {
    return (
      <div className="i3-ww-ssw__ask-seed">
        <div>
          <p>
            Please, introduce here the passphrase that we have shown you in the former step.
            We need to be sure that you have it.
            <br />
            Write as we shown you since is case sensitive and with the same blank spaces.
          </p>
        </div>
        <div>
          <form>
            <div className="i3-ww-ssw__input-wrapper">
              <Input
                placeholder="Enter here your mnemonic/seed phrase"
                value={this.state.seed}
                onChange={e => this.handleInputChange(e.target.value, 'seed')}
                isPasswordType={false} />
            </div>
          </form>
        </div>
        <div className="i3-ww-ssw__buttons">
          <Button
            onClick={this.moveForward}
            type="primary"
            htmlType="button">
            Finish
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  }
}

export default AskForMasterSeed;
