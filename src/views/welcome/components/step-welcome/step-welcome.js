import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from 'base_components';

/**
 * View that shows the very first screen to indicate the user
 * that is going to create a new identity. Shown when no identity
 * has been found. It shows an explaining text and a button to
 * move forward.
 */
class StepWelcome extends PureComponent {
  static propTypes = {
    /*
      Call back triggered when one of the action buttons are pressed,
      send true if moving forward, false if moving backwards
     */
    onChange: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="i3-ww-step-welcome">
        Welcome to IDEN3: Building decentralized identity systems
        <Button
          onClick={() => this.props.onChange(true)}
          type="primary"
          htmlType="button">
          Create your identity
        </Button>
      </div>
    );
  }
}

export default StepWelcome;
