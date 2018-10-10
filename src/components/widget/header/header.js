import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'base_components/index';

import './header.scss';

/**
 * Header of a widget in which we place a title and a button to minimize/maximize it
 */
class Header extends PureComponent {
  static propTypes = {
    /*
     To determine the icon to show in the button
     */
    isMinimized: PropTypes.bool,
    /*
      Call back from any parent to trigger when box is closed
     */
    onClick: PropTypes.func,
    /*
     Title to show in the header
     */
    title: PropTypes.string,
    /*
     React component to show in the right of the header instead the default (minimize, maximize)
    */
    actionButtons: PropTypes.node,
  };

  static defaultProps = {
    title: 'No title',
    isMinimized: false,
  };

  render() {
    const buttonIcon = this.props.isMinimized ? 'arrows-alt' : 'shrink';
    const minimizeMaximizeButton = (
      <Button
        onClick={this.props.onClick}
        type="default"
        htmlType="button"
        icon={buttonIcon} />
    );

    return (
      <div className="i3-ww-widget__header">
        <span className="i3-ww-widget__header-title">
          {this.props.title}
        </span>
        <div className="i3-ww-widget__header-buttons-area">
          {this.props.actionButtons && <div>{this.props.actionButtons}</div>}
          <div className="i3-ww-widget__header-buttons-area--separator">
            {' '}
          </div>
          <div>
            {minimizeMaximizeButton}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
