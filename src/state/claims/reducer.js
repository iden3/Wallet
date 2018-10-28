import { Map as ImmutableMap } from 'immutable';
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
  UPDATE_PINNED_CLAIMS,
  UPDATE_PINNED_CLAIMS_SUCCESS,
  UPDATE_PINNED_CLAIMS_ERROR,
} from './constants';

const initialState = new ImmutableMap({
  error: '',
  isFetchingClaims: true,
  pinned: ImmutableMap({}),
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
          action.data.get('id'),
          {
            identity: action.data.get('identity'),
            data: action.data.get('data'),
            type: action.data.get('type'),
            date: action.data.get('date'),
            time: action.data.get('time'),
            proof: action.data.get('proof'),
            url: action.data.get('url'),
            id: action.data.get('id'),
            isPinned: action.data.get('isPinned'),
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
        emitted: action.data.get('claims')[CLAIMS.TYPE.EMITTED.NAME],
        received: action.data.get('claims')[CLAIMS.TYPE.RECEIVED.NAME],
        grouped: action.data.get('claims')[CLAIMS.TYPE.GROUPED.NAME],
        pinned: action.data.get('pinnedClaims'),
      });
    case SET_ALL_CLAIMS_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: action.data,
      });
    case UPDATE_PINNED_CLAIMS:
      return state.merge({
        isFetchingClaims: true,
      });
    case UPDATE_PINNED_CLAIMS_SUCCESS: {
      const emitted = state.get('emitted');
      const received = state.get('received');
      const grouped = state.get('grouped');

      return state.merge({
        isFetchingClaims: false,
        pinned: action.data.updatedList,
        emitted: emitted.get(action.data.idToUpdate)
          ? emitted.setIn(
            [action.data.idToUpdate, 'isPinned'],
            !emitted.get(action.data.idToUpdate).get('isPinned'),
          )
          : emitted,
        received: received.get(action.data.idToUpdate)
          ? received.setIn(
            [action.data.idToUpdate, 'isPinned'],
            !received.get(action.data.idToUpdate).get('isPinned'),
          )
          : received,
        grouped: grouped.get(action.data.idToUpdate)
          ? grouped.setIn(
            [action.data.idToUpdate, 'isPinned'],
            !grouped.get(action.data.idToUpdate).get('isPinned'),
          )
          : grouped
        ,
      });
    }
    case UPDATE_PINNED_CLAIMS_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: action.data,
      });
    default:
      return state;
  }
}

export default claims;
