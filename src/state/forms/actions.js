import { Map as ImmutableMap } from 'immutable';
import {
  FETCHING_FORMS,
  FETCHING_FORMS_SUCCESS,
  FETCHING_FORMS_ERROR,
  UPDATE_PASSPHRASE_FORM,
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

export function handleUpdatePassphrase(passphrase) {
  return {
    type: UPDATE_PASSPHRASE_FORM,
    data: new ImmutableMap({ ...passphrase }),
  };
}
