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
    type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'danger', 'default', 'secondary']),
    /*
      Set the HTML type. If not set, is 'button'
     */
    htmlType: PropTypes.oneOf(['submit', 'reset', 'button']).isRequired,
    /*
      Children
     */
    children: PropTypes.node,
    /*
     Indicates if own button classes want to be used (if true if because only functionality is needed)
     */
    overrideOwnClasses: PropTypes.bool,
    /*
      Class name with own styles to add
     */
    className: PropTypes.string,
  };

  static defaultProps = {
    overrideOwnClasses: false,
  };

  render() {
    const { children, overrideOwnClasses, ...restProps } = this.props;
    const cmptClasses = classNames({
      'i3-ww-button': true,
      'i3-ww-button__primary': !overrideOwnClasses && this.props.type === 'primary',
      'i3-ww-button__secondary': !overrideOwnClasses && this.props.type === 'secondary',
      'i3-ww-button__danger': !overrideOwnClasses && this.props.type === 'danger',
      [`${this.props.className}`]: this.props.className,
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
