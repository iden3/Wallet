import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input as InputCmpt } from 'antd';

import './input.scss';
import { Icon } from 'base_components/index';

/**
 * Overrides antd Input component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/input/ to check props.
 *
 */
class Input extends PureComponent {
  static propTypes = {
    /*
     Children
     */
    children: PropTypes.node,
    /*
     If we want an input in which content is masked. Then we place
     an Icon to show the content
     */
    isPasswordType: PropTypes.bool,
    /*
     Value from the parent, which should come from a selector of the app state
     */
    value: PropTypes.string,
  };

  static defaultProps = {
    isPasswordType: false,
    value: '',
  };

  state = {
    contentIsMasked: this.props.isPasswordType,
  };

  /**
   * Triggered when user clicks in the "eye" button to toggle the view of
   * way they are typing. So state is set to the opposite value that was set
   * to set the type of each input as password or test
   */
  changeInputMask = () => {
    this.setState(prevState => ({ contentIsMasked: !prevState.contentIsMasked }));
  };

  /**
   * Set the icon with an eye to indicate an user that can click to
   * toggle the view of what they are writing. Set the proper handlers
   * regarding the input. With the key, triggers the callback the keys
   * Enter or Space
   * @returns {element} React element with Icon eye and proper handlers
   */
  setViewIcon = () => {
    return (
      <div
        role="button"
        tabIndex={0}
        onKeyUp={(e) => {
          (e.key === 'Enter' || e.key === ' ') && this.changeInputMask();
        }}
        onClick={() => this.changeInputMask()}>
        <Icon type="eye" />
      </div>);
  };

  render() {
    const {
      children, isPasswordType, value, ...restProps
    } = this.props;

    return (
      <div className="i3-ww-input">
        <InputCmpt
          autoComplete="off"
          type={this.state.contentIsMasked ? 'password' : 'text'}
          addonAfter={isPasswordType ? this.setViewIcon() : null}
          value={value}
          {...restProps}>
          { children }
        </InputCmpt>
      </div>
    );
  }
}

export default Input;
