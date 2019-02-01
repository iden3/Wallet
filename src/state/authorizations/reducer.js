import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
} from 'immutable';
import {
  C_APP_SIGN_IN,
  C_APP_SIGN_IN_SUCCESS,
  C_APP_SIGN_IN_ERROR,
} from './constants';

/*
* action will be an immutable map. The key will be the identity address, an inside, an array
* of each action performed by user (sign in, sign up, etc...)
*/
const ErrorField = new ImmutableRecord({ message: '' });
const initialState = new ImmutableMap({
  error: new ErrorField({ message: '' }),
  isFetching: false,
  actions: new ImmutableMap({}),
});

function authorizations(state = initialState, action) {
  switch (action.type) {
    case C_APP_SIGN_IN:
      return state.merge({
        isFetching: true,
      });
    case C_APP_SIGN_IN_SUCCESS: {
      const identityAddress = action.data.get('identityAddress');
      let actions;

      if (state.get('actions').size === 0 || state.get('actions').get(identityAddress).size === 0) {
        actions = state.get('actions').set(identityAddress, []);
      } else {
        actions = state.get('actions');
      }

      return state.merge({
        isFetching: false,
        actions: actions.setIn([identityAddress], actions.get(identityAddress).concat(action.data.toJS())),
        error: state.get('error').set('message', ''),
      });
    }
    case C_APP_SIGN_IN_ERROR:
      return state.merge({
        isFetching: false,
        error: state.get('error').set('message', action.data),
      });
    default:
      return state;
  }
}

export default authorizations;
