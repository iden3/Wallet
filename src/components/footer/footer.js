import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

const { Footer: FooterCmpt } = Layout;

/**
 * Wraps antd Layout.Footer component to isolate the views from
 * any UI framework that we decide to use
 * Please, visit to https://ant.design/components/layout/ to check props
 */
class Footer extends PureComponent {
  static propTypes = {
    /*
    Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <FooterCmpt {...restProps}>
        {children}
      </FooterCmpt>
    );
  }
}

export default Footer;
