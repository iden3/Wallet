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
      <div className="i3-ww-steps-new-identity i3-ww-step-welcome">
        <div className="i3-ww-step__title">
          <p>Welcome to IDEN3</p>
          <p>Decentralizing identity systems</p>
        </div>
        <div className="i3-ww-step__content">
          <p>
          You are about to create an identity, since no one has been found.
          Keep in mind that your private key is encrypted and stored in this device.
          Also, You can create as much identities as you want
          </p>
        </div>
        <div className="i3-ww-step__buttons">
          <Button
            onClick={() => this.props.onChange(true)}
            type="primary"
            htmlType="button">
            Create your identity
          </Button>
        </div>
      </div>
    );
  }
}

export default StepWelcome;
