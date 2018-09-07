import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button as ButtonCmpt } from 'antd';
import classNames from 'classnames';

import './buttons.scss';

/**
 * Wraps antd Button.Content component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/button/ to check props.
 */
class Button extends PureComponent {
  static propTypes = {
    /*
      One of the antd framework types. If not set, is 'default'
     */
    type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'danger', 'default']),
    /*
      Set the HTML type. If not set, is 'button'
     */
    htmlType: PropTypes.oneOf(['submit', 'reset', 'button']).isRequired,
    /*
      Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;
    const cmptClasses = classNames({
      'i3-ww-button': true,
      'i3-ww-button__primary': this.props.type === 'primary',
      'i3-ww-button__secondary': this.props.type === 'secondary',
      'i3-ww-button__danger': this.props.type === 'danger',
    });

    return (
      <div className={cmptClasses}>
        <ButtonCmpt {...restProps}>
          {children}
        </ButtonCmpt>
      </div>

    );
  }
}

export default Button;
