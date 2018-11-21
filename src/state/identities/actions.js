import { Map as ImmutableMap } from 'immutable';
import {
  API,
  identitiesHelper,
} from 'helpers';
import * as selectors from './selectors';
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
} from './constants';

function createIdentity() {
  return {
    type: CREATE_IDENTITY,
  };
}

/**
 * Action when create user has been made in the storage and Relay returned the id address
 * @param {Object} data
 * @param {string} data.address - The identity address returned by the Relay
 * @param {Object} data.keys - The key of revocation, recovery and operational
 * @param {string} data.relay - The URL of the relay
 * @returns {{type: string, data: Immutable.Map}}
 */
function createIdentitySuccess(data) {
  return {
    type: CREATE_IDENTITY_SUCCESS,
    data: new ImmutableMap({ ...data }),
  };
}

function createIdentityError(error) {
  console.error(error);
  return {
    type: CREATE_IDENTITY_ERROR,
    data: error,
  };
}

function setAllIdentities() {
  return {
    type: SET_ALL_IDENTITIES,
  };
}

function setAllIdentitiesSuccess(data) {
  return {
    type: SET_ALL_IDENTITIES_SUCCESS,
    data: new ImmutableMap({ ...data }),
  };
}

function setAllIdentitiesError(error) {
  return {
    type: SET_ALL_IDENTITIES_ERROR,
    data: error,
  };
}

function updateIdentity() {
  return {
    type: UPDATE_IDENTITY,
  };
}

function updateIdentitySuccess(data) {
  return {
    type: UPDATE_IDENTITY_SUCCESS,
    data: new ImmutableMap({ ...data }),
  };
}

function updateIdentityError(error) {
  console.error(error);
  return {
    type: UPDATE_IDENTITY_ERROR,
    data: error,
  };
}

function deleteAllIdentities() {
  return {
    type: DELETE_ALL_IDENTITIES,
  };
}

function deleteAllIdentitiesSuccess() {
  return {
    type: DELETE_ALL_IDENTITIES_SUCCESS,
  };
}

function deleteAllIdentitiesError(error) {
  console.error(error);
  return {
    type: DELETE_ALL_IDENTITIES_ERROR,
    data: error,
  };
}

/**
 * Create an identity storing it in the storate and in the app state
 *.
 * @param {string} passphrase - To use user keys
 * @param {Object} data - With the new identity data
 * @throws Will throw an error if could not create the identity in the API layer
 * @returns {function(*, *): Promise<T | never>}
 */
export function handleCreateIdentity(passphrase, data) {
  return function (dispatch, getState) {
    const isDefault = selectors.getIdentitiesNumber(getState()) === 0;

    dispatch(createIdentity());
    return identitiesHelper.createIdentity(data, passphrase, isDefault)
      .then((identity) => {
        const newIdentity = Object.assign({}, identity);
        if (!newIdentity) throw new Error('Identity does not match with the model');
        // update the number of identities
        identitiesHelper.updateIdentitiesNumber(true);
        dispatch(createIdentitySuccess(newIdentity));
        // return data from new user because is needed to bind it to a name in next step of the UI
        return newIdentity;
      })
      .catch(error => dispatch(createIdentityError(error.message)));
  };
}

/**
 * Update the number of identities creted in the current storage.
 *
 * @param {boolean} isToAdd - True for adding, false to subtract
 * @returns {function(): Promise<boolean | never>}
 */
export function handleUpdateIdentitiesNumber(isToAdd) {
  return function () {
    return new Promise((resolve, reject) => {
      const updated = identitiesHelper.updateIdentitiesNumber(isToAdd);

      updated
        ? resolve(updated)
        : reject(new Error('Couldn\'t update the number of identities'));
    });
  };
}

/**
 * Update the identity with new data.
 *
 * @param {object} identity - With all the data of the identity
 * @param {object} data - New data to merge in the identity
 * @param {string} passphrase - To encrypt keys
 *
 * @returns {function} Action creator
 */
export function handleUpdateIdentity(identity, data, passphrase) {
  return function (dispatch) {
    dispatch(updateIdentity());
    return API.updateIdentity(identity, data, passphrase)
      .then((updatedIdentity) => {
        identitiesHelper.setIdentityAsDefault(updatedIdentity);
        dispatch(updateIdentitySuccess(updatedIdentity));
      })
      .catch(error => dispatch(updateIdentityError(error)));
  };
}

export function handleSetIdentitiesFromStorage() {
  return function (dispatch) {
    dispatch(setAllIdentities());
    return Promise.resolve(identitiesHelper.getAllIdentities())
      .then((identities) => {
        const defaultIdentity = identitiesHelper.getDefaultIdentity();
        dispatch(setAllIdentitiesSuccess({ identities, currentIdentity: defaultIdentity }));
      })
      .catch(error => dispatch(setAllIdentitiesError(error)));
  };
}

export function handleDeleteAllIdentities(passphrase) {
  return function (dispatch) {
    dispatch(deleteAllIdentities());
    return Promise.resolve(identitiesHelper.deleteAllIdentities(passphrase))
      .then((areDeleted) => {
        areDeleted
          ? dispatch(deleteAllIdentitiesSuccess())
          : dispatch(deleteAllIdentitiesError('Could not be deleted the identities'));
      })
      .catch(error => dispatch(deleteAllIdentitiesError(error)));
  };
}
