import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Spinner to show at buttons, widgets, etc...
 */
class Spinner extends PureComponent {
  static propTypes = {
    /**
      Custom class name
     */
    className: PropTypes.string,
    /**
      Spinner color
     */
    color: PropTypes.string,
  };

  static defaultProps = {
    color: '#fff',
  };

  render() {
    const cmptClasses = classNames({
      'i3-ww-spinner': true,
      [`${this.props.className}`]: this.props.className,
    });

    return (
      <span
        className={cmptClasses}
        style={{ borderColor: this.props.color }} />);
  }
}

export default Spinner;
