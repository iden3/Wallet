import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

const { Item: MenuItemCmpt } = Menu;

/**
 * Overrides antd Menu.Item component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/menu/ to check props.
 */
class MenuItem extends PureComponent {
  static propTypes = {
    /*
     Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <MenuItemCmpt {...restProps}>
        {children}
      </MenuItemCmpt>
    );
  }
}

export default MenuItem;
