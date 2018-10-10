import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
} from 'base_components';

class StepConfirmCreateIdentity extends PureComponent {
  static propTypes = {
    move: PropTypes.func.isRequired,
    updatePassphraseValue: PropTypes.func.isRequired,
  };

  /**
   * Update the app state with the current passphrase introduced
   * and trigger callback to move former view of the wizard
   */
  moveBackwards = () => {
    this.props.move('backwards');
  };

  /**
   * Before moving forward to next screen check if both inputs
   * have the same value. If not, a notification is shown.
   */
  moveForward = () => {
    this.props.updatePassphraseValue('');
    this.props.move('forward');
  };

  render() {
    return (
      <div className="i3-ww-ci__confirm-create-identity">
        <div className="i3-ww-ci__title">
          <p className="i3-ww-title">Confirm you identity</p>
        </div>
        <div className="i3-ww-ci__content">
          Do you want to create this account?
        </div>
        <div className="i3-ww-ci__buttons">
          <Button
            onClick={this.moveBackwards}
            type="primary"
            htmlType="button">
            <Icon type="left" />
            Back
          </Button>
          <Button
            onClick={this.moveForward}
            type="primary"
            htmlType="button">
            Next
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  }
}

export default StepConfirmCreateIdentity;
