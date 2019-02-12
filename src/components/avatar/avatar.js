import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { utils } from 'helpers';
import Identicon from 'identicon.js';

import './avatar.scss';

/**
 * Component to show an avatar. Uses the jdenticon library
 * to create an avatar calculating pixels regarding the value passed.
 *
 * When created for an identity, the identicon is using their Ethereum address to always have the same icon
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
