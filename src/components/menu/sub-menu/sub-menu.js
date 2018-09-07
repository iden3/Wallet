import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

const { SubMenu: SubMenuCmpt } = Menu;

/**
 * Overrides antd Menu.SubMenu component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/menu/ to check props.
 */
class SubMenu extends PureComponent {
  static propTypes = {
    /*
     Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <SubMenuCmpt {...restProps}>
        {children}
      </SubMenuCmpt>
    );
  }
}

export default SubMenu;
