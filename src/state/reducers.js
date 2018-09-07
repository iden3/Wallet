import { combineReducers } from 'redux';
import claims from './claims';
import history from './history';
import qrCodes from './qr-codes';

const ownReducers = {};

export default combineReducers({
  ...ownReducers,
  // add here your reducers after importing the entity state
  // i.e: myStuff: myStuff.reducer, etc...
  claims: claims.reducer,
  history: history.reducer,
  qrCodes: qrCodes.reducer,
});
