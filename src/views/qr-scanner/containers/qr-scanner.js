import React, { PureComponent } from 'react';
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
  QRScanner as QRScannerCmpt,
} from 'base_components';
import * as BOX_CONSTANTS from 'constants/box';

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
    /*
     Selector to get the information related to an identity.
     Expect the identity address as parameter
     */
    getIdentity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isCameraVisible: false,
  };

  authorizeKSignClaim = (data) => {
    this.props.handleAuthorizeClaim(this.props.defaultIdentity, data);
  };


  render() {
    const contentCameraBox = this.props.isCameraVisible
      ? (
        <QRScannerCmpt
          actionAfterRead={this.authorizeKSignClaim} />
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
