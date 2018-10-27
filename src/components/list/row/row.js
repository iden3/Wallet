import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'base_components';

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
     Key of the component
     */
    key: PropTypes.string.isRequired,
    /*
      If we receive something in this prop, we should place an icon
      with an arrow and do the content of this prop visible or not
      and the row should be collapsible
     */
    collapsible: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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

  state = {
    collapsed: true,
  };

  toggleCollapse = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  };

  render() {
    const rowClasses = classNames({
      'i3-ww-list__row-header': true,
      [`${this.props.className}`]: this.props.className,
    });

    return (
      <div
        key={this.props.key}
        className="i3-ww-list__row">
        <div
          className={rowClasses}
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
          {this.props.collapsible
          && (
            <div
              className="i3-ww-row__collapsible-button"
              tabIndex="0"
              role="gridcell"
              onKeyUp={this.toggleCollapse}
              onClick={this.toggleCollapse}>
              <Icon type={this.state.collapsed ? 'down' : 'up'} />
            </div>
          )
          }
        </div>
        {this.props.collapsible
        && (
        <div className={classNames({
          'i3-ww-row__collapsible-content': true,
          'i3-ww-row__collapsible-content--visible': !this.state.collapsed,
        })}>
          {this.props.collapsible}
        </div>
        )}
      </div>
    );
  }
}

export default Row;
