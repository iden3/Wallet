import { combineReducers } from 'redux';
import claims from './claims';
import forms from './forms';
import history from './history';
import qrCodes from './qr-codes';
import identities from './identities';

const ownReducers = {};

export default combineReducers({
  ...ownReducers,
  // add here your reducers after importing the entity state
  // i.e: myStuff: myStuff.reducer, etc...
  claims: claims.reducer,
  forms: forms.reducer,
  history: history.reducer,
  qrCodes: qrCodes.reducer,
  identities: identities.reducer,
});
