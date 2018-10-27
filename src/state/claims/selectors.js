import * as CLAIMS from 'constants/claim';

export const getClaimsState = state => state.claims;
export const getClaimsFetching = state => getClaimsState(state).get('isFetchingClaims');
export const getClaimsError = state => getClaimsState(state).get('error');
export const getClaims = (state, type = CLAIMS.TYPE.EMITTED.NAME) => {
  const list = getClaimsState(state).get(type);
  return list;
};
