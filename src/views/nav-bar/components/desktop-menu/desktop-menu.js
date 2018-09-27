import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'base_components';

import './desktop-menu.scss';

/**
 * Class that creates the menu items to change
 * the view shown only when we are in sizes
 * of desktop resolution.
 */
class DesktopMenu extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.node).isRequired,
    selectedItem: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className="i3-ww-nav-bar-desktop">
        <Menu
          mode="horizontal"
          selectedKeys={[this.props.selectedItem]}>
          { this.props.items }
        </Menu>
      </div>
    );
  }
}

export default DesktopMenu;
