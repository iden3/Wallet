import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
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
  CREATE_GENERIC_CLAIM,
  CREATE_GENERIC_CLAIM_SUCCESS,
  CREATE_GENERIC_CLAIM_ERROR,
  GENERATE_ASSIGN_NAME_CLAIM,
  GENERATE_ASSIGN_NAME_CLAIM_SUCCESS,
  GENERATE_ASSIGN_NAME_CLAIM_ERROR,
  GENERATE_AUTH_K_SIGN_CLAIM,
  GENERATE_AUTH_K_SIGN_CLAIM_SUCCESS,
  GENERATE_AUTH_K_SIGN_CLAIM_ERROR,
  UPDATE_PINNED_CLAIMS,
  UPDATE_PINNED_CLAIMS_SUCCESS,
  UPDATE_PINNED_CLAIMS_ERROR,
} from './constants';

const initialState = new ImmutableMap({
  error: ImmutableRecord({ message: '' }),
  isFetchingClaims: true,
  pinned: new ImmutableMap({}),
  emitted: new ImmutableMap({}),
  received: new ImmutableMap({}),
  grouped: new ImmutableMap({}),
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
        error: new ImmutableRecord({ message: '' }),
      });
    case FETCHING_CLAIMS_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: state.get('error').set('message', action.error),
      });
    case CREATE_CLAIM_SUCCESS:
      return state;
    case CREATE_GENERIC_CLAIM:
      return state.merge({
        isFetchingClaims: true,
      });
    case CREATE_GENERIC_CLAIM_SUCCESS:
      return state.merge({
        isFetchingClaims: false,
        error: new ImmutableRecord({ message: '' }),
        emitted: state.get(CLAIMS.TYPE.EMITTED.NAME).set(
          action.data.get('id'),
          new ImmutableMap({
            introducedContent: action.data.get('introducedContent'),
            identity: action.data.get('identity'),
            data: action.data.get('data'),
            type: action.data.get('type'),
            date: action.data.get('date'),
            time: action.data.get('time'),
            proof: action.data.get('proof'),
            url: action.data.get('url'),
            id: action.data.get('id'),
            // isPinned: action.data.get('isPinned'),
          }),
        ),
      });
    case CREATE_GENERIC_CLAIM_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: state.get('error').set('message', action.error),
      });
    case AUTHORIZE_CLAIM:
      return state.merge({
        isFetchingClaims: true,
      });
    case AUTHORIZE_CLAIM_SUCCESS:
      return state.merge({
        isFetchingClaims: false,
        error: new ImmutableRecord({ message: '' }),
        emitted: state.get(CLAIMS.TYPE.EMITTED.NAME).set(
          action.data.get('id'),
          new ImmutableMap({
            identity: action.data.get('identity'),
            data: action.data.get('data'),
            type: action.data.get('type'),
            date: action.data.get('date'),
            time: action.data.get('time'),
            proof: action.data.get('proof'),
            url: action.data.get('url'),
            id: action.data.get('id'),
            // isPinned: action.data.get('isPinned'),
          }),
        ),
      });
    case AUTHORIZE_CLAIM_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: state.get('error')().set('message', action.error.message),
      });
    case GENERATE_ASSIGN_NAME_CLAIM:
      return state.merge({
        isFetchingClaims: true,
      });
    case GENERATE_ASSIGN_NAME_CLAIM_SUCCESS:
      return state.merge({
        isFetchingClaims: false,
        error: new ImmutableRecord({ message: '' }),
        received: state.get(CLAIMS.TYPE.RECEIVED.NAME).set(
          action.data.get('id'),
          new ImmutableMap({
            identity: action.data.get('identity'),
            data: action.data.get('data'),
            type: action.data.get('type'),
            date: action.data.get('date'),
            time: action.data.get('time'),
            proof: action.data.get('proof'),
            url: action.data.get('url'),
            id: action.data.get('id'),
            // isPinned: action.data.get('isPinned'),
          }),
        ),
      });
    case GENERATE_ASSIGN_NAME_CLAIM_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: state.get('error')().set('message', action.error.message),
      });
    case GENERATE_AUTH_K_SIGN_CLAIM:
      return state.merge({
        isFetchingClaims: true,
      });
    case GENERATE_AUTH_K_SIGN_CLAIM_SUCCESS:
      return state.merge({
        isFetchingClaims: false,
        error: new ImmutableRecord({ message: '' }),
        emitted: state.get(CLAIMS.TYPE.EMITTED.NAME).set(
          action.data.get('id'),
          new ImmutableMap({
            identity: action.data.get('identity'),
            data: action.data.get('data'),
            type: action.data.get('type'),
            date: action.data.get('date'),
            time: action.data.get('time'),
            proof: action.data.get('proof'),
            url: action.data.get('url'),
            id: action.data.get('id'),
            // isPinned: action.data.get('isPinned'),
          }),
        ),
      });
    case GENERATE_AUTH_K_SIGN_CLAIM_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: state.get('error')().set('message', action.error.message),
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
      });
    case SET_ALL_CLAIMS_ERROR:
      return state.merge({
        isFetchingClaims: false,
        error: state.get('error').set('message', action.error),
      });
    /* case UPDATE_PINNED_CLAIMS:
      return state.merge({
        isFetchingClaims: true,
      });
    case UPDATE_PINNED_CLAIMS_SUCCESS: {
      const emitted = state.get('emitted');
      const received = state.get('received');
      const grouped = state.get('grouped');
      const pinned = state.get('pinned');

      return state.merge({
        isFetchingClaims: false,
        pinned: pinned.merge(action.data.updatedList),
        emitted: emitted.get(action.data.idToUpdate)
          ? emitted.setIn(
            [action.data.idToUpdate, 'isPinned'],
            !emitted.get(action.data.idToUpdate).isPinned,
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
      }); */
    default:
      return state;
  }
}

export default claims;
