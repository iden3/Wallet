import React, { PureComponent } from 'react';
import { Avatar as AvatarCmpt } from 'antd';

/**
 * Component to show an avatar. Extends the Antd Avatar component
 * Please visit https://ant.design/components/avatar/ for more info.
 */
class Avatar extends PureComponent {
  render() {
    return (
      <AvatarCmpt {...this.props} />
    );
  }
}

export default Avatar;
