import React, { PureComponent } from 'react';
import { Badge as BadgeCmpt } from 'antd';

/**
 * Component to show a badge. Extends the Antd Badge component
 */
class Badge extends PureComponent {
  render() {
    return (
      <BadgeCmpt {...this.props} />
    );
  }
}

export default Badge;
