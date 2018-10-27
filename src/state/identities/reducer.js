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
});

function identities(state = initialState, action) {
  switch (action.type) {
    case CREATE_IDENTITY:
      return state.merge({
        isFetching: true,
      });
    case CREATE_IDENTITY_SUCCESS: {
      const newIdentity = {
        label: action.data.get('label') || action.data.get('name') || '',
        icon: action.data.get('icon'),
        domain: action.data.get('domain'),
        keys: new ImmutableMap({
          keyRevoke: action.data.get('keys').keyRevoke,
          keyRecovery: action.data.get('keys').keyRecovery,
          keyOp: action.data.get('keys').keyOp,
          keyContainer: action.data.get('keys').keyContainer,
        }),
        seed: action.data.get('seed') || [],
        relay: action.data.get('relay'),
        id: action.data.get('id'),
        idAddr: action.data.get('idAddr'),
      };

      // TODO: check if there is a current identity or sent by the action.data
      return state.merge({
        isFetching: false,
        error: '',
        identities: state.get('identities').set(action.data.get('idAddr'), newIdentity),
        currentIdentity: action.data.get('idAddr'),
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
        identities: state.get('identities').set(action.data.get('idAddr'), action.data),
      });
    case UPDATE_IDENTITY_ERROR:
      return state.merge({
        isFetching: false,
        error: action.data,
      });
    default:
      return state;
  }
}

export default identities;
