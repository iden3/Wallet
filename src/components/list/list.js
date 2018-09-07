import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Row from './row';

/**
 * Generic list of any element that is sent.
 * We should send as well the rows as react elements.
 */
class List extends PureComponent {
  static propTypes = {
    /*
     To determine how many actual rows are rendered
     */
    height: PropTypes.number.isRequired,
    /*
     The array of rows to render inside the list
     */
    rows: PropTypes.arrayOf(PropTypes.element).isRequired,
  };

  /**
   * Get the rows of the table
   * @returns {array} with the rows (react elements)
   * @private
   */
  _getRows() {
    return this.props.rows.map((row) => {
      return (
        <Row>
          {row}
        </Row>
      );
    });
  }

  render() {
    const rows = this._getRows();

    return (
      <div
        style={{ height: this.props.height }}
        className="i3-ww-list">
        {rows}
      </div>
    );
  }
}

export default List;
