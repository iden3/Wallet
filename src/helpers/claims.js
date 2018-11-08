import iden3 from 'iden3';
import { List as ImmutableList } from 'immutable';
import { format } from 'date-fns';
import { getUnixTime } from 'helpers/utils';
import * as APP_SETTINGS from 'constants/app';
import * as CLAIM from 'constants/claim';
import API from 'helpers/api';
import LocalStorage from 'helpers/local-storage';

/**
 * Class related to everything about claims: authorize, creates, decode what is read from a QR, etc...
 */
class Claim {
  constructor(identity) {
    this.identity = identity;
    this.storage = new LocalStorage(APP_SETTINGS.ST_DOMAIN);
  }

  createAuthorizeKSignClaim = (data, keysContainer, ko, krec, krev) => {
    return API.authorizeKSignClaim(this.identity, data, keysContainer, ko, krec, krev);
  };

  decodeReadedData = (data) => {
    const JSONdata = iden3.auth.parseQRhex(data); // Object {challenge, signature, url}
    const KSign = iden3.utils.addrFromSig(JSONdata.challenge, JSONdata.signature); // string
    const unixTime = getUnixTime(); // number
    const keysContainer = new iden3.KeyContainer(APP_SETTINGS.LOCAL_STORAGE);
    const ko = this.identity.get('keys').get('keyOp');
    const krec = this.identity.get('keys').get('keyRecovery');
    const krev = this.identity.get('keys').get('keyRevoke');
    const dataToCreateAuth = new ImmutableList([
      keysContainer,
      ko,
      APP_SETTINGS.DEFAULT_RELAY_DOMAIN,
      KSign,
      'appToAuthName',
      'authz',
      unixTime,
      unixTime,
    ]);

    keysContainer.unlock('a'); // for 30 seconds available
    return new Promise((resolve, reject) => {
      this.createAuthorizeKSignClaim(dataToCreateAuth, keysContainer, ko, krec, krev)
        .then((res) => {
          // if (res.states === 200) {
          const dataToSentToSenToServer = new ImmutableList([
            JSONdata.url,
            this.identity.get('idAddr'),
            JSONdata.challenge,
            JSONdata.signature,
            KSign,
            res.data.proofOfClaim,
          ]);
          resolve({ proofOfClaim: res.data.proofOfClaim, dataToSentToSenToServer, url: JSONdata.url });
          // }
        })
        .catch((error) => { reject(error); });
    });
  };

  createClaimInStorage = (idAddrOwner, claimData, claimId, proofOfClaim, sourceUrl, type) => {
    const claimKey = `claim-${claimId}`;
    const date = new Date();
    const newClaimData = {
      identity: idAddrOwner,
      introducedContent: !sourceUrl ? claimData : '',
      data: claimData,
      date: format(date, 'd/MMM/yyyy'),
      time: format(date, 'HH:mm'),
      id: claimId,
      proof: proofOfClaim.ClaimProof, // Leaf, Root and Proof
      url: sourceUrl,
      type,
    };

    return this.storage.setItem(claimKey, newClaimData) ? newClaimData : null;
  };

  getAllClaimsFromStorage = () => {
    const claimsInStorage = this.storage.getKeys('claim-');
    const claimsInStorageLength = claimsInStorage.length;
    const claims = {
      [CLAIM.TYPE.EMITTED.NAME]: {},
      [CLAIM.TYPE.RECEIVED.NAME]: {},
      [CLAIM.TYPE.GROUPED.NAME]: {},
    };

    for (let i = 0; i < claimsInStorageLength; i++) {
      const idKey = claimsInStorage[i];
      const claimFromStorage = this.storage.getItem(idKey);
      claims[claimFromStorage.type][claimFromStorage.id] = claimFromStorage;
    }
    return Promise.resolve(claims);
  };

  /*getPinnedClaimsFromStorage = () => {
    return (this.storage.getItem('pinned-claims'));
  };

  setPinnedClaimsInStorage = (list) => {
    return this.storage.setItem('pinned-claims', list);
  }

  updateClaimInStorage = (id, claim) => {
    return this.storage.setItem(`claim-${id}`, claim) ? claim : null;
  }*/
}

export default Claim;
