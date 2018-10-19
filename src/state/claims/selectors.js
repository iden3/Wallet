export const getClaimsState = state => state.claims;
export const getClaimsFetching = state => getClaimsState(state).get('isFetchingClaims');
export const getClaimsError = state => getClaimsState(state).get('error');
export const getClaim = (state, claimId) => getClaimsState(state).get('identities').get(claimId);
