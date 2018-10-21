import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import jdenticon from 'jdenticon';

import './avatar.scss';

/**
 * Component to show an avatar. Uses the jdenticon library
 * to create an avatar calculating pixels regarding the value passed.
 */
class Avatar extends PureComponent {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    width: '45',
    height: '45',
    value: 'Random avatar',
  }

  render() {
    return (
      <div className="i3-ww-avatar">
        <svg
          width={this.props.width}
          height={this.props.height}
          data-jdenticon-value={this.props.value} />
      </div>
    );
  }
}

export default Avatar;
