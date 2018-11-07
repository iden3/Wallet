import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as utils from 'helpers/utils';
import Identicon from 'identicon.js';

import './avatar.scss';

/**
 * Component to show an avatar. Uses the jdenticon library
 * to create an avatar calculating pixels regarding the value passed.
 */
class Avatar extends PureComponent {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
  };

  static defaultProps = {
    width: '40',
    height: '40',
    icon: utils.generateHash(),
    title: 'Icon of the identity',
  };

  render() {
    const icon = new Identicon(this.props.icon, this.props.height).toString();

    return (
      <div className="i3-ww-avatar">
        <img
          width={this.props.width}
          height={this.props.height}
          src={`data:image/png;base64,${icon}`}
          alt={this.props.title} />
      </div>
    );
  }
}

export default Avatar;
