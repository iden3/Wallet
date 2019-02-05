import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QRCodeCmpt from 'qrcode.react';

import './qr-code';

/*
* Class that return a QR code used with the component http://zpao.github.io/qrcode.react/
*/
class QRCode extends PureComponent {
  static propTypes = {
    /*
     The content from which create the QR code
    */
    value: PropTypes.string.isRequired,
    /*
     The size of the component
    */
    size: PropTypes.number,
    /*
     Level of the control of the errors
    */
    level: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
    /*
     If set a margin or not
    */
    includeMargin: PropTypes.bool,
    /*
     Color of the background
    */
    bgColor: PropTypes.string,
    /*
     Foreground color
    */
    fgColor: PropTypes.string,
    /*
     Render QR as Canvas or SVG
    */
    renderAs: PropTypes.oneOf(['canvas', 'svg']),
  }

  static defaultProps = {
    size: 256,
    level: 'Q',
    includeMargin: false,
    bgColor: 'white',
    fgColor: '#2b90d7',
    renderAs: 'svg',
  }

  render() {
    return (
      <QRCodeCmpt {...this.props} />
    );
  }
}

export default QRCode;
