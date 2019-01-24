import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  Chip,
} from 'base_components';
import {
  FORWARD,
} from 'constants/wizard';

import './step-show-seed.scss';

/**
* Show the words to the user in order they can write it down.
* Each word is shown into a Chip component.
*/
class ShowSeed extends PureComponent {
  static propTypes = {
    /*
     Call back to handle the wizard movement to another step
    */
    move: PropTypes.func.isRequired,
    /*
     The decrypted master seed to keep by the user (use to be mnemonic of some words)
    */
    masterSeed: PropTypes.string.isRequired,
  }

  /*
  * Callback to handle the forward movement to next wizard step
  */
  moveForward = () => {
    this.props.move(FORWARD);
  }

  render() {
    return (
      <div className="i3-ww-ssw__show-master-seed">
        <div>
          <p>
            This is your mnemonic phrase for all your identities.
            <br />
            <br />
            <b>It is of vital importance that you keep it in a safe place (i.e. in a bank).</b>
            <br />
            <br />
            Keep in mind that if you lose it, you will not be able to recover any of your identities.
            Write it down or print this screen because in the next step you should to introduce it again,
            so that we are sure you have kept it.
          </p>
        </div>
        <div>
          <div className="i3-ww-ssw__master-seed">
            {this.props.masterSeed
              .split(' ')
              .map((word, index) => (<Chip content={word} key={`chip-${index}`} />))
            }
          </div>
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

export default ShowSeed;
