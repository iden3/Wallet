import {
  Map as ImmutableMap,
} from 'immutable';
import * as CLAIMS from 'constants/claim';
import {
  AUTHORIZE_CLAIM,
  AUTHORIZE_CLAIM_SUCCESS,
  AUTHORIZE_CLAIM_ERROR,
  FETCHING_CLAIMS,
  FETCHING_CLAIMS_ERROR,
  FETCHING_CLAIMS_SUCCESS,
  CREATE_CLAIM_SUCCESS,
  SET_ALL_CLAIMS,
  SET_ALL_CLAIMS_SUCCESS,
  SET_ALL_CLAIMS_ERROR,
} from './constants';

const initialState = new ImmutableMap({
  error: '',
  isFetchingClaims: true,
  emitted: ImmutableMap({}),
  received: ImmutableMap({}),
  grouped: ImmutableMap({}),
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
        emitted: state.get(CLAIMS.TYPE.EMITTED.NAME).set(
          action.data.get('claimId'),
          {
            identity: action.data.get('identity').get('idAddr'),
            data: action.data.get('claim'),
            type: CLAIMS.TYPE.EMITTED.NAME,
            date: new Date(),
            id: action.data.get('claimId'),
          },
        ),
      });
    case AUTHORIZE_CLAIM_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: action.data,
      });
    case SET_ALL_CLAIMS:
      return state.merge({
        isFetchingClaims: true,
      });
    case SET_ALL_CLAIMS_SUCCESS:
      return state.merge({
        isFetchingClaims: false,
        emitted: action.data.get(CLAIMS.TYPE.EMITTED.NAME),
        received: action.data.get(CLAIMS.TYPE.RECEIVED.NAME),
        grouped: action.data.get(CLAIMS.TYPE.GROUPED.NAME),
      });
    case SET_ALL_CLAIMS_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: action.data,
      });
    default:
      return state;
  }
}

export default claims;
