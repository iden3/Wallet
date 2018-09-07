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
  };

  static defaultProps = {
    title: 'No title',
    isMinimized: false,
  };

  render() {
    const buttonIcon = this.props.isMinimized ? 'arrows-alt' : 'shrink';

    return (
      <div className="i3-ww-widget__header">
        <span className="i3-ww-widget__header-title">
          {this.props.title}
        </span>
        <div className="i3-ww-widget__header-buttons-area">
          <Button
            onClick={this.props.onClick}
            type="default"
            htmlType="button"
            icon={buttonIcon} />
        </div>
      </div>
    );
  }
}

export default Header;
