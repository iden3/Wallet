import API from 'helpers/api';
import { Map as ImmutableMap } from 'immutable';
import * as selectors from './selectors';
import * as utils from 'helpers/utils';
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
  SET_ALL_CLAIMS,
  SET_ALL_CLAIMS_SUCCESS,
  SET_ALL_CLAIMS_ERROR,
  UPDATE_PINNED_CLAIMS,
  UPDATE_PINNED_CLAIMS_SUCCESS,
  UPDATE_PINNED_CLAIMS_ERROR,
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

function setAllClaims() {
  return {
    type: SET_ALL_CLAIMS,
  };
}

function setAllClaimsSuccess(claims, pinnedClaims) {
  return {
    type: SET_ALL_CLAIMS_SUCCESS,
    data: new ImmutableMap({ claims, pinnedClaims }),
  };
}

function setAllClaimsError(error) {
  return {
    type: SET_ALL_CLAIMS_ERROR,
    data: error,
  };
}

function updatePinnedClaims() {
  return {
    type: UPDATE_PINNED_CLAIMS,
  };
}

function updatePinnedClaimsSuccess(data, idToUpdate) {
  return {
    type: UPDATE_PINNED_CLAIMS_SUCCESS,
    data: { updatedList: data, idToUpdate },
  };
}

function updatePinnedClaimsError(error) {
  return {
    type: UPDATE_PINNED_CLAIMS_ERROR,
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
    const claimId = utils.createUniqueAlphanumericId();
    return API.authorizeClaim(identity, claim, claimId)
      .then(authorizedClaim => dispatch(authorizeClaimSuccess(authorizedClaim)))
      .catch(error => dispatch(authorizeClaimError(error)));
  };
}

export function handleSetClaimsFromStorage() {
  return function (dispatch) {
    dispatch(setAllClaims());
    return Promise.resolve(API.getAllClaims())
      .then((claims) => {
        const pinnedClaims = API.getPinnedClaims();
        dispatch(setAllClaimsSuccess(claims, pinnedClaims));
      })
      .catch(error => dispatch(setAllClaimsError(error)));
  };
}

export function handleUpdatePinnedClaims(pinnedClaims, idToUpdate) {
  return function (dispatch, getState) {
    dispatch(updatePinnedClaims());
    return Promise.resolve(API.updatePinnedClaims(selectors.getClaims(getState()), pinnedClaims, idToUpdate))
      .then((updatedList) => {
        dispatch(updatePinnedClaimsSuccess(updatedList, idToUpdate));
      })
      .catch(error => dispatch(updatePinnedClaimsError(error)));
  };
}
