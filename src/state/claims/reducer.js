import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';
import {
  FETCHING_EMITTED_CLAIMS,
  FETCHING_EMITTED_CLAIMS_ERROR,
  FETCHING_EMITTED_CLAIMS_SUCCESS,
  FETCHING_RECEIVED_CLAIMS,
  FETCHING_RECEIVED_CLAIMS_ERROR,
  FETCHING_RECEIVED_CLAIMS_SUCCESS,
} from './constants';

const initialState = new ImmutableMap({
  error: '',
  isFetchingClaims: true,
  received: ImmutableMap(),
  emitted: ImmutableMap(),
  grouped: ImmutableList(),
});

function claims(state = initialState, action) {
  switch (action.type) {
    case FETCHING_EMITTED_CLAIMS:
      return state.merge({
        isFetchingClaims: true,
      });
    case FETCHING_EMITTED_CLAIMS_SUCCESS:
      return state.merge({
        isFetchingClaims: false,
        emitted: action.data,
      });
    case FETCHING_EMITTED_CLAIMS_ERROR:
      return state.merge({
        isFetchingClaims: false,
        emitted: ImmutableMap(),
        error: action.error,
      });
    case FETCHING_RECEIVED_CLAIMS:
      return state.merge({
        isFetchingClaims: true,
      });
    case FETCHING_RECEIVED_CLAIMS_SUCCESS:
      return state.merge({
        isFetchingClaims: false,
        received: action.data,
      });
    case FETCHING_RECEIVED_CLAIMS_ERROR:
      return state.merge({
        isFetchingClaims: false,
        received: ImmutableMap(),
        error: action.error,
      });
    default:
      return state;
  }
}

export default claims;
