import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'base_components';

import './camera.scss';

/**
 * Class to show the cam in the browser using its webcam.
 * By default will show a button to do a screenshot and
 * we will add this functionality with a method in this class.
 */
class Camera extends PureComponent {
  static propTypes = {
    /*
     Message to who in the button if shown
     */
    messageButton: PropTypes.string,
    /*
     Function to trigger if button is shown
     */
    onClickButton: PropTypes.func,
    /*
     Function to trigger when camera is unmounted
     */
    onClose: PropTypes.func,
    /*
     Function to handle each video stream repaint, i.e. for qr-scanner
     */
    handleRequestAnimationFrame: PropTypes.func,
    /*
     Show button in the camera
     */
    showButton: PropTypes.bool,
  };

  static defaultProps = {
    messageButton: 'Take a screenshot',
    showButton: false,
  };

  /**
   * Once component is mounted need to get media device (video) if it's supported
   * by the browser. An alternative should use window.URL.createObjectURL(stream),
   * but it's going to be deprecated.
   * So we are using the MediaStream object returned (https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
   * in the promise to set the src of the HTML media object (https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject)
   */
  componentDidMount() {
    // For more information, please visit: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // to attempt to get the front camera on phones
        },
      })
        .then((stream) => {
          this.handleVideoStream(stream);
        })
        .catch((error) => {
          this.videoError(error);
        });
    }
  }

  /**
   * Check if there is any callback to trigger when camera is closed. If yes, trigger it
   */
  componentWillUnmount() {
    if (this.props.onClose) {
      this.props.onClose(this.videoElement);
    }
  }

  /**
   * Set the source of the video element.
   * We need to set the srcObject depending the browser.
   * Please, for more information, visit: https://github.com/addyosmani/getUserMedia.js/issues/64
   * @param {*} stream with the info fo the video stream
   */
  handleVideoStream = (stream) => {
    this._setStream(stream);
    this.videoElement.play()
      .then(() => {
        // handle each animation in the video stream before repaint
        // used i.e. when we are scanning a QR code
        if (this.props.handleRequestAnimationFrame) {
          this.props.handleRequestAnimationFrame(this.videoElement, this.canvasElement);
        }
      });
  };

  /**
   * Take a snapshot if camera is configured with this feature.
   * It's shown in the canvas element of the camera.
   * @returns {string} with the snapshot taken
   */
  takeSnapShot = () => {
    const context = this.canvasElement.getContext('2d');

    context.drawImage(this.videoElement, 0, 0, 800, 600);
    return this.canvasElement.toDataURL('image/jpeg', 0.5);
  };

  /**
   * Handle the error if we can't access to the cam.
   * If there is another tab, application or browser using it,
   * you'll receive an "AbortError" type of error
   * @param error
   */
  videoError = (error) => {
    console.error('Error accessing to the cam:', error);
  };

  /**
   * Set the stream of the video regarding the browser,
   * since is managed different
   * @param {*} stream stream of the video
   * @private
   */
  _setStream(stream) {
    // set the stream, regarding the browser we srcObject is different
    if (this.videoElement.mozSrcObject !== undefined) { // FF18a
      this.videoElement.mozSrcObject = stream;
    } else if (this.videoElement.srcObject !== undefined) { // Chrome
      this.videoElement.srcObject = stream;
    } else if (window.webkitURL !== undefined) { // older Chrome browsers
      this.videoElement.srcObject = window.webkitURL.createObjectURL(stream);
    } else { // FF16a, 17a
      this.videoElement.src = stream;
    }
  }

  render() {
    return (
      <div className="i3-ww-camera">
        <div className="i3-ww-camera__container">
          <video
            playsInline
            muted
            ref={(input) => { this.videoElement = input; }} />
          {this.props.showButton
            && (
            <Button
              type="primary"
              htmlType="button"
              onClick={this.props.onClickButton ? this.props.onClickButton : this.takeSnapShot}>
                {this.props.messageButton}
            </Button>
            )
          }
        </div>
        <canvas
          ref={(canvas) => { this.canvasElement = canvas; }}
          style={{ display: 'none' }} />
      </div>
    );
  }
}

export default Camera;
