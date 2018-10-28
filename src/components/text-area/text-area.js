import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const { TextArea } = Input;

/**
 * Wraps antd Input.TextArea component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/input/ to check props.
 */
class Tree extends PureComponent {
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
    autosize: PropTypes.bool || PropTypes.object,
    /*
     Input content value
     */
    value: PropTypes.string.isRequired,
    /*
     Placeholder to indicates the user
     */
    placeHolder: PropTypes.string.isRequired,
  };

  static defaultProps = {
    autosize: {
      minRows: 2,
      maxRows: 6,
    },
    autoComplete: 'off',
    autoCapitalize: 'none',
  };

  render() {
    return (
      <TextArea {...this.props} />
    );
  }
}

export default Tree;
