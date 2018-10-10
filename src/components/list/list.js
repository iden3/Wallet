import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * Generic list of any element that is sent.
 * We should send as well the rows as react elements.
 */
class List extends PureComponent {
  static propTypes = {
    /*
     The array of rows to render inside the list
     */
    rows: PropTypes.arrayOf(PropTypes.element).isRequired,
  };

  render() {
    return (
      <div className="i3-ww-list">
        {this.props.rows}
      </div>
    );
  }
}

export default List;
