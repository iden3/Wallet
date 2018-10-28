import { Map as ImmutableMap } from 'immutable';
import * as FORMS from 'constants/forms';
import {
  FETCHING_FORMS,
  FETCHING_FORMS_SUCCESS,
  FETCHING_FORMS_ERROR,
  UPDATE_PASSPHRASE_FORM,
  UPDATE_IDENTITY_NAME_FORM,
  CLEAR_CREATE_IDENTITY_FORMS,
  CLEAR_CREATE_IDENTITY_FORMS_SUCCESS,
  CLEAR_CREATE_IDENTITY_FORMS_ERROR,
} from './constants';


function fetchingForms() {
  return {
    type: FETCHING_FORMS,
  };
}

function fetchingFormsSuccess(response) {
  return {
    type: FETCHING_FORMS_SUCCESS,
    response,
  };
}

function fetchingFormsError(error) {
  console.log(error);
  return {
    type: FETCHING_FORMS_ERROR,
    error: 'Fetching forms error',
  };
}

function clearCreateIdentityForms() {
  return {
    type: CLEAR_CREATE_IDENTITY_FORMS,
  };
}

function clearCreateIdentityFormsSuccess() {
  return {
    type: CLEAR_CREATE_IDENTITY_FORMS_SUCCESS,
  };
}

function clearCreateIdentityFormsError(error) {
  console.log(error);
  return {
    type: FETCHING_FORMS_ERROR,
    error: 'Clear create identity forms error',
  };
}

export function handleFetchingForms() {
  return function (dispatch) {
    dispatch(fetchingForms());
    return Promise.resolve()
      .then((data) => {
        dispatch(fetchingFormsSuccess({
          forms: data,
        }));
      })
      .catch(error => dispatch(fetchingFormsError(error)));
  };
}

export function handleUpdateForm(form, newValues) {
  let type;

  switch (form) {
    case FORMS.PASSPHRASE:
      type = UPDATE_PASSPHRASE_FORM;
      break;
    case FORMS.IDENTITY_NAME:
      type = UPDATE_IDENTITY_NAME_FORM;
      break;
    default:
      throw new Error('No form available to update');
  }

  return {
    type,
    data: new ImmutableMap({ ...newValues }),
  };
}

/**
 * Clear the forms that are in the wizard of create the identity
 * and store the passphrase in the app state and in the storage
 *
 * TODO: not store passphrase, this is only for demo purposes
 * @returns {function(*): Promise<void | never>}
 */
export function handleClearCreateIdentityForms() {
  return function (dispatch) {
    dispatch(clearCreateIdentityForms());
    return Promise.resolve()
      .then(() => dispatch(clearCreateIdentityFormsSuccess()))
      .catch(error => dispatch(clearCreateIdentityFormsError(error)));
  };
}
