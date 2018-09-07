import React, { PureComponent } from 'react';
import { Icon as IconCmpt } from 'antd';

/**
 * Wraps antd Icon.Header component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/icon/ to check props.
 */
class Icon extends PureComponent {
  render() {
    return (
      <IconCmpt {...this.props} />
    );
  }
}

export default Icon;
