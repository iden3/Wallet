import {
  generateHash,
  isPrimitive,
} from 'helpers/utils';
import bip39 from 'bip39';
import { format } from 'date-fns';
import identitySchema from './identity';

export const areSameSchemas = function (model, data) {
  let areSameTypes = false;

  if (model && data && model.constructor === Object && data.constructor === Object) {
    const modelKeys = Object.keys(model);
    const dataKeys = Object.keys(data);
    const modelLength = modelKeys.length;
    const dataLength = dataKeys.length;

    if (modelLength === dataLength) {
      for (let i = 0; i < modelKeys; i++) {
        if (modelKeys[i].constructor === dataKeys[i].constructor) {
          if (isPrimitive(model[i]) && isPrimitive(data[i])) {
            areSameTypes = dataKeys[i] === modelKeys[i];
          } else if (model[i].constructor === Object
            && data[i].constructor === Object) {
            // if both are objects, iterate (recursive call)
            areSameTypes = areSameSchemas(model[i], data[i]);
          }
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

export const checkSchemas = function (model, data) {
  // check there are no null or undefined types
  if (model === null || model === undefined || data === null || model === null) {
    return new Error('One or both values to compare are null or undefined');
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
      _areSameSchemas = areSameSchemas(model, data);
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

export const parseIdentitySchema = function (data, isDefault = false) {
  /*  date: "12/Nov/2018"
    domain: "iden3.io"
    icon: "0deddd00f7c7adc"
    id: Id {keyRecover: "0x4bf833e8bf91abae8c07f6cb89a5af051de028dd", keyRevoke: "0x9144e67c65862c642ac6d9773d23d2af83a5a0d4", keyOperational: "0x550c027c66a16ed37951b19685bd06e841a4367c", relay: Relay, idaddr: "0x85fa65dfe7237cee339038fda4c916d8ebf7b0d2", …}
    idAddr: "0x85fa65dfe7237cee339038fda4c916d8ebf7b0d2"
    keys: {keyRecovery: "0x4bf833e8bf91abae8c07f6cb89a5af051de028dd", keyRevoke: "0x9144e67c65862c642ac6d9773d23d2af83a5a0d4", keyOp: "0x550c027c66a16ed37951b19685bd06e841a4367c", keyContainer: LocalStorageContainer}
    label: "asased"
    relay: Relay {url: "https://relay.iden3.io"}
    time: "12:34"*/

  const date = new Date();

  const parsedObject = {
    address: data.idaddr,
    date: format(date, 'd/MMM/yyyy'),
    domain: data.domain,
    icon: generateHash(),
    id: Object.getPrototypeOf({}),
    implementation: data.implementation,
    keys: {
      recovery: data.keys.keyRecovery,
      revoke: data.keys.keyRevoke,
      operational: data.keys.keyOp,
    },
    keysContainer: {
      prefix: data.keys.container.prefix,
      type: data.keys.container.type,
      encryptionKey: data.keys.container.encryptionKey,
    },
    label: data.label,
    originalDateTime: date,
    relay: Object.getPrototypeOf({}),
    relayURL: data.relay.url,
    seed: bip39.generateMnemonic(),
    time: format(date, 'HH:mm'),
    isDefault,
  };

  return checkSchemas(identitySchema, parsedObject)
    ? parsedObject
    : undefined;

};
