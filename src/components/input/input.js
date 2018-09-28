import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input as InputCmpt } from 'antd';

class Input extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <InputCmpt {...restProps}>
        { children }
      </InputCmpt>
    );
  }
}

export default Input;
