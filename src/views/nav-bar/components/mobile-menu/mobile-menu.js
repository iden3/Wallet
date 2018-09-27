import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button as ButtonCmpt,
  DropDown,
  Icon,
} from 'base_components';
import {
  BURGER_MENU,
  CLOSE,
} from 'constants/icons';

import './mobile-menu.scss';

/**
 * Class that creates the menu items to change
 * the view shown only when we are in sizes
 * of tablet and mobile resolution.
 */
class MobileMenu extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.node),
  };

  state = {
    collapsed: true,
    mobileMenuIcon: BURGER_MENU,
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

  render() {
    const mobileMenuButton = (
      <ButtonCmpt
        overrideOwnClasses
        className="i3-ww-nav-bar-mobile__menu-button"
        type="primary"
        htmlType="button">
        <Icon type={this.state.mobileMenuIcon} />
      </ButtonCmpt>
    );

    return (
      <div className="i3-ww-nav-bar-mobile">
        <DropDown
          onVisibleChange={this.toggleMenuMobileIcon}
          options={this.props.items}
          header={mobileMenuButton} />
      </div>
    );
  }
}

export default MobileMenu;
