import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

const { Item: FormItemCmpt } = Form;

/**
 * Wraps antd Form Item.Header component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/form/ to check props.
 */
class FormItem extends PureComponent {
  static propTypes = {
    /*
    Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <FormItemCmpt {...restProps}>
        {children}
      </FormItemCmpt>
    );
  }
}

export default FormItem;
