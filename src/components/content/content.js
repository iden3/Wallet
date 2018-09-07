import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

const { Content: ContentCmpt } = Layout;

/**
 * Wraps antd Layout.Content component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/layout/ to check props.
 */
class Content extends PureComponent {
  static propTypes = {
    /*
    Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <ContentCmpt {...restProps}>
        {children}
      </ContentCmpt>
    );
  }
}

export default Content;
