import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Row extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  render() {
    const cmptClasses = classNames({
      'i3-ww-list__row': true,
      [this.props.className]: true,
    });

    return (
      <div className={cmptClasses}>
        {this.props.children}
      </div>
    );
  }
}

export default Row;
