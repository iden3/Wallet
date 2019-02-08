import { API } from 'helpers';
import iden3 from '@iden3/iden3';
import DALFactory from 'dal';
import * as APP_SETTINGS from 'constants/app';


const authorization = (function authorizationHelper() {
  async function cAppSignIn(identity, passphrase, signatureRequest) {
    // create expiration time to send to the centralized app call back
    const date = new Date();
    const unixTime = Math.round((date).getTime() / 1000);
    const expirationTime = unixTime + (3600 * 60);
    const DAL = new DALFactory(APP_SETTINGS.LOCAL_STORAGE);
    const keysContainer = new iden3.KeyContainer(DAL.storageName, new iden3.Db());
    try {
      keysContainer.unlock(passphrase);

      const signedPacket = iden3.protocols.login.signIdenAssertV01(
        signatureRequest,
        identity.get('address'),
        identity.get('label'),
        identity.get('proofOfEthLabel'),
        keysContainer,
        identity.get('keys').operational,
        identity.get('proofOfKSign'),
        expirationTime,
      );

      if (!signedPacket) {
        return Promise.reject(new Error('The packet read could not have been signed'));
      }

      const signInResponse = await API.cAppSignIn(signatureRequest.url, signedPacket);
      return signInResponse.status === 200
        ? Promise.resolve()
        : Promise.reject(new Error(`Sorry, there was a problem with the ${signatureRequest.body.data.origin} sign in`));
    } catch {
      return Promise.reject(new Error('Mmmm.... Have you written your passphrase right?'));
    }
  }

  return {
    cAppSignIn,
  };
}());

export default authorization;
