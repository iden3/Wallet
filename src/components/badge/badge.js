import React, { PureComponent } from 'react';
import { Badge as BadgeCmpt } from 'antd';

/**
 * Wraps antd Badge component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/badge/ to check props.
 */
class Badge extends PureComponent {
  render() {
    return (
      <BadgeCmpt {...this.props} />
    );
  }
}

export default Badge;
