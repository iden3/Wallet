import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const { TextArea: TextAreaCmpt } = Input;

/**
 * Wraps antd Input.TextArea component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/input/ to check props.
 */
class TextArea extends PureComponent {
  static propTypes = {
    /*
     For some browsers if they can capitalize the text
     */
    autoCapitalize: PropTypes.string,
    /*
     If should be automatically completed by the browser
     */
    autoComplete: PropTypes.string,
    /*
      Autosize height to set minRows and maxRows
     */
    autoSize: PropTypes.bool || PropTypes.object,
    /*
     Input content value
     */
    value: PropTypes.string.isRequired,
    /*
     Placeholder to indicates the user
     */
    placeholder: PropTypes.string.isRequired,
  };

  static defaultProps = {
    autoSize: {
      minRows: 2,
      maxRows: 6,
    },
    autoComplete: 'off',
    autoCapitalize: 'none',
  };

  render() {
    return (
      <TextAreaCmpt {...this.props} />
    );
  }
}

export default TextArea;
