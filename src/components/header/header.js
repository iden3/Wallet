import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

const { Header: HeaderCmpt } = Layout;

/**
 * Wraps antd Layout.Header component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/layout/ to check props.
 */
class Header extends PureComponent {
  static propTypes = {
    /*
    Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <HeaderCmpt {...restProps}>
        {children}
      </HeaderCmpt>
    );
  }
}

export default Header;
