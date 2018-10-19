import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import * as FORMS from 'constants/forms';
import LocalStorage from 'helpers/local-storage';
import {
  withFormsValues,
  withIdentities,
} from 'hocs';
import { notification } from 'base_components';
import * as ROUTES from 'constants/routes';
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
     Selector to retrieve the value of a form
     */
    getForm: PropTypes.func.isRequired,
    //
    // from react-router HoC
    //
    /*
     React-router history prop
     */
    history: PropTypes.object.isRequired,
    //
    // from withIdentities HoC
    //
    /*
     Action creator to update an identity
     */
    handleCreateIdentity: PropTypes.func.isRequired,
    /*
     Update an identity, used to bind identity with a name after has been created
     */
    handleUpdateIdentity: PropTypes.func.isRequired,
    /*
     Action to add or subtract an identity
     */
    handleUpdateIdentitiesNumber: PropTypes.func.isRequired,
    /*
     Flag indicating any error when retrieve identities
     */
    identitiesError: PropTypes.string.isRequired,
  };

  state = {
    currentStep: 0,
    userCreated: {},
    passphrase: '',
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

  /**
   * Call the action to update the form in the app state
   * @param {string} form - from one of the forms in the app (given from a constants file)
   * @param {object} newValues - with the new values
   */
  updateForm = (form, newValues) => {
    this.props.handleUpdateForm(form, newValues);
  };

  /**
   * Create the identity: create keys and set the relay. Then
   * call the action creator to create the identity and set it
   * in the app state and in the storage selected
   * @private
   */
  createIdentity = (passphrase) => {
    this.setState({ passphrase });
    this.props.handleCreateIdentity(passphrase)
      .then(newUser => this.setState({ userCreated: newUser }));

    if (this.props.identitiesError) {
      this.showNotification('error', {
        message: 'Error',
        description: `We are sorry... There was an error creating the identity:\n${this.props.identitiesError}`,
        style: {
          background: '#f95555',
          color: 'white',
        },
      });
    }
  };

  /**
   * Update an identity. Basically it's used in the step after created the identity,
   * in which we bind the name with the identity. We need to send the passprhase
   * stored to sign the petition to the Relay.
   *
   * @param {Object} data - The data to update
   * @returns {Promise<void>}
   */
  updateIdentity = async (data) => {
    await this.props.handleUpdateIdentity(this.state.userCreated, data, this.state.passphrase);
  };

  /**
   * Call back triggered after last step of create identity.
   * Also we clean the history to don't let the user come back and
   * create the identity key in the local storage with the address
   * returned by the relay
   * @returns {element} React element with the redirection to the Dashboard
   * @private
   */
  _goToDashboard() {
    // clean history to don't let user go back
    this.props.handleUpdateIdentitiesNumber(true); // true is to add a new identity
    this.props.history.index = 0; // in order that user can't go back
    return (<Redirect to={ROUTES.DASHBOARD.MAIN} />);
  }

  render() {
    const Step = sortedSteps[this.state.currentStep];

    return (
      <div className="i3-ww-ci">
        {
           this.state.currentStep <= sortedSteps.length - 1
             ? (
               <Step
                 createIdentity={this.createIdentity}
                 updateIdentity={this.updateIdentity}
                 getFormValue={this.props.getForm}
                 updateForm={this.updateForm}
                 showNotification={this.showNotification}
                 move={this.changeStep} />
             )
             : this._goToDashboard()
        }
      </div>
    );
  }
}

export default compose(
  withIdentities,
  withFormsValues,
)(CreateIdentity);
