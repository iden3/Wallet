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
  DELETE_IDENTITY,
  DELETE_IDENTITY_SUCCESS,
  DELETE_IDENTITY_ERROR,
  CHANGE_CURRENT_IDENTITY,
  CHANGE_CURRENT_IDENTITY_SUCCESS,
  CHANGE_CURRENT_IDENTITY_ERROR,
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

function deleteIdentity() {
  return {
    type: DELETE_IDENTITY,
  };
}

function deleteIdentitySuccess(idAddress) {
  return {
    type: DELETE_IDENTITY_SUCCESS,
    data: idAddress,
  };
}

function deleteIdentityError(error) {
  console.error(error);
  return {
    type: DELETE_IDENTITY_ERROR,
    data: error,
  };
}

function changeCurrentIdentity() {
  return {
    type: CHANGE_CURRENT_IDENTITY,
  };
}

function changeCurrentIdentitySuccess(idAddress) {
  return {
    type: CHANGE_CURRENT_IDENTITY_SUCCESS,
    data: idAddress,
  };
}

function changeCurrentIdentityError(error) {
  console.error(error);
  return {
    type: CHANGE_CURRENT_IDENTITY_ERROR,
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
    const isCurrent = selectors.getIdentitiesNumber(getState()) === 0;

    dispatch(createIdentity());
    return identitiesHelper.createIdentity(data, passphrase, isCurrent)
      .then((identity) => {
        const newIdentity = Object.assign({}, identity);
        if (!newIdentity) throw new Error('Identity does not match with the model');
        // update the number of identities
        identitiesHelper.updateIdentitiesNumber(true);
        dispatch(createIdentitySuccess(newIdentity));
        // return data from new user because is needed to bind it to a label in next step of the UI
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
        identitiesHelper.setIdentityAsCurrent(updatedIdentity.address);
        dispatch(updateIdentitySuccess(updatedIdentity));
      })
      .catch(error => dispatch(updateIdentityError(error)));
  };
}

/**
 * Action creator to load in the app state all the identities from the storage.
 * Called when reload page or enter.
 */
export function handleSetIdentitiesFromStorage() {
  return function (dispatch) {
    dispatch(setAllIdentities());
    return Promise.resolve(identitiesHelper.getAllIdentities())
      .then((identities) => {
        const currentIdentity = identitiesHelper.getCurrentIdentity();
        dispatch(setAllIdentitiesSuccess({ identities, currentIdentity }));
      })
      .catch(error => dispatch(setAllIdentitiesError(error)));
  };
}

/**
 * Action creator to delete all the identities of the application.
 *
 * @param {string} passphrase - Introduced by user to delete all identities
 */
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

/**
 * Action creator to delete one identity.
 *
 * @param {string} idAddress - Ethereum address of the identity
 * @param {string} passphrase - Introduced by the user to delete the identity
 */
export function handleDeleteIdentity(idAddress, passphrase) {
  return function (dispatch) {
    if (!idAddress) {
      return dispatch(deleteAllIdentitiesError('No address provided to delete the identity'));
    }

    dispatch(deleteIdentity);
    return Promise.resolve(identitiesHelper.deleteIdentity(idAddress, passphrase))
      .then((isDeleted) => {
        isDeleted
          ? dispatch(deleteIdentitySuccess(idAddress))
          : dispatch(deleteIdentityError('Could not delete identity'));
      })
      .catch(error => dispatch(deleteIdentityError(error)));
  };
}

/**
 * Action creator to change the current user in the app.
 *
 * @param {string} idAddress - identity address to change in the app and load all the related data
 */
export function handleChangeCurrentIdentity(idAddress) {
  return function (dispatch) {
    if (!idAddress) {
      return dispatch(changeCurrentIdentityError('No identity address provided to change to them'));
    }

    dispatch(changeCurrentIdentity);
    return Promise.resolve(identitiesHelper.setIdentityAsCurrent(idAddress))
      .then((isUpdated) => {
        isUpdated
          ? dispatch(changeCurrentIdentitySuccess(idAddress))
          : dispatch(changeCurrentIdentityError('Could not change to selected identity'));
      })
      .catch(error => dispatch(changeCurrentIdentityError(error)));
  };
}
