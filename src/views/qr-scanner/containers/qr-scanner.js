import React, { PureComponent } from 'react';
import PropTytpes from 'prop-types';
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
    isCameraVisible: PropTytpes.bool,
    /*
     Function to trigger when close camera
     */
    toggleCameraVisibility: PropTytpes.func.isRequired,
  };

  static defaultProps = {
    isCameraVisible: false,
  };

  render() {
    const contentCameraBox = this.props.isCameraVisible
      ? <QRScannerCmpt />
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

export default QRScanner;
