import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import {
  NavLink,
  withRouter,
} from 'react-router-dom';
import memoizeOne from 'memoize-one';
import { Map as ImmutableMap } from 'immutable';
import { withIdentities } from 'hocs';
import * as ROUTES from 'constants/routes';
import * as BOX_CONSTANTS from 'constants/box';
import { utils } from 'helpers';
import {
  Box,
  MenuItem,
} from 'base_components';
import {
  ButtonsBar,
  IdentityItem,
  DesktopMenu,
  MyData,
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
  memoizedPath = memoizeOne(key => utils.capitalizeFirstLetter(key.replace(/\//g, '')));

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
    currentIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
    /*
     Flag that indicates if master seed has been saved or not
    */
    needsToSaveMasterKey: PropTypes.bool.isRequired,
  };

  state = {
    isMyDataBoxVisible: false,
  };

  /**
   * Show or not the box with the confirmation for deleting the identities.
   */
  toggleMyDataBox = () => {
    this.setState(prevState => ({ isMyDataBoxVisible: !prevState.isMyDataBoxVisible }));
  };

  /**
   * Compose all the Menu with their links and routes
   *
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
            <NavLink activeClassName="i3-ww-menu--selected-item" to={_route.MAIN} replace>
              {_route.KEY}
            </NavLink>
          </MenuItem>,
        );
      }
    });

    // add my data label that shows a box to import export data
    this._getMyDataLink(items);
    return items;
  }

  /**
   * Add the label pointing to my data. Has no route,
   * but when on click needs to show the wizazrd of import / export data
   *
   * @param {array} items - Menu items already set
   * @private
   */
  _getMyDataLink(items) {
    items.push(
      <MenuItem key="My data">
        <div
          role="button"
          tabIndex="0"
          onKeyUp={() => this.toggleMyDataBox()}
          onClick={() => this.toggleMyDataBox()}>
          My data
        </div>
      </MenuItem>,
    );
  }

  render() {
    const menuItems = this._getMenuItems();
    const initialSelectedItem = this.memoizedPath(this.props.location.pathname);

    return (
      <div className="i3-ww-nav-bar">
        {/* Regular menu for desktop */}
        <div className="i3-ww-nav-bar__header-items">
          <IdentityItem
            title={this.props.currentIdentity.get('name') || this.props.currentIdentity.get('label')}
            icon={this.props.currentIdentity.get('address')} />
          <DesktopMenu
            initialSelectedItem={initialSelectedItem}
            items={menuItems} />
          <ButtonsBar
            addSaveSeedNotification={this.props.needsToSaveMasterKey}
            addCamButton
            addNotificationsButton
            mobileMenuItems={menuItems} />
        </div>
        <div>
          <Box
            type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
            side={BOX_CONSTANTS.SIDE.RIGHT}
            onClose={this.toggleMyDataBox}
            content={(<MyData toggleVisibility={this.toggleMyDataBox} />)}
            title={utils.capitalizeFirstLetter('My data')}
            show={this.state.isMyDataBoxVisible} />
        </div>
      </div>
    );
  }
}

export default compose(
  withIdentities,
  withRouter,
)(NavBar);
