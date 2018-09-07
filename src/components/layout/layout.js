import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout as LayoutCmpt } from 'antd';

import 'antd/dist/antd.css';

/**
 * Wraps antd Layout.Content component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/layout/ to check props.
 */
class Layout extends PureComponent {
  static propTypes = {
    /*
    Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restArgs } = this.props;

    return (
      <LayoutCmpt {...restArgs}>
        {children}
      </LayoutCmpt>
    );
  }
}

export default Layout;
