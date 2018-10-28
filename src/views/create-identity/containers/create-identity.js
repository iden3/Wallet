import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import * as FORMS from 'constants/forms';
import LocalStorage from 'helpers/local-storage';
import {
  withFormsValues,
  withIdentities,
} from 'hocs';
import notificationsHelper from 'helpers/notifications';
import {
  StepSetPassphrase,
  StepSetName,
  StepWelcome,
} from '../components';

import './create-identity.scss';

const sortedSteps = [
  StepWelcome,
  StepSetPassphrase,
  StepSetName,
];

/**
 * View to show the steps to welcome a new user and ask for a passphrase
 * when identity it's not shown.
 * Handles each change of the step views to show and the notifications to show.
 */
class CreateIdentity extends Component {
  static propTypes = {
    //
    // from withFormsValues HOC
    //
    /*
      Action to set a new passphrase in the app state
     */
    handleUpdateForm: PropTypes.func.isRequired,
    /*
     Action to clear the forms and store passphrase
     */
    handleClearCreateIdentityForms: PropTypes.func.isRequired,
    /*
     Selector to retrieve the value of a form
     */
    getForm: PropTypes.func.isRequired,
    //
    // from withIdentities HoC
    //
    /*
     Action creator to update an identity
     */
    handleCreateIdentity: PropTypes.func.isRequired,
    /*
     Flag indicating any error when retrieve identities
     */
    identitiesError: PropTypes.string.isRequired,
  };

  state = {
    currentStep: 0,
    passphrase: '',
    goToDashboard: false,
  };

  constructor(props) {
    super(props);
    this.localStorage = new LocalStorage('iden3');
  }

  /**
   * Get the fields of the two inputs of when passphrase is asked
   * just to fill them if we are moving forward or backwards to the
   * that step.
   */
  componentDidMount() {
    this.props.getForm(FORMS.PASSPHRASE);
    this.props.getForm(FORMS.IDENTITY_NAME);
  }

  componentWillUnmount() {
    this.setState({ goToDashboard: true });
  }

  /**
   * Set component state to show the right view of the welcome wizard
   * @param {string} direction should be 'forward' or 'backwards'
   */
  changeStep = (direction = 'forward') => {
    if (!this.state.goToDashboard) {
      let { currentStep } = this.state;

      if (direction === 'forward') {
        currentStep = this.state.currentStep + 1;
      } else if (direction === 'backwards') {
        currentStep = this.state.currentStep - 1;
      }

      if (currentStep === sortedSteps.length) {
        this.setState({ goToDashboard: true });
      } else {
        this.setState({ currentStep });
      }
    }
  };

  /**
   * Create the identity: create keys and set the relay. Then
   * call the action creator to create the identity and set it
   * in the app state and in the storage selected.
   *
   * @private {Object}  data - with identity 'label'/'name' and 'domain'
   */
  createIdentity = (data) => {
    this.props.handleCreateIdentity(this.state.passphrase, data)
      .then(() => this.props.handleClearCreateIdentityForms())
      .catch(error => notificationsHelper.showNotification('error', {
        message: 'Error',
        description: `We are sorry... There was an error creating the identity:\n${error}`,
        style: {
          background: '#f95555',
          color: 'white',
        },
      }));
  };

  setPassphrase = (passphrase) => {
    this.setState({ passphrase });
  };

  /**
   * Call the action to update the form in the app state
   * @param {string} form - from one of the forms in the app (given from a constants file)
   * @param {object} newValues - with the new values
   */
  updateForm = (form, newValues) => {
    this.props.handleUpdateForm(form, newValues);
  };

  render() {
    const Step = sortedSteps[this.state.currentStep];
    if (this.props.identitiesError) {
      notificationsHelper.showNotification('error', {
        message: 'Error',
        description: `We are sorry... There was an error creating the identity:\n${this.props.identitiesError}`,
        style: {
          background: '#f95555',
          color: 'white',
        },
      });
    }

    return (
      <div className="i3-ww-ci">
        <Step
          createIdentity={this.createIdentity}
          setPassphrase={this.setPassphrase}
          getFormValue={this.props.getForm}
          updateForm={this.updateForm}
          showNotification={this.showNotification}
          move={this.changeStep} />
      </div>
    );
  }
}

export default compose(
  withIdentities,
  withFormsValues,
)(CreateIdentity);
