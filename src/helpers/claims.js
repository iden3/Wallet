import iden3 from 'iden3';
import { List as ImmutableList } from 'immutable';
import { getUnixTime } from 'helpers/utils';
import * as APP_SETTINGS from 'constants/app';
import API from 'helpers/api';
import LocalStorage from 'helpers/local-storage';

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
    const keysContainer = new iden3.KeyContainer('localstorage');
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
    this.createAuthorizeKSignClaim(dataToCreateAuth, keysContainer, ko, krec, krev)
      .then((res) => {
        // if (res.states === 200) {
        const dataToSentToSentServer = new ImmutableList([
          JSONdata.url,
          this.identity.get('idAddr'),
          JSONdata.challenge,
          JSONdata.signature,
          KSign,
          res.data.proofOfClaim,
        ]);
        return API.sendClaimToCentralizedServer(dataToSentToSentServer);
        // }
      })
      .catch((error) => { throw new Error(error); });
  };

  createClaimInStorage = (idAddrOwner, claim, claimId, type) => {
    const claimKey = `claim-${claimId}`;
    const claimData = {
      identity: idAddrOwner,
      data: claim,
      date: new Date(),
      type,
    };
    return this.storage.setItem(claimKey, claimData);
  }
}

export default Claim;
