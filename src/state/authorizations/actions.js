import { Map as ImmutableMap } from 'immutable';
import { authorizationHelper } from 'helpers';
import {
  C_APP_SIGN_IN,
  C_APP_SIGN_IN_SUCCESS,
  C_APP_SIGN_IN_ERROR,
} from './constants';

function cAppSignIn() {
  return {
    type: C_APP_SIGN_IN,
  };
}

function cAppSignInSuccess(data) {
  return {
    type: C_APP_SIGN_IN_SUCCESS,
    data: new ImmutableMap({ ...data }),
  };
}

function cAppSignInError(error) {
  console.error(error);
  return {
    type: C_APP_SIGN_IN_ERROR,
    data: error,
  };
}

/**
 * Action creator that send to the centralized app back end the signed
 * packet of the data read.
 *
 * @param {ImmutableMap} identity - with the identity information
 * @param {Object} data - with the data read from the QR to do the sign in
 *
 * @returns {Promise} with the response of the async call
 */
export function handleCAppSignIn(identity, passphrase, data) {
  return function (dispatch) {
    dispatch(cAppSignIn());
    return new Promise((resolve, reject) => {
      if (data && data.url) {
        authorizationHelper.cAppSignIn(identity, passphrase, data)
          .then(() => {
            dispatch(cAppSignInSuccess({
              identityAddress: identity.get('address'),
              domain: data.body.data.origin,
              date: new Date(),
            }));
            resolve();
          })
          .catch((error) => {
            dispatch(cAppSignInError(error));
            reject(error);
          });
      } else {
        dispatch(cAppSignInError('No url provided to sign in'));
        reject(new Error('No url provided to sign in'));
      }
    });
  };
}
