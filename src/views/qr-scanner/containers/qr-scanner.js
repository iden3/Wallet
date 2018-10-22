import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Map as ImmutableMap } from 'immutable';
import {
  withIdentities,
  withClaims,
  withFormsValues,
} from 'hocs';
import {
  Box,
  Button,
  Input,
  QRScanner as QRScannerCmpt,
} from 'base_components';
import * as BOX_CONSTANTS from 'constants/box';

import './claim-reader.scss';

/**
 * Scanner of a QR view, we will call the Box component to show the cam
 */
class QRScanner extends PureComponent {
  static propTypes = {
    /*
     Flag to mount the qr scanner component
     */
    isCameraVisible: PropTypes.bool,
    /*
     Function to trigger when close camera
     */
    toggleCameraVisibility: PropTypes.func.isRequired,
    //
    // from withClaims HoC
    //
    /*
     Action authorize a claim received
     */
    handleAuthorizeClaim: PropTypes.func.isRequired,
    //
    // from withIdentities HoC
    //
    /*
     Selector to get the current loaded identity information
     */
    defaultIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
  };

  static defaultProps = {
    isCameraVisible: false,
  };

  state = {
    inputClaimData: '',
  };

  /**
   * Call back triggered once a QR is read or link is introduced, we need
   * to send back the information of the current identity and the data read.
   *
   * @param {string} data - read from a QR or introduced by user in the input
   */
  authorizeKSignClaim = (data) => {
    this.props.handleAuthorizeClaim(this.props.defaultIdentity, data);
  };

  /**
   * Handle the Input controlled components values when changed. Set the
   * state of each input with current  value.
   *
   * @param {string} value - from the input
   */
  handleInputChange = (value) => {
    this.setState({ inputClaimData: value });
  };

  _getInput() {
    return (
      <div className="i3-ww-claim-reader__manual-input">
        <Input
          value={this.state.inputClaimData}
          placeholder="Introduce a code"
          onChange={e => this.handleInputChange(e.target.value)} />
        <Button
          onClick={() => this.authorizeKSignClaim(this.state.inputClaimData)}
          type="primary"
          htmlType="button">
          Read introduced code
        </Button>
      </div>
    );
  }

  _getQRScanner() {
    return (
      <div className="i3-ww-claim-reader__camera">
        <QRScannerCmpt actionAfterRead={this.authorizeKSignClaim} />
      </div>);
  }

  render() {
    const contentCameraBox = this.props.isCameraVisible
      ? (
        <div className="i3-ww-claim-reader">
          {this._getQRScanner()}
          {this._getInput()}
        </div>
      )
      : <div />;

    return (
      <Box
        type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
        side={BOX_CONSTANTS.SIDE.RIGHT}
        onClose={this.props.toggleCameraVisibility}
        content={contentCameraBox}
        title="Scan QR Code"
        show={this.props.isCameraVisible} />
    );
  }
}

export default compose(
  withClaims,
  withIdentities,
  withFormsValues,
)(QRScanner);
