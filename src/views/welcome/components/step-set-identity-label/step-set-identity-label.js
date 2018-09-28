import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Input,
} from 'base_components';

/**
 * View that asks to the user to introduce a label for the
 * identity that is going to be created. This views belongs
 * to the wizard of create an identity. This label is only
 * to do set a human readable name to the identity, which
 * is really pointed with the address returned by the Relay.
 * It shows two buttons: one to move backwards and other
 * to move forward.
 */
class StepIdentityLabel extends PureComponent {
  static propTypes = {
    /*
      Call back triggered when one of the action buttons are pressed
     */
    onChange: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="i3-ww-welcome-set-identity-label">
        Set a label for your identity:
        <Input placeholder="Enter a label" />
        <Button
          onClick={() => this.props.onChange(false)}
          type="primary"
          htmlType="button">
          Back to welcome
        </Button>
        <Button
          onClick={() => this.props.onChange(true)}
          type="primary"
          htmlType="button">
          Set a passphrase
        </Button>
      </div>
    );
  }
}

export default StepIdentityLabel;
