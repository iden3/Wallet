import {
  FETCHING_EMITTED_CLAIMS,
  FETCHING_EMITTED_CLAIMS_SUCCESS,
  FETCHING_EMITTED_CLAIMS_ERROR,
  FETCHING_RECEIVED_CLAIMS,
  FETCHING_RECEIVED_CLAIMS_ERROR,
  FETCHING_RECEIVED_CLAIMS_SUCCESS,
} from './constants';


function fetchingEmittedClaims() {
  return {
    type: FETCHING_EMITTED_CLAIMS,
  };
}

function fetchingEmittedClaimsSuccess(response) {
  return {
    type: FETCHING_EMITTED_CLAIMS_SUCCESS,
    response,
  };
}

function fetchingEmittedClaimsError(error) {
  console.log(error);
  return {
    type: FETCHING_EMITTED_CLAIMS_ERROR,
    error: 'Fetching emitted claims error',
  };
}

function fetchingReceivedClaims() {
  return {
    type: FETCHING_RECEIVED_CLAIMS,
  };
}

function fetchingReceivedClaimsSuccess(response) {
  return {
    type: FETCHING_RECEIVED_CLAIMS_SUCCESS,
    response,
  };
}

function fetchingReceivedClaimsError(error) {
  console.log(error);
  return {
    type: FETCHING_RECEIVED_CLAIMS_ERROR,
    error: 'Fetching received claims error',
  };
}

export function handleFetchingEmittedClaims() {
  return function (dispatch) {
    dispatch(fetchingEmittedClaims());
    return Promise.resolve()
      .then(({ data }) => {
        dispatch(fetchingEmittedClaimsSuccess({
          claims: data,
        }));
      })
      .catch(error => dispatch(fetchingEmittedClaimsError(error)));
  };
}

export function handleFetchingReceivedClaims() {
  return function (dispatch) {
    dispatch(fetchingReceivedClaims());
    return Promise.resolve()
      .then(({ data }) => {
        dispatch(fetchingReceivedClaimsSuccess({
          claims: data,
        }));
      })
      .catch(error => dispatch(fetchingReceivedClaimsError(error)));
  };
}
