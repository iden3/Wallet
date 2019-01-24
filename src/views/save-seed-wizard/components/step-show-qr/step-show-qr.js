import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  FORWARD,
} from 'constants/wizard';
import {
  Button,
  Chip,
  Icon,
  QRCode,
} from 'base_components';
import { utils } from 'helpers';

import './step-show-qr.scss';

/*
* Show a QR code with the master seed. Besides this also show the master seed in words.
* A button for print and download PDF of this shown and until one of those is not
* pressed, a button to finish the wizard is not available.
*/
class ShowQR extends PureComponent {
  static propTypes = {
    /*
     The master seed for creating the QR code and show it
    */
    masterSeed: PropTypes.string.isRequired,
    /*
     Callback to remove decrypted master seed after finish the wizard
    */
    finishWizard: PropTypes.func.isRequired,
    /*
     Ethereum identity address to print it
    */
    identityAddress: PropTypes.string.isRequired,
  }

  state = {
    actionDone: false,
  }

  /**
  * Trigger the print callback of the browser to print QR with the master seed and
  * ethereum address of the identity
  */
  print = () => {
    utils.print('i3-ww-ssw__master-seed-and-words', 'Print seed and ethereum address');
    this.setState({ actionDone: true });
  }

  /**
  * Finish the wizard, remove from memory the master seed decrypted
  * and show dashboard.
  */
  moveForward = () => {
    this.props.finishWizard();
  }

  render() {
    const stringContent = `Master seed: ${this.props.masterSeed}
                   \n\nEthereum address of first identity:${this.props.identityAddress}`;

    return (
      <div className="i3-ww-ssw__show-qr">
        <iframe
          title="QR, seed and ethereum address to print"
          id="contentToPrint"
          style={{ height: 0, width: 0, position: 'absolute' }} />
        <div>
          <p>
            In order that we can be sure that you finish this process and you have this master seed keep, we ask you
            for print with this QR and the master seed. If you do not do any of these actions you will continue
            watching a warning in the Dashboard to keep the master seed.
          </p>
        </div>
        <div className="i3-ww-ssw__master-seed-and-words">
          <QRCode value={stringContent} />
          <div className="i3-ww-ssw__master-seed">
            <br />
            Your master seed:
            <br />
            {this.props.masterSeed
              .split(' ')
              .map((word, index) => (<Chip content={word} key={`chip-${index}`} />))
            }
            <br />
            <div className="i3-ww-ssw__identity-address">
              Ethereum address of first identity:
              {' '}
              {this.props.identityAddress}
            </div>
          </div>
        </div>
        <div className="i3-ww-ssw__buttons">
          <Button
            onClick={this.print}
            type="primary"
            htmlType="button">
            Print it
            <Icon type="printer" />
          </Button>
          { this.state.actionDone && (
            <Button
              onClick={() => this.moveForward()}
              type="primary"
              htmlType="button">
                Finished!
              <Icon type="right" />
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default ShowQR;
