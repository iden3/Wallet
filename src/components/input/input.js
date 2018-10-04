import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input as InputCmpt } from 'antd';

import './input.scss';

class Input extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <div className="i3-ww-input">
        <InputCmpt {...restProps}>
          { children }
        </InputCmpt>
      </div>
    );
  }
}

export default Input;
