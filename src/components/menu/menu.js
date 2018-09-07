import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu as MenuCmpt } from 'antd';

/**
 * Overrides antd Menu component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/menu/ to check props.
 */
class Menu extends PureComponent {
  static propTypes = {
    /*
     Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <MenuCmpt {...restProps}>
        {children}
      </MenuCmpt>
    );
  }
}

export default Menu;
