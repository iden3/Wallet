import iden3 from 'iden3';
import * as APP_SETTINGS from 'constants/app';
import { identitiesHelper } from 'helpers';

/**
 * Any interaction with a Relay or external agent (an AJAX call) should be done by a call set here.
 */
const API = {
  /**
   * Call to the relay to authorize sign a new claim.
   *
   * @param {Object} id - The id object to call the Relay
   * @param {Immutable.List} data - With the data of the claim to authorize
   * @returns {*|Promise<any>|Object|void}
   */
  authorizeKSignClaim(id, data) {
    return id.authorizeKSignClaim(...data.valueSeq().toJS());
  },

  /**
   * Call iden3 library to send authorization to the centralized server
   * to do the action requested in the QR read before.
   *
   * @param {Immutable.List} data - With the values
   * @returns {*} - Response from the server with universal code of success or not
   */
  authClaimToCentralizedServer(data) {
    return iden3.auth.resolv(...data.valueSeq().toJS());
  },

  /**
   * Call to the Relay to bind the label/name of an identity to an address.
   *
   * @param {Object} identity - With its information, above all, it's needed the keys and the id address
   * @param {Object} data - With label or name field to bind it to the identity
   * @param {string} passphrase - to sign the petition
   * @returns {Promise<void>}
   */
  bindIdToUsername(identity, data, passphrase) {
    // TODO: Move this to identitiesHelper and only leave here the call to the Relay
    let identityUpdated = {};

    // identity.keys.keyContainer.unlock(passphrase); // for 30 seconds to update the identity
    identity.keys.container.unlock(passphrase);
    identity.id.bindID(identity.keys.container, data.label || data.name)
      .then(res => identityUpdated = Object.assign({}, identityUpdated, res.data));
    return identityUpdated;
  },

  /**
   * Call the Relay to create a generic claim.
   *
   * METHOD: Post
   *
   * PAYLOAD EXAMPLE:
   * {
   *    ksign: "0x5e44af67722b7582db0f6add61abcfa99a0df2e4"
   *    signatureHex: "0xf8d3653f7973e4d265cbd2448877cbdbe19a478de1373902c6d78d5a04abcda76a41844ea788e0a969d27216625ac4b8b835a3e7e0cfceaaee2c6ae86bb889291b"
   *    valueHex: "0x3cfc3a1edbf691316fec9b75970fbfb2b0e8d8edfc6ec7628db77c4969403074cfee7c08a98f4b565d124c7e4e28acc52e1bc780e3887db00000004f000000006a686a676a67686a68676a6866676a"
   * }
   *
   * CALL EXAMPLE:
   *  https://relay.iden3.io/claim/0xbee7ee4ef39560cee65d8198539563938c05b7b2
   *
   * RESPONSE EXAMPLE:
   *  {"proofOfClaim":
   *    {
   *      "ClaimProof":
   *       {
   *         "Leaf":"0x3cfc3a1edbf691316fec9b75970fbfb2b0e8d8edfc6ec7628db77c4969403074cfee7c08a98f4b565d124c7e4e28acc52e1bc780e3887db00000004a0000000066646766736467667367",
   *         "Proof":"0x0000000000000000000000000000000000000000000000000000000000000017b4581e31d96945d1e81305e585c1fcfe2ac135ca5689910bfa44bc4d697d1c815f401cfb85d145e0a97daaa3e0cba0a0417d65ede5cd5e5512bce3638989cfaad52075a05d01397038919ef6b419595908da21c4fbdcd493a6d0bd0d48e952829d5ccd8b8c47867d162e7b60f4d608d8f5210e145867a09c5590ece57cd65e15",
   *         "Root":"0x6b67a87e2cb328d87a056276b0762cd2c2a827bf10d69ae4bbd77e42357a4e90"
   *       },
   *      "SetRootClaimProof":
   *       {
   *         "Leaf":"0x3cfc3a1edbf691316fec9b75970fbfb2b0e8d8edfc6ec7628db77c49694030749b9a76a0132a0814192c05c9321efc30c7286f6187f18fc60000005400000008bee7ee4ef39560cee65d8198539563938c05b7b26b67a87e2cb328d87a056276b0762cd2c2a827bf10d69ae4bbd77e42357a4e90",
   *         "Proof":"0x00000000000000000000000000000000000000000000000000000000000010ff0acc62bd133c8bd60dac8e7313502dfd8f5f8a701cf4614587fba5cbae8f8da141c1a052a70b283ed5920484bc5f60632dce222569c61ed3948d9cf4b62d11a4ab3c64efde13bd1f66211abedcd229ba76690f4ec8e4586f10db2422d42740e837aeb38bf3416f6c41c4e260d9b7c7646c85a2c78ceaf46d301760405514713ebfd343266125311e64037be47e8b928a2dd5bc6207fdf925fc158d1116bd99b48e42e502b25e3adcccf429210c9e82a9edabcd191c4fd8f9f8ea5692705ef54439e580e6663cab1cc0e40d2b33a37e56484b02a9cd3195b6843f2da4d17df05af55c73db1adffd813138f31d6524a07011477b8a08b5bbd9622241906e1816295987fa76474271e74b5505f265517f3c3f2a754542fe16cefa47cd4d9c6f057f",
   *         "Root":"0x42e51c699a185d99d6c63a92603d194cad1ecaa2ef956b25ee78e064f5a953fe"
   *       },
   *     "ClaimNonRevocationProof":
   *       {
   *         "Leaf":"0x3cfc3a1edbf691316fec9b75970fbfb2b0e8d8edfc6ec7628db77c4969403074cfee7c08a98f4b565d124c7e4e28acc52e1bc780e3887db00000004a0000000166646766736467667367",
   *         "Proof":"0x0000000000000000000000000000000000000000000000000000000000000017745631317b3a2eb53095e22094e5a015d734378b2e3ba873fcffa0a863f31d265cd6d363ac9c2b39abcb3129e2bde22ddde65d205d5e8b596bd89a4894b00b9cceb0b93917f7475bfb53130be0de95034efb548254abb32825e6d212969a796e095e7ce05bffde7958754e98709f14f60f58fbf74195e6a4b24a4dd05a1173a7",
   *         "Root":"0x6b67a87e2cb328d87a056276b0762cd2c2a827bf10d69ae4bbd77e42357a4e90"
   *       },
   *      "SetRootClaimNonRevocationProof":
   *        {
   *         "Leaf":"0x3cfc3a1edbf691316fec9b75970fbfb2b0e8d8edfc6ec7628db77c49694030749b9a76a0132a0814192c05c9321efc30c7286f6187f18fc60000005400000009bee7ee4ef39560cee65d8198539563938c05b7b26b67a87e2cb328d87a056276b0762cd2c2a827bf10d69ae4bbd77e42357a4e90",
   *         "Proof":"0x0000000000000000000000000000000000000000000000000000000000000aff832b2410f152813b697bf4b54af2638330672bbb8492dcfbb1ac8ec44de1a6fb9105450a527f5993b993ff4b07c991b1515f856c06ebe9b9e67f38f890d0c857260798d9a519c0bd72f3f3994322dc7316ac5e72e43cd56cce4dba30f7fb07057ff82a4ca783539127bc9bf3bcd9ef2a7028dfcf41f4e8c9dccf5094bdf5c76a30f136e63106ec0d3b6149059612e472e4f9497a04c46a99ef6c28add4f10e7c467debd0f70d9c68e8dd92af1ec4f79f4355442989e8ed1bf5aeb849493e2ab502b8c0486963740fd69cb0fc62858d11d6c9873a6452b02411059288f78c00e80b38dce0173f272ab6804b8d2d95d7a55bc2a9619967e7f03dc8f437e74a3ed4c0ac324a4c76564541394f834fe0121f025d3f46eb727dd82238c084d148ace8046f543973738771ae4d1618e9e344061a87fc1a90800bef97a14ae255640c99",
   *         "Root":"0x42e51c699a185d99d6c63a92603d194cad1ecaa2ef956b25ee78e064f5a953fe"
   *         },
   *      "Date":1542645342,
   *      "Signature":"0xa546aa2e830d821386ed501175d078be1bd6875466cd3f71bc9a3c1c7a8d6fc752374f2867d2fcd54a0d7fc9d2d2e6b55d00de36e9401be9d7784ff45d03d09c01"
   *   }
   * }
   *
   * @param {Object} id - iden3 Id object
   * @param {Object} keysContainer - Keys container
   * @param {string} operationalKey - To sign the operation
   * @param {string} relayDomain - To create the claim (i.e. 'iden3.io')
   * @param {string} claimData - Of the created generic data
   * @returns {*}
   */
  createGenericClaim(id, keysContainer, operationalKey, relayDomain, claimData) {
    return id.genericClaim(
      keysContainer,
      operationalKey,
      relayDomain,
      'default',
      claimData,
      '',
    );
  },

  /**
   * Create an identity, creating the keys that are stored in the local storage
   * by the iden3 library. Then set the relay, and finally call the Relay
   * set to create the identity (the promise returned).
   * So this is an AJAX call to the Relay.
   *
   * @param {Object} id - with new identity values
   * @returns {Promise<any>} Return a Promise with the field "address" that contains
   * the address of the counterfactual contract of the new identity
   */
  createIdentity(id) {
    return id.createID();
  },

  /**
   * Create the identity in the storage selected.
   *
   * @param {Object} data - with the data of the identity
   * @param {string} storage - where to store this information
   * @returns {Object} - Populated if was successfully created, empty otherwise
   */
  createIdentityInStorage(data, storage = APP_SETTINGS.LOCAL_STORAGE) {
    // TODO: Move this , call it from action or the parent function straight forward to the helper
    if (storage === APP_SETTINGS.LOCAL_STORAGE) {
      return identitiesHelper.createIdentityInStorage(data);
    }
    return {};
  },

  /**
   * Just a function to do a generic AJAX call.
   *
   * @param {function} callBack - That contains the async call
   * @param {Object | Array } args - Something that we need to destructure
   * @param {Object} bindObject - The object to bind in the call if needed
   * @returns {*}
   */
  genericCall(callBack, args, bindObject = undefined) {
    return callBack.call(bindObject, ...args);
  },

  /* getPinnedClaims() {
    const claim = new Claim();
    const pinnedClaims = claim.getPinnedClaimsFromStorage();

    return pinnedClaims || new ImmutableMap({});
  },

  updatePinnedClaims(allClaims, pinnedClaimsMap, idToUpdate) {
    let newPinnedMap;
    const claim = new Claim();
    const keys = pinnedClaimsMap.keySeq().toArray();
    if (keys.indexOf(idToUpdate) !== -1) {
      // id exists, remove it (has been unpinned)
      newPinnedMap = pinnedClaimsMap.delete(idToUpdate);
    } else { // add it to the end because has been pinned
      const _claim = allClaims.get(idToUpdate);
      _claim.isPinned = !_claim.isPinned;
      claim.updateClaimInStorage(allClaims.get(idToUpdate).id, _claim)
      newPinnedMap = pinnedClaimsMap.set(idToUpdate, _claim);
    }

    return claim.setPinnedClaimsInStorage(newPinnedMap.toJS())
      ? Promise.resolve(newPinnedMap)
      : Promise.reject(new Error('Could not store the pinned claims in the storage'));
  }, */

  /**
   * Update an identity in the storage and if we are changing the label,
   * send to relay to Vinculate the identity address to this new label.
   *
   * @param {Object} identity - The identity to update
   * @param {Object} data - With the identity's data to update
   * @param {string } passphrase - The passphrase to unlock for 30 seconds the key container
   * @param {string } storage - The storage in which should be updated
   * @returns {Object} - With the identity object with new data and the data received from the Relay
   */
  updateIdentity(identity, data, passphrase, storage = APP_SETTINGS.LOCAL_STORAGE) {
    // TODO: Move this to identitiesHelper and only leave here the call to the Relay
    let identityUpdated = Object.assign({}, identity, data);

    if (storage === APP_SETTINGS.LOCAL_STORAGE) {
      // if label changed, we need to bind it to the identity and call the Relay
      if (data.hasOwnProperty('label') || data.hasOwnProperty('name')) {
        identityUpdated = this.bindIdToUsername(identity, data, passphrase);
      }
      // dataUpdated should contain (if we called the Relay) this fields:
      // ethId, name and signature
      const storedIdentity = identitiesHelper.updateIdentity(identity, identityUpdated);
      return Promise.resolve(storedIdentity);
    }
    return Promise.reject(new Error('Not storage found when update identity'));
  },

  /**
   * Update the counter of the identities in the current storage.
   *
   * @param {boolean} isToAdd - True for adding, false for subtract
   * @param {string} storage - The storage in which should be updated
   * @returns {boolean} - True if successful, false otherwise
   */
  updateIdentitiesNumber(isToAdd, storage = APP_SETTINGS.LOCAL_STORAGE) {
    if (storage === APP_SETTINGS.LOCAL_STORAGE) {
      return identitiesHelper.updateIdentitiesNumber(isToAdd);
    }
    return false;
  },
};

export default API;
