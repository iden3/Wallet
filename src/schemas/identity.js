/**
 * Model/Schema of an identity entity.
 *
 * @type {{
 * address: string,
 * date: string,
 * domain: string,
 * icon: string,
 * id: any,
 * implementation: string,
 * isCurrent: boolean,
 * keys: {recovery: string, revoke: string, operational: string, container: any},
 * label: string,
 * originalDateTime: {},
 * passphrase: string,
 * relay: any,
 * relayURL: string,
 * time: string }}
 */
const model = {
  address: '',
  date: '',
  domain: '',
  icon: '',
  id: Object.create({}),
  implementation: '',
  isCurrent: false,
  keys: {
    recovery: '',
    revoke: '',
    operational: '',
    profilePath: 0,
    container: Object.create({}),
  },
  label: '',
  proofOfEthLabel: {},
  proofOfKSign: {},
  originalDateTime: {},
  relay: Object.create({}),
  relayURL: '',
  time: '',
};

export default model;
