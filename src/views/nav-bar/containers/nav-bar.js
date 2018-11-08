import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import memoizeOne from 'memoize-one';
import { Map as ImmutableMap } from 'immutable';
import { withIdentities } from 'hocs';
import { MenuItem } from 'base_components';
import * as ROUTES from 'constants/routes';
import { capitalizeFirstLetter } from 'helpers/utils';
import {
  ButtonsBar,
  IdentityItem,
  DesktopMenu,
} from '../components';

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
    //
    // from withRouter HoC
    //
    location: PropTypes.object.isRequired,
    //
    // from withIdentities HoC
    //
    /*
     Selector to get the current loaded identity information
     */
    defaultIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
  };

  state = {
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
          <MenuItem key={_route.KEY}>
            <Link to={_route.MAIN} replace>
              {_route.KEY}
            </Link>
          </MenuItem>,
        );
      }
    });

    return items;
  }

  render() {
    const menuItems = this._getMenuItems();
    const selectedMainMenuItem = this.memoizedPath(this.props.location.pathname);

    return (
      <div className="i3-ww-nav-bar">
        {/* Regular menu for desktop */}
        <div className="i3-ww-nav-bar__header-items">
          <IdentityItem
            title={this.props.defaultIdentity.get('name') || this.props.defaultIdentity.get('label')}
            icon={this.props.defaultIdentity.get('icon')} />
          <DesktopMenu
            items={menuItems}
            selectedItem={selectedMainMenuItem} />
          <ButtonsBar
            addCamButton
            addNotificationsButton
            mobileMenuItems={menuItems} />
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withIdentities,
)(NavBar);
