import {
  Map as ImmutableMap,
} from 'immutable';
import {
  CREATE_IDENTITY,
  CREATE_IDENTITY_SUCCESS,
  CREATE_IDENTITY_ERROR,
  SET_ALL_IDENTITIES,
  SET_ALL_IDENTITIES_SUCCESS,
  SET_ALL_IDENTITIES_ERROR,
  UPDATE_IDENTITY,
  UPDATE_IDENTITY_SUCCESS,
  UPDATE_IDENTITY_ERROR,
  DELETE_ALL_IDENTITIES,
  DELETE_ALL_IDENTITIES_SUCCESS,
  DELETE_ALL_IDENTITIES_ERROR,
  CHANGE_CURRENT_IDENTITY,
  CHANGE_CURRENT_IDENTITY_SUCCESS,
  CHANGE_CURRENT_IDENTITY_ERROR,
  SET_MASTER_SEED_AS_SAVED,
  SET_MASTER_SEED_AS_SAVED_SUCCESS,
  SET_MASTER_SEED_AS_SAVED_ERROR,
} from './constants';

/*
 Identities is dictionary (hash) with address and an object with different values
 of the identity. I.e.:

  identities: {
    "0xfecda68f1ecd1ecdb3cf69fa5cc2c5f88862d0d6": {
      "label": "Alice Johnson",
      "seed": ["word1", ...., "word12"],,
      "relay": Object,
      "keys": { "revoke": "0x...", "recovery": "0x...", "operational": "0x..."},
      "id": Object
    },
    "0x1234568f1ecd1bdce3cf69fa5cc2c5f88862d0c7": {
      "label": "Bob Martin",
      "seed": ["word1", ...., "word12"],,
      "relay": Object,
      "keys": { "revoke": "0x...", "recovery": "0x...", "operational": "0x..."},
      "id": Object
    },
  }

  Then, current field is to indicate which identity is now loaded in the wallet.
  Will have the address of a valid identity in the Identities Hash. I.e.:

   "currentIdentity": "0xfecda68f1ecd1bdce3cf69fa5cc2c5f88862d0c7"
 */
const initialState = new ImmutableMap({
  error: '',
  isFetching: true,
  identities: ImmutableMap({}),
  currentIdentity: '',
  // needsToSaveMasterKey: true, only added if is set in the DAL, check SET_ALL_IDENTITIES_SUCCESS case
});

function identities(state = initialState, action) {
  switch (action.type) {
    case CREATE_IDENTITY:
      return state.merge({
        isFetching: true,
      });
    case CREATE_IDENTITY_SUCCESS: {
      // TODO: check if already exists the identity sent by the action
      // if already there is an identity "logged" means that we are creating
      // more identities and we don't want to change to new one, only create it
      const currentIdentity = state.get('currentIdentity') ? state.get('currentIdentity') : action.data.get('address');
      const needsToSaveMasterKey = action.data.get('needsToSaveMasterKey');
      action.data.delete('needsToSaveMasterKey');

      return state.merge({
        isFetching: false,
        error: '',
        identities: state.get('identities').set(action.data.get('address'), action.data),
        currentIdentity,
        ...needsToSaveMasterKey && { needsToSaveMasterKey: true },
      });
    }
    case CREATE_IDENTITY_ERROR:
      return state.merge({
        isFetching: false,
        error: action.data,
      });
    case SET_ALL_IDENTITIES:
      return state.merge({
        isFetching: true,
      });
    case SET_ALL_IDENTITIES_SUCCESS:
      return state.merge({
        isFetching: true,
        identities: action.data.get('identities'),
        currentIdentity: action.data.get('currentIdentity'),
        ...action.data.get('needsToSaveMasterKey') && { needsToSaveMasterKey: true },
      });
    case SET_ALL_IDENTITIES_ERROR:
      return state.merge({
        isFetching: false,
        error: action.data,
      });
    case UPDATE_IDENTITY:
      return state.merge({
        isFetching: true,
      });
    case UPDATE_IDENTITY_SUCCESS:
      return state.merge({
        isFetching: false,
        error: '',
        identities: state.get('identities').set(action.data.get('address'), action.data),
      });
    case UPDATE_IDENTITY_ERROR:
      return state.merge({
        isFetching: false,
        error: action.data,
      });
    case DELETE_ALL_IDENTITIES:
      return state.merge({
        isFetching: true,
      });
    case DELETE_ALL_IDENTITIES_SUCCESS:
      return state.merge({
        isFetching: false,
        identities: new ImmutableMap({}),
        error: '',
      });
    case DELETE_ALL_IDENTITIES_ERROR:
      return state.merge({
        isFetching: false,
        error: action.data,
      });
    case CHANGE_CURRENT_IDENTITY:
      return state.merge({
        isFetching: true,
      });
    case CHANGE_CURRENT_IDENTITY_SUCCESS: {
      const _identities = state.get('identities');

      // change the until now loaded identity as not current anymore
      _identities.get(state.get('currentIdentity')).set('isCurrent', false);
      // since we have the identity address in the action.data field, change
      // in this identity the isCurrent field to True
      _identities.get(action.data).set('isCurrent', true);
      return state.merge({
        isFetching: false,
        identities: _identities,
        currentIdentity: action.data,
      });
    }
    case CHANGE_CURRENT_IDENTITY_ERROR:
      return state.merge({
        isFetching: false,
        error: action.data,
      });
    case SET_MASTER_SEED_AS_SAVED:
      return state.merge({
        isFetching: true,
      });
    case SET_MASTER_SEED_AS_SAVED_SUCCESS:
      return state
        .delete('needsToSaveMasterKey')
        .merge({
          isFetching: false,
        });
    case SET_MASTER_SEED_AS_SAVED_ERROR:
      return state.merge({
        isFetching: false,
        error: action.data,
      });
    default:
      return state;
  }
}

export default identities;
