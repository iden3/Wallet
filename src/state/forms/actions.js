import { Map as ImmutableMap } from 'immutable';
import * as FORMS from 'constants/forms';
import {
  FETCHING_FORMS,
  FETCHING_FORMS_SUCCESS,
  FETCHING_FORMS_ERROR,
  UPDATE_PASSPHRASE_FORM, UPDATE_IDENTITY_NAME_FORM,
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
