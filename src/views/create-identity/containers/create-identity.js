import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import * as FORMS from 'constants/forms';
import { TYPE as NOTIFICATIONS } from 'constants/notifications';
import {
  withFormsValues,
  withIdentities,
} from 'hocs';
import { notificationsHelper } from 'helpers';
import {
  Wizard,
} from 'views';
import {
  StepSetPassphrase,
  StepSetLabel,
  StepWelcome,
} from '../components';

import './create-identity.scss';

const sortedSteps = [
  StepWelcome,
  StepSetLabel,
  StepSetPassphrase,
];

/**
 * View to show the steps to welcome a new user and ask for a passphrase
 * when identity it's not shown.
 * Handles each change of the step views to show and the notifications to show.
 */
class CreateIdentity extends Component {
  static propTypes = {
    /*
      Flag to indicate if we are creating the first identity of the app or not. Just to know
      if we are showing the wizard as a main view or inside a box (To create other identity beyond the existent ones)
     */
    afterCreateIdentity: PropTypes.func,
    /*
     Flag to know if it's first identity, to show one text or other
    */
    isFirstIdentity: PropTypes.bool,
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

  static defaultProps = {
    afterCreateIdentity: () => {},
    isFirstIdentity: true,
  }

  state = {
    // currentStep: 0,
    passphrase: '',
    // goToDashboard: false,
    labelData: { label: '', domain: '' },
  };

  /**
   * Get the fields of the two inputs of when passphrase is asked
   * just to fill them if we are moving forward or backwards to the
   * that step.
   */
  componentDidMount() {
    this.props.getForm(FORMS.PASSPHRASE);
    this.props.getForm(FORMS.IDENTITY_NAME);
  }

  /* componentWillUnmount() {
    this.setState({ goToDashboard: true });
  } */

  /**
   * Set the label chosen by the user in the state to use it in the last step to create the identity.
   *
   * @param {string} data - With the label chosen
   */
  setLabel = (data) => {
    if (data.label && data.domain) {
      this.setState({ labelData: data });
    } else {
      notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        description: 'We are sorry... No name/label or domain set or could not be saved',
      });
    }
  }

  /**
   * Set the passphrase in the component state needed to sign the identity keys
   * when created.
   *
   * @param passphrase - Chosen by the user
   */
  setPassphrase = (passphrase) => {
    this.setState({ passphrase });
  }

  /**
   * Set component state to show the right view of the welcome wizard.
   *
   * @param {string} direction should be 'forward' or 'backwards'
   */
  /* changeStep = (direction = 'forward') => {
    if (!this.state.goToDashboard) {
      let { currentStep } = this.state;

      if (direction === 'forward') {
        currentStep = this.state.currentStep + 1;
      } else if (direction === 'backwards') {
        currentStep = this.state.currentStep - 1;
      }

      if (currentStep === sortedSteps.length) {
        this.createIdentity();
        this.setState({ goToDashboard: true });
      } else {
        this.setState({ currentStep });
      }
    }
  } */

  /**
   * Create the identity: create keys and set the relay. Then
   * call the action creator to create the identity and set it
   * in the app state and in the storage selected.
   *
   * @param {Object} data - with identity 'label'/'name' and 'domain'
   */
  createIdentity = async (data = this.state.labelData) => {
    if (this.state.passphrase && data) { // step asking for passphrase already done
      await this.props.handleCreateIdentity(this.state.passphrase, data)
        .then(() => this.props.handleClearCreateIdentityForms())
        .then(() => this.props.afterCreateIdentity())
        .catch(error => notificationsHelper.showNotification({
          type: NOTIFICATIONS.ERROR,
          description: `We are sorry... There was an error creating the identity:\n${error}`,
        }));
    } else {
      notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        description: 'We are sorry... There was an error creating the identity:\nNo passphrase or label set',
      });
    }
  }

  /**
   * Call the action to update the form in the app state
   * @param {string} form - from one of the forms in the app (given from a constants file)
   * @param {object} newValues - with the new values
   */
  updateForm = (form, newValues) => {
    this.props.handleUpdateForm(form, newValues);
  }

  _getSortedSteps = () => {
    const Step1 = sortedSteps[0];
    const Step2 = sortedSteps[1];
    const Step3 = sortedSteps[2];

    return [
      {
        view: Step1,
        ownProps: { isFirstIdentity: this.props.isFirstIdentity },
        move: true,
      },
      {
        view: Step2,
        ownProps: { updateForm: this.updateForm, getFormValue: this.props.getForm, setLabel: this.setLabel },
        move: true,
      },
      {
        view: Step3,
        ownProps: { updateForm: this.updateForm, getFormValue: this.props.getForm, setPassphrase: this.setPassphrase },
        move: true,
      },
    ];
  }

  render() {
    // const Step = sortedSteps[this.state.currentStep];
    const sortedStepsObj = this._getSortedSteps();

    if (this.props.identitiesError) {
      notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        description: `We are sorry... There was an error creating the identity:\n${this.props.identitiesError}`,
      });
    }

    return (
      <div className="i3-ww-ci">
        { /* <Step
          isFirstIdentity={this.props.isFirstIdentity}
          setLabel={this.setLabel}
          setPassphrase={this.setPassphrase}
          getFormValue={this.props.getForm}
          updateForm={this.updateForm}
          showNotification={this.showNotification}
          move={this.changeStep} /> */}
        <Wizard
          sortedSteps={sortedStepsObj}
          lastAction={this.createIdentity} />
      </div>
    );
  }
}

export default compose(
  withIdentities,
  withFormsValues,
)(CreateIdentity);
