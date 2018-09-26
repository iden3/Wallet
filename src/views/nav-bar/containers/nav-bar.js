import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import memoizeOne from 'memoize-one';
import {
  Avatar,
  Badge,
  Button,
  Icon,
  Menu,
  MenuItem,
} from 'base_components';
import { QRScanner } from 'views';
import * as ROUTES from 'constants/routes';
import {
  BURGER_MENU,
  CAMERA,
  CLOSE,
  NOTIFICATIONS,
} from 'constants/icons';
import { capitalizeFirstLetter } from 'helpers/utils';

import './nav-bar.scss';

/**
 * Navigation bar to use it in the header. It has a desktop menu and a mobile menu depending on
 * the breakpoint, calculated via css. It has on the left the menu for the different views
 * and on the right a settings/user menu. Once is collapsed (when is accessed via a tablet or phone)
 * we have all in the same menu.
 */
class NavBar extends Component {
  // change the selected menu item when location has changed (when user has introduced by hand the URL i.e.)
  memoizedPath = memoizeOne(key => capitalizeFirstLetter(key.replace(/\//g, '')));

  static propTypes = {
    // from withRouter Hoc
    location: PropTypes.object.isRequired,
  };

  state = {
    collapsed: true,
    mobileMenuIcon: BURGER_MENU,
    isCameraVisible: false,
  };

  /**
   * Update the state to show or not the box with the camera.
   * This callback is called from the camera button.
   */
  toggleCameraVisibility = () => {
    this.setState(
      prevState => ({ isCameraVisible: !prevState.isCameraVisible }),
    );
  };

  /**
   * Toggle the icon of the 'burger' icon shown in tablet and mobile size to indicate to open it o close it
   */
  toggleMenuMobileIcon = () => {
    this.setState(prevState => (
      {
        mobileMenuIcon: prevState.mobileMenuIcon === BURGER_MENU ? CLOSE : BURGER_MENU,
        collapsed: !prevState.collapsed,
      }));
  };

  /**
   * Compose all the Menu with their links and routes
   * @returns {element[]} An array of React nodes (MenuItem)
   * @private
   */
  _getMenuItems() {
    const items = [];

    Object.keys(ROUTES).forEach((route) => {
      const _route = ROUTES[route];

      // in every Link created, we set the replace prop to true
      // because when clicking the link will replace the
      // current entry in the history stack instead of adding a new one.
      // If not a Warning is triggered when we click more than one time
      // in the current link because we are adding the same entry once and again.
      // Please, FMI, visit: https://reacttraining.com/react-router/web/api/Link/replace-bool
      if (_route.ORDER !== -1) {
        items.push(
          <MenuItem
            key={_route.KEY}
            onClick={this.toggleMenuMobileIcon}>
            <Link to={_route.MAIN} replace />
            {_route.KEY}
          </MenuItem>,
        );
      }
    });

    return items;
  }

  /**
   * Set the submenu for the setting/user menu. Valid for desktop and mobile size.
   * We will have an icon, the name of the current identity and an
   * avatar with the icon of the user.
   * TODO: Right now avatar is generic and hardcoded
   * @returns {element} React node with the settings SubMenu
   */
  _getSettingSubmenu() {
    const title = (
      <span>
        <Avatar
          shape="square"
          size={64}
          style={{ color: '#f56a00', backgroundColor: 'white' }} />
        Identity A
      </span>
    );

    return (
      <MenuItem
        onClick={this.toggleMenuMobileIcon}>
        <Link to={ROUTES.IDENTITIES.MAIN} replace>
          {title}
        </Link>
      </MenuItem>
    );
  }

  render() {
    const menuItems = this._getMenuItems();
    const settingsMenu = this._getSettingSubmenu();
    const selectedMenuItem = this.memoizedPath(this.props.location.pathname);

    return (
      <div className="i3-ww-nav-bar">
        {/* Regular menu for desktop */}
        <div className="i3-ww-nav-bar__header-items">
          <div className="i3-ww-nav-bar-identity">
            <Menu mode="horizontal">
              { settingsMenu }
            </Menu>
          </div>
          <div className="i3-ww-nav-bar-desktop">
            <Menu
              mode="horizontal"
              selectedKeys={[selectedMenuItem]}>
              { menuItems }
            </Menu>
          </div>
          <div className="i3-ww-nav-bar__buttons">
            <Menu mode="horizontal" onClick={this.toggleCameraVisibility}>
              <MenuItem>
                <Icon type={CAMERA} theme="filled" />
              </MenuItem>
            </Menu>
            <Menu mode="horizontal">
              <MenuItem>
                <Badge count={5}>
                  <Icon type={NOTIFICATIONS} />
                </Badge>
              </MenuItem>
            </Menu>
            {/* Collapsed menu in small devices */}
            <div className="i3-ww-nav-bar-mobile">
              <Button
                className="i3-ww-nav-bar-mobile__menu-button"
                type="primary"
                htmlType="button"
                onClick={this.toggleMenuMobileIcon}
                onKeyUp={this.toggleMenuMobileIcon}>
                <Icon type={this.state.mobileMenuIcon} />
              </Button>
              <Menu
                defaultSelectedKeys={[selectedMenuItem]}
                mode="inline"
                inlineCollapsed={this.state.collapsed}>
                { !this.state.collapsed && menuItems }
                { !this.state.collapsed && settingsMenu }
              </Menu>
            </div>
          </div>
        </div>
        {/* Box to show camera for reading QR */}
        <QRScanner
          isCameraVisible={this.state.isCameraVisible}
          toggleCameraVisibility={this.toggleCameraVisibility} />
      </div>
    );
  }
}

export default compose(
  withRouter,
)(NavBar);
