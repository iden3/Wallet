import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  QRScanner,
  TextArea,
} from 'base_components';
import { FORWARD } from 'constants/wizard';

import './read-qr-or-code.scss';

/**
 * Class that show a video from the local camera and an input text area
 * to read a QR or introduce manually a code. This code read / introduced
 * has the information about where we are going to sign in. This should
 * be confirmed in next step, not in this.
 */
class ReadQROrCode extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
    /*
     Callback thar controls the movement to next step
    */
    move: PropTypes.func.isRequired,
    /*
     Callback to send data read to next step
     */
    handleReadData: PropTypes.func.isRequired,
  };

  state = {
    inputSignInData: '',
  };

  /**
   * Handle the Input controlled components values when changed. Set the
   * state of each input with current  value.
   *
   * @param {string} value - from the input
   */
  handleInputChange = (value) => {
    this.setState({ inputSignInData: value });
  };

  /**
   * Move forward confirmation with the read data.
   *
   * @param {string} readData - From QR or introduced manually
   */
  moveForward = (readData = this.state.inputSignInData) => {
    if (readData) {
      this.props.handleReadData(readData);
      this.props.move(FORWARD);
    }
  };

  /**
   * Input to introduce the data of a claim to authorize it.
   *
   * @returns {*}
   * @private
   */
  _getInput() {
    return (
      <div className="i3-ww-read-qr-code-to-sign-in__manual-input">
        <TextArea
          value={this.state.inputSignInData}
          placeholder="Introduce code"
          onChange={e => this.handleInputChange(e.target.value)} />
        <Button
          onClick={this.moveForward}
          type="primary"
          htmlType="button">
          Authorize code
        </Button>
      </div>
    );
  }

  /**
   * QR reader component and the title.
   *
   * @returns {Object} - With the React element node containing a title and the Camera to read a QR
   * @private
   */
  _getQRScanner() {
    return (
      <div className="i3-ww-read-qr-code-to-sign-in__camera">
        <p>
          Scan a QR code from the application, or introduce the code given
          by the third party application in the text area below:
        </p>
        <QRScanner actionAfterRead={this.moveForward} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {
          this.props.isVisible
            ? (
              <div>
                {this._getQRScanner()}
                {this._getInput()}
              </div>
            )
            : <div />
        }
      </div>
    );
  }
}

export default ReadQROrCode;
