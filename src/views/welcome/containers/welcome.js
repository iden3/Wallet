import React, { Component } from 'react';
import {
  StepSetPassphrase,
  StepCreateIdentity,
  StepChooseAvatar,
  StepSetIdentityLabel,
  StepShowMnemonicSeed,
  StepWelcome,
} from '../components';

import './welcome.scss';

const sortedSteps = [
  StepWelcome,
  StepSetIdentityLabel,
  StepSetPassphrase,
  StepShowMnemonicSeed,
  StepChooseAvatar,
  StepCreateIdentity,
];

class Welcome extends Component {
  state = {
    currentStep: 0,
  };

  /**
   * Set component state to show the right view of the welcome wizard
   * @param {boolean} isForward true if is moving forward, false if moving backwards
   */
  changeStep = (isForward) => {
    this.setState(prevState => ({
      currentStep: isForward
        ? prevState.currentStep + 1
        : prevState.currentStep - 1,
    }));
  };

  render() {
    const Step = sortedSteps[this.state.currentStep];

    return (
      <div className="i3-ww-welcome">
        <Step onChange={this.changeStep} />
      </div>
    );
  }
}

export default Welcome;
