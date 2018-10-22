import API from 'helpers/api';
import { Map as ImmutableMap } from 'immutable';
import {
  AUTHORIZE_CLAIM,
  AUTHORIZE_CLAIM_SUCCESS,
  AUTHORIZE_CLAIM_ERROR,
  FETCHING_CLAIMS,
  FETCHING_CLAIMS_SUCCESS,
  FETCHING_CLAIMS_ERROR,
  CREATE_CLAIM,
  CREATE_CLAIM_SUCCESS,
  CREATE_CLAIM_ERROR,
} from './constants';


function fetchingClaims() {
  return {
    type: FETCHING_CLAIMS,
  };
}

function fetchingClaimsSuccess(data) {
  return {
    type: FETCHING_CLAIMS_SUCCESS,
    data,
  };
}

function fetchingClaimsError(error) {
  console.log(error);
  return {
    type: FETCHING_CLAIMS_ERROR,
    error: 'Fetching claims error',
  };
}

function createClaim() {
  return {
    type: CREATE_CLAIM,
  };
}

function createClaimSuccess(data) {
  return {
    type: CREATE_CLAIM_SUCCESS,
    data: new ImmutableMap({ ...data }),
  };
}

function createClaimError(data) {
  return {
    type: CREATE_CLAIM_ERROR,
    data,
  };
}

function authorizeClaim() {
  return {
    type: AUTHORIZE_CLAIM,
  };
}

function authorizeClaimSuccess(data) {
  return {
    type: AUTHORIZE_CLAIM_SUCCESS,
    data: new ImmutableMap({ ...data }),
  };
}

function authorizeClaimError(error) {
  return {
    type: AUTHORIZE_CLAIM_ERROR,
    data: error,
  };
}

export default function handleFetchingClaims() {
  return function (dispatch) {
    dispatch(fetchingClaims());
    return Promise.resolve()
      .then(({ data }) => {
        dispatch(fetchingClaimsSuccess({
          claims: data,
        }));
      })
      .catch(error => dispatch(fetchingClaimsError(error)));
  };
}

export function handleCreateClaim(claim) {
  return function (dispatch) {
    dispatch(createClaim());
    return Promise.resolve()
      .then(() => {
        dispatch(createClaimSuccess(claim));
      })
      .catch(error => dispatch(createClaimError(error)));
  };
}

export function handleAuthorizeClaim(identity, claim) {
  return function (dispatch) {
    dispatch(authorizeClaim());
    return API.authorizeClaim(identity, claim)
      .then((authorizedClaimData) => {
        dispatch(authorizeClaimSuccess(authorizedClaimData));
      })
      .catch(error => dispatch(authorizeClaimError(error)));
  };
}
