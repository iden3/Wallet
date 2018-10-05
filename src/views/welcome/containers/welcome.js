import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withFormsValues } from 'hocs';
import { notification } from 'base_components';
import {
  StepSetPassphrase,
  StepCreateIdentity,
  StepWelcome,
} from '../components';

import './welcome.scss';

const sortedSteps = [
  StepWelcome,
  StepSetPassphrase,
  StepCreateIdentity,
];

/**
 * View to show the steps to welcome a new user and ask for a passphrase
 * when identity it's not shown.
 * Handles each change of the step views to show and the notifications to show.
 */
class Welcome extends Component {
  static propTypes = {
    // From withSetIdentityValues HOC
    /*
      If fetching data about the value of the forms
     */
    isFetchingForms: PropTypes.bool.isRequired,
    /*
     If there is an error fetching value
     */
    fetchingFormsError: PropTypes.string.isRequired,
    /*
      Action to set a new passphrase in the app state
     */
    handleUpdatePassphrase: PropTypes.func.isRequired,
    /*
     Selector to retrieve the value of a form
     */
    getForm: PropTypes.func.isRequired,
  };

  state = {
    currentStep: 0,
  };

  componentDidMount() {
    this.props.getForm('passphrase');
  }

  /**
   * Set component state to show the right view of the welcome wizard
   * @param {string} direction should be 'forward' or 'backwards'
   */
  changeStep = (direction = 'forward') => {
    if (direction === 'forward' || direction === 'backwards') {
      this.setState(prevState => ({
        currentStep: direction === 'forward'
          ? prevState.currentStep + 1
          : prevState.currentStep - 1,
      }));
    }
  };

  /**
   * Open a notification box with a message sent in config
   * @param {string} type - Should be one of 'success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'
   * @param {object} config - Should contain at least fields 'message' (string) that is the title and 'description' that
   * contains the content message to show
   */
  showNotification = (type, config) => {
    const notificationTypes = ['success', 'error', 'info', 'warning', 'warn', 'open', 'close', 'destroy'];

    if (notificationTypes.indexOf(type) !== -1) {
      const _config = Object.assign({}, config);
      _config.placement = 'bottomRight';
      _config.bottom = 20;

      notification[type](_config);
    }
  };

  render() {
    const Step = sortedSteps[this.state.currentStep];

    return (
      <div className="i3-ww-welcome">
        <Step
          getFormValue={this.props.getForm}
          updatePassphraseValue={this.props.handleUpdatePassphrase}
          showNotification={this.showNotification}
          move={this.changeStep} />
      </div>
    );
  }
}

export default compose(withFormsValues)(Welcome);
