//import { checkModel } from 'helpers/utils';

const model = {
  domain: '',
  address: '',
  time: '',
  date: '',
  originalDateTime: {},
  relay: {
    url: '',
  },
  keys: {
    recovery: '',
    revoke: '',
    operational: '',
    container: {
      prefix: '',
      type: '',
      encryptionKey: '',
    },
  },
  label: '',
  icon: '',
  implementation: '',
  seed: [],
};

const parseObject = function (data) {
/*  date: "12/Nov/2018"
  domain: "iden3.io"
  icon: "0deddd00f7c7adc"
  id: Id {keyRecover: "0x4bf833e8bf91abae8c07f6cb89a5af051de028dd", keyRevoke: "0x9144e67c65862c642ac6d9773d23d2af83a5a0d4", keyOperational: "0x550c027c66a16ed37951b19685bd06e841a4367c", relay: Relay, idaddr: "0x85fa65dfe7237cee339038fda4c916d8ebf7b0d2", …}
  idAddr: "0x85fa65dfe7237cee339038fda4c916d8ebf7b0d2"
  keys: {keyRecovery: "0x4bf833e8bf91abae8c07f6cb89a5af051de028dd", keyRevoke: "0x9144e67c65862c642ac6d9773d23d2af83a5a0d4", keyOp: "0x550c027c66a16ed37951b19685bd06e841a4367c", keyContainer: LocalStorageContainer}
  label: "asased"
  relay: Relay {url: "https://relay.iden3.io"}
  time: "12:34"*/

  const parsed = {
    domain: data.domain,
    address: data.idAddr,
    time: data.time,
    date: data.date,
    originalDateTime: {},
    relay: data.relay,
    keys: {
      operational: data.keys.keyOp,
      recovery: data.keys.keyRecovery,
      keyRevoke: data.keys.keyRevoke,
      container: data.keys.keyContainer,
    },
    label: data.label,
    icon: data.icon,
    implementation: data.id.implementation,
    id: Object.getPrototypeOf(data.id),
    seed: data.seed,
  };

/*  return checkModel(model, parsed)
    ? parsed
    : undefined;*/

};

export default parseObject;
