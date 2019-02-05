import {
  ClaimsHelper,
  utils,
} from 'helpers';
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
  SET_ALL_CLAIMS,
  SET_ALL_CLAIMS_SUCCESS,
  SET_ALL_CLAIMS_ERROR,
  CREATE_GENERIC_CLAIM,
  CREATE_GENERIC_CLAIM_SUCCESS,
  CREATE_GENERIC_CLAIM_ERROR,
  GENERATE_ASSIGN_NAME_CLAIM,
  GENERATE_ASSIGN_NAME_CLAIM_SUCCESS,
  GENERATE_ASSIGN_NAME_CLAIM_ERROR,
  GENERATE_AUTH_K_SIGN_CLAIM,
  GENERATE_AUTH_K_SIGN_CLAIM_SUCCESS,
  GENERATE_AUTH_K_SIGN_CLAIM_ERROR,
/*  UPDATE_PINNED_CLAIMS,
  UPDATE_PINNED_CLAIMS_SUCCESS,
  UPDATE_PINNED_CLAIMS_ERROR, */
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
  console.error(error);
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
    error: data,
  };
}

function createGenericClaim() {
  return {
    type: CREATE_GENERIC_CLAIM,
  };
}

function createGenericClaimSuccess(data) {
  return {
    type: CREATE_GENERIC_CLAIM_SUCCESS,
    data: new ImmutableMap({ ...data }),
  };
}

function createGenericClaimError(data) {
  console.error(data);
  return {
    type: CREATE_GENERIC_CLAIM_ERROR,
    error: data,
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

function authorizeClaimError(data) {
  console.error(data);
  return {
    type: AUTHORIZE_CLAIM_ERROR,
    error: data,
  };
}

function generateAssignNameClaim() {
  return {
    type: GENERATE_ASSIGN_NAME_CLAIM,
  };
}

function generateAssignNameClaimSuccess(data) {
  return {
    type: GENERATE_ASSIGN_NAME_CLAIM_SUCCESS,
    data: new ImmutableMap({ ...data }),
  };
}

function generateAssignNameClaimError(data) {
  console.error(data);
  return {
    type: GENERATE_ASSIGN_NAME_CLAIM_ERROR,
    error: data,
  };
}

function generateAuthKSignClaim() {
  return {
    type: GENERATE_AUTH_K_SIGN_CLAIM,
  };
}

function generateAuthKSignClaimSuccess(data) {
  return {
    type: GENERATE_AUTH_K_SIGN_CLAIM_SUCCESS,
    data: new ImmutableMap({ ...data }),
  };
}

function generateAuthKSignClaimError(data) {
  console.error(data);
  return {
    type: GENERATE_AUTH_K_SIGN_CLAIM_ERROR,
    error: data,
  };
}

function setAllClaims() {
  return {
    type: SET_ALL_CLAIMS,
  };
}

function setAllClaimsSuccess(claims) {
  return {
    type: SET_ALL_CLAIMS_SUCCESS,
    data: new ImmutableMap({ claims }),
  };
}

function setAllClaimsError(data) {
  return {
    type: SET_ALL_CLAIMS_ERROR,
    error: data,
  };
}

/* function updatePinnedClaims() {
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
} */

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

export function handleCreateGenericClaim(identity, claim) {
  return function (dispatch) {
    dispatch(createGenericClaim());
    const localClaimId = utils.createUniqueAlphanumericId();
    const claims = new ClaimsHelper(identity);

    return claims.createGenericClaim(claim, localClaimId)
      .then((newClaim) => {
        dispatch(createGenericClaimSuccess(newClaim));
      })
      .catch(error => dispatch(createGenericClaimError(error)));
  };
}

export function handleAuthorizeClaim(identity, claimData) {
  return function (dispatch) {
    dispatch(authorizeClaim());
    const localClaimId = utils.createUniqueAlphanumericId();
    const claims = new ClaimsHelper(identity);

    return claims.authorizeClaim(claimData, localClaimId)
      .then(authorizedClaim => dispatch(authorizeClaimSuccess(authorizedClaim)))
      .catch(error => dispatch(authorizeClaimError(error)));
  };
}

export function handleGenerateAssignNameClaim(identity, proofOfClaim) {
  return function (dispatch) {
    dispatch(generateAssignNameClaim());

    const localClaimId = utils.createUniqueAlphanumericId();
    const claims = new ClaimsHelper(new ImmutableMap({ ...identity }));

    return claims.generateAssignName(localClaimId, proofOfClaim)
      .then(assignNameClaim => dispatch(generateAssignNameClaimSuccess(assignNameClaim)))
      .catch(error => dispatch(generateAssignNameClaimError(error)));
  };
}

export function handleGenerateAuthKSignClaim(identity, proofOfClaim) {
  return function (dispatch) {
    dispatch(generateAuthKSignClaim());
    const localClaimId = utils.createUniqueAlphanumericId();
    const claims = new ClaimsHelper(new ImmutableMap({ ...identity }));

    return claims.generateAuthKSign(localClaimId, proofOfClaim)
      .then(authKSignClaim => dispatch(generateAuthKSignClaimSuccess(authKSignClaim)))
      .catch(error => dispatch(generateAuthKSignClaimError(error)));
  };
}

export function handleSetClaimsFromStorage(identity) {
  return function (dispatch) {
    dispatch(setAllClaims());
    const claim = new ClaimsHelper(identity);

    return Promise.resolve(claim.getAllClaimsFromStorage())
      .then((claims) => {
        // const pinnedClaims = API.getPinnedClaims();
        dispatch(setAllClaimsSuccess(claims));
      })
      .catch(error => dispatch(setAllClaimsError(error)));
  };
}

/* export function handleUpdatePinnedClaims(pinnedClaims, idToUpdate) {
  return function (dispatch, getState) {
    dispatch(updatePinnedClaims());
    return Promise.resolve(API.updatePinnedClaims(selectors.getClaims(getState()), pinnedClaims, idToUpdate))
      .then((updatedList) => {
        dispatch(updatePinnedClaimsSuccess(updatedList, idToUpdate));
      })
      .catch(error => dispatch(updatePinnedClaimsError(error)));
  };
} */
