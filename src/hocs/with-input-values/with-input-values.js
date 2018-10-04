import React, { Component } from 'react';

function withInputValuesWrapper(InputComponent) {
  class InputWrapped extends Component {
    render() {
      return (<InputComponent newProps="3" />);
    }
  }
  return InputWrapped;
}

export default withInputValuesWrapper;
