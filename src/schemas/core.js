import {
  generateHash,
  isPrimitive,
} from 'helpers/utils';
import bip39 from 'bip39';
import { format } from 'date-fns';
import identitySchema from './identity';

/**
 * Compares the types of the values of a data object regarding the model sent.
 *
 * @param {Object} model - With the original/parent schema to be compared
 * @param {Object} data - With the object to check with the model
 * @param {boolean} deepComparison - If we find and Object, compare key/values inside as well
 * @returns {boolean} True if are data has the same schema than the model, false otherwise
 */
export const areSameSchemas = function (model, data, deepComparison = false) {
  let areSameTypes = false;

  if (model && data && model.constructor === Object && data.constructor === Object) {
    const modelKeys = Object.keys(model);
    const dataKeys = Object.keys(data);
    const modelLength = modelKeys.length;
    const dataLength = dataKeys.length;

    if (modelLength === dataLength) {
      for (let i = 0; i < modelLength; i++) {
        const modelValue = model[modelKeys[i]];
        const dataValue = data[modelKeys[i]]; // if not, keys should be in the same order than the model

        if (isPrimitive(modelValue) && isPrimitive(dataValue)
          && modelValue.constructor === dataValue.constructor) {
          areSameTypes = true;
        } else if (typeof modelValue === 'object'
          && typeof dataValue === 'object') {
          areSameTypes = deepComparison
            ? areSameSchemas(modelValue, dataValue)
            : true;
        } else {
          areSameTypes = false;
        }

        // check if there is a false value to break the loop
        if (!areSameTypes) break;
      }
    }
  }

  return areSameTypes;
};

/**
 * Given a model and constructed object to store, check that this last
 * has the same schema than the model.
 *
 * @param {Object} model - With the original/parent schema to be compared
 * @param {Object} data - With the object to check with the model
 * @param {boolean} deepComparison - If we find and Object, compare key/values inside as well
 * @throws Will throw an error if the argument is model or data are null or undefined
 * @returns {boolean} True if are data has the same schema than the model, false otherwise
 */
export const checkSchemas = function (model, data, deepComparison = false) {
  // check there are no null or undefined types
  if (model === null || model === undefined || data === null || model === null) {
    throw new Error('One or both values to compare are null or undefined');
  }

  // if same constructor or if we are receiving and Array non empty and we want to check
  // each element of the array with the model
  const modelType = model.constructor;
  const dataType = data.constructor;
  let _areSameSchemas = false;
  const areSameType = modelType === dataType
    || (dataType === Array && data.length > 0 && data[0].constructor === modelType);

  if (areSameType) {
    // if it's a type in which we don't need to iterate inside, return true
    if (isPrimitive(modelType)) {
      _areSameSchemas = true;
    }

    // if it's an object, check it's keys and values
    if (modelType === Object) {
      _areSameSchemas = areSameSchemas(model, data, deepComparison);
    }

    // if data to compare it's an array, iterate and compare each element with the model
    if (dataType === Array
      && modelType !== Array
      && data.length > 0
      && data[0].constructor === modelType) {
      const dataLength = data.length;
      let elementsAreSameType = false;

      for (let i = 0; i < dataLength; i++) {
        elementsAreSameType = areSameSchemas(model, data[i]);
        if (!elementsAreSameType) break;
      }

      _areSameSchemas = elementsAreSameType;
    }
  }

  return _areSameSchemas;
};

/**
 * Given an object with identity data from the Relay, parse it
 * to store regarding the local schema.
 *
 * @param {Object} data - With identity data
 * @returns {*} - The final identity object or null
 */
export const parseIdentitySchema = function (data) {
  const date = new Date();

  const parsedObject = {
    address: data.address,
    date: format(date, 'd/MMM/yyyy'),
    domain: data.domain,
    icon: generateHash(),
    id: Object.getPrototypeOf(data.id),
    implementation: data.id.implementation,
    keys: {
      recovery: data.keys.keyRecovery,
      revoke: data.keys.keyRevoke,
      operational: data.keys.keyOp,
    },
    keysContainer: {
      prefix: data.keys.keyContainer.prefix,
      type: data.keys.keyContainer.type,
      encryptionKey: data.keys.keyContainer.encryptionKey,
    },
    label: data.label,
    originalDateTime: date,
    relay: Object.getPrototypeOf(data.id.relay),
    relayURL: data.id.relay.url,
    seed: bip39.generateMnemonic().split(' '),
    time: format(date, 'HH:mm'),
    isDefault: data.isDefault,
  };

  return checkSchemas(identitySchema, parsedObject)
    ? parsedObject
    : null;
};
