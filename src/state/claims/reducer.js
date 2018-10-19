import {
  Map as ImmutableMap,
} from 'immutable';
import {
  AUTHORIZE_CLAIM,
  AUTHORIZE_CLAIM_SUCCESS,
  AUTHORIZE_CLAIM_ERROR,
  FETCHING_CLAIMS,
  FETCHING_CLAIMS_ERROR,
  FETCHING_CLAIMS_SUCCESS,
  CREATE_CLAIM_SUCCESS,
} from './constants';

const initialState = new ImmutableMap({
  error: '',
  isFetchingClaims: true,
  claims: ImmutableMap(),
});

function claims(state = initialState, action) {
  switch (action.type) {
    case FETCHING_CLAIMS:
      return state.merge({
        isFetchingClaims: true,
      });
    case FETCHING_CLAIMS_SUCCESS:
      return state.merge({
        isFetchingClaims: false,
        claims: action.data,
        error: '',
      });
    case FETCHING_CLAIMS_ERROR:
      return state.merge({
        isFetchingClaims: false,
        claims: ImmutableMap(),
        error: action.error,
      });
    case CREATE_CLAIM_SUCCESS:
      return state;
    case AUTHORIZE_CLAIM:
      return state.merge({
        isFetchingClaims: true,
      });
    case AUTHORIZE_CLAIM_SUCCESS:
      return state.merge({
        isFetchingClaims: false,
        error: '',
        claims: action.data,
      });
    case AUTHORIZE_CLAIM_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: action.data,
      });
    default:
      return state;
  }
}

export default claims;
