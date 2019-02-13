import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Radio as RadioCmpt } from 'antd';
import classNames from 'classnames';

import './radio-button.scss';

/**
 * Wraps antd Radio button component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/radio/ to check props.
 */
class RadioButton extends PureComponent {
  static propTypes = {
    /*
     If radio button is checked or not to style properly
     */
    checked: PropTypes.bool,
  };

  static defaultProps = {
    checked: false,
  };

  render() {
    const cmptClasses = classNames({
      'i3-ww-radio-button': true,
      'i3-radio-button--checked': this.props.checked,
      'i3-radio-button--not-checked': !this.props.checked,
    });

    return (
      <div className={cmptClasses}>
        <RadioCmpt {...this.props} />
      </div>
    );
  }
}

export default RadioButton;
