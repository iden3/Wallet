import { combineReducers } from 'redux';
import claims from './claims';
import forms from './forms';
import historical from './historical';
import qrCodes from './qr-codes';
import identities from './identities';

const ownReducers = {};

const appReducer = combineReducers({
  ...ownReducers,
  // add here your reducers after importing the entity state
  // i.e: myStuff: myStuff.reducer, etc...
  claims: claims.reducer,
  forms: forms.reducer,
  historical: historical.reducer,
  qrCodes: qrCodes.reducer,
  identities: identities.reducer,
});

/**
 * This only happens when delete all identities, so , we need
 * to delete the app state, before redirect againg¡ to the wizard
 * for creating an identity.
 *
 * @param state
 * @param action
 * @returns {any}
 */
const rootReducer = (state, action) => {
  if (action.type === 'DELETE_ALL_IDENTITIES_SUCCESS') {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
