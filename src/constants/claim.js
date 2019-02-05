/**
 * Strictly Claims constants.
 *
 * @type {{
 * ASSIGN_NAME: {NAME: string, ICON: string},
 * BASIC: {NAME: string, ICON: string},
 * AUTHORIZE_K_SIGN_SECP_256_K1: {NAME: string, ICON: string},
 * AUTHORIZE_K_SIGN: {NAME: string, ICON: string},
 * ENTRY: {NAME: string, ICON: string},
 * SET_ROOT_KEY: {NAME: string, ICON: string},
 * EMITTED: {NAME: string, ICON: string},
 * GROUPED: {NAME: string, ICON: string},
 * RECEIVED: {NAME: string, ICON: string},
 * SIGN: {NAME: string, ICON: string}}}
 */
const TYPE = {
  ASSIGN_NAME: {
    NAME: 'assign_name',
    ICON: 'login',
  },
  BASIC: {
    NAME: 'basic',
    ICON: 'check',
  },
  AUTHORIZE_K_SIGN: {
    NAME: 'authorize_k_sign',
    ICON: 'login',
  },
  AUTHORIZE_KSIGN_SECP_256_K1: {
    NAME: 'authorize_k_sign_secp_256_k1',
    ICON: 'login',
  },
  SET_ROOT_KEY: {
    NAME: 'set_root_key',
    ICON: 'login',
  },
  EMITTED: {
    NAME: 'emitted',
    ICON: 'arrow-up',
  },
  GROUPED: {
    NAME: 'grouped',
    ICON: 'gateway',
  },
  RECEIVED: {
    NAME: 'received',
    ICON: 'arrow-down',
  },
  SIGN: {
    NAME: 'sign',
    ICON: 'form',
  },
};

export {
  TYPE,
};
