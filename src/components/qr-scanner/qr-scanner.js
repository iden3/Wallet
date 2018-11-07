import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import jsQR from 'jsqr';
import { Camera } from 'base_components';

const LIVE_STREAM = 'live';
const ENDED_STREAM = 'ended';

/**
 * Class  that uses jsqr library to scan a QR and retrieve the data.
 * Uses the camera component to get the stream and find the QR.
 * ScanImage is a function triggered for each tick of the video stream
 * for parsing the image and look for a QR code.
 */
class QRScanner extends PureComponent {
  static propTypes = {
    /*
     Call back triggered when QR is read
     */
    actionAfterRead: PropTypes.func,
  };

  state = {
    canvasElement: {},
    videoElement: {},
  };

  constructor(props) {
    super(props);
    this._handleStreamTick = this._handleStreamTick.bind(this);
  }

  /**
   * Access to the video stream and stop them, removing them from the event loop.
   *
   * @param {object} stream of the video
   */
  closeCamera = () => {
    this.state.videoElement.srcObject.getVideoTracks()[0].stop();
  };

  /**
   * Parse the current tick of the stream video to check if there is
   * any QR code and retrieve the data inside.
   *
   * @param {node || number} videoElement HTML Element with the video streaming
   * @param {node} canvasElement HTML Canvas Element with a hidden canvas element from which get the info of
   * the video stream and manipulate it
   */
  scanImage = (videoElement, canvasElement) => {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      this.setState({
        canvasElement,
        videoElement,
      }, () => window.requestAnimationFrame(() => {
        this._handleStreamTick();
      }));
    }
  };

  /**
   * Handle each tick of the stream to check if there is any QR shown
   * to capture the data.
   *
   * @private
   */
  _handleStreamTick() {
    // It is needed do this check, otherwise a lot of animation frames are added to event loop
    // and even we unmount the component the are many frames to deal with in the stack
    if (this.state.videoElement.srcObject.getVideoTracks()[0].readyState === LIVE_STREAM) {
      const canvas = this.state.canvasElement.getContext('2d');

      // write current video stream tick in the canvas for parsing it and check if there is any QR code
      canvas.drawImage(this.state.videoElement, 0, 0, this.state.canvasElement.width, this.state.canvasElement.height);
      const imageData = canvas.getImageData(0, 0, this.state.canvasElement.width, this.state.canvasElement.height);
      // Should jsQR attempt to invert the image to find QR codes with white modules
      // on black backgrounds instead of the black modules on white background. Set it to dontInvert
      // for performance. Please, visit https://github.com/cozmo/jsQR for more info
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      // check if QR code found
      if (code) {
        if (this.props.actionAfterRead) this.props.actionAfterRead(code.data);
        this.closeCamera();
      }

      // move forward next frame
      window.requestAnimationFrame(this._handleStreamTick);
    }

    // check if stream finished (when camera is closed or component unmount)
    if (this.state.videoElement.srcObject.getVideoTracks()[0].readyState === ENDED_STREAM) {
      this.closeCamera();
    }
  }

  render() {
    return (
      <Camera
        onClose={this.closeCamera}
        handleRequestAnimationFrame={this.scanImage} />
    );
  }
}

export default QRScanner;
