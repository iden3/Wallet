import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './spinner.scss';

/**
 * Spinner to show at buttons, widgets, etc...
 */
class Spinner extends PureComponent {
  static propTypes = {
    /**
      Custom class name
     */
    className: PropTypes.string,
  };

  render() {
    const cmptClasses = classNames({
      'i3-ww-spinner': true,
      [`${this.props.className}`]: this.props.className,
    });

    return (
      <div className={cmptClasses}>
        <div />
        <div />
      </div>
    );
  }
}

export default Spinner;
