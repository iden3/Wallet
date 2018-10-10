import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './row.scss';

/**
 * A row to render in list/table of the application.
 * Looks like this pattern:
 *
 * // pre action buttons // date // content1 (header) - content2 (line below content1) // post action buttons //
 *
 * i.e:
 * // Pinned icon // 28-10-2018 // This is a received claim - Claim description // Expand - Accept - Reject //
 *
 */
class Row extends PureComponent {
  static propTypes = {
    /*
      class name of the row
     */
    className: PropTypes.string,
    /*
      Initial content of the row. It should be buttons or icons
     */
    initialContent: PropTypes.node,
    /*
      Final content of the rows. It should be buttons
    */
    finalContent: PropTypes.node,
    /*
     date stamp
     */
    date: PropTypes.number,
    /*
      text to place in the main area of the row
     */
    mainContent: PropTypes.shape({
      header: PropTypes.string,
      description: PropTypes.string,
    }),
  };

  render() {
    const cmptClasses = classNames({
      'i3-ww-list__row': true,
      [`${this.props.className}`]: this.props.className,
    });

    return (
      <div
        className={cmptClasses}
        role="row">
        {this.props.initialContent && (
          <div className="i3-ww-row__initial-content">
            {this.props.initialContent}
          </div>)}
        {this.props.date && (
          <div className="i3-ww-row__date">
            {this.props.date}
          </div>)}
        <div className="i3-ww-row__main-content">
          {this.props.mainContent}
        </div>
        {this.props.finalContent && (
          <div className="i3-ww-row__final-content">
            {this.props.finalContent}
          </div>)}
      </div>
    );
  }
}

export default Row;
