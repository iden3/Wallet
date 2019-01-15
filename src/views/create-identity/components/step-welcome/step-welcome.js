import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
} from 'base_components';

import './step-welcome.scss';

/**
 * View that shows the very first screen to indicate the user
 * that is going to create a new identity. Shown when no identity
 * has been found. It shows an explaining text and a button to
 * move forward.
 */
class StepWelcome extends PureComponent {
  static propTypes = {
    /*
      Call back triggered when one of the action buttons are pressed
     */
    move: PropTypes.func,
    /*
     Flag to know if it's first identity, to show one text or other
    */
    isFirstIdentity: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <div className="i3-ww-ci__step  i3-ww-ci__welcome">
        <div className="i3-ww-ci__title">
          { this.props.isFirstIdentity
            ? (
              <div>
                <p className="i3-ww-title">Welcome to iden3</p>
                <p className="i3-ww-subtitle">Create your decentralized identity</p>
              </div>
            )
            : (
              <div>
                <p className="i3-ww-title">New iden3 identity</p>
                <p className="i3-ww-subtitle">Create another decentralized identity</p>
              </div>
            )
          }
        </div>
        <div className="i3-ww-ci__content">
          <p>
            The next steps will guide you through your active identity creation process.
            {this.props.isFirstIdentity && 'You will also be able to create more identities later.' }
            {' '}
            Keep in mind that your private key will be encrypted and stored in this device.
          </p>
        </div>
        <div className="i3-ww-ci__buttons">
          <Button
            onClick={() => this.props.move()}
            type="primary"
            htmlType="button">
            Let
            {'\''}
            s go!
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  }
}

export default StepWelcome;
