import { Map as ImmutableMap } from 'immutable';
import * as CLAIMS from 'constants/claim';

export const getClaimsState = state => state.claims;
export const getClaimsFetching = state => getClaimsState(state).get('isFetchingClaims');
export const getClaimsError = state => getClaimsState(state).get('error')().get('message');
export const getClaims = (state, type = CLAIMS.TYPE.EMITTED.NAME, idAddress) => {
  const list = getClaimsState(state).get(type);
  let filteredList = new ImmutableMap({});

  list.entrySeq().forEach((claim) => {
    if (claim[1].get('identity') === idAddress) {
      filteredList = list.set(claim[0], claim[1].toJS());
    }
  });

  return filteredList;
};
/* export const getPinnedClaims = (state) => {
  const pinnedKeys = Object.keys(getClaimsState(state).get('pinned').toJS());
  const pinnedMap = {};

  if (pinnedKeys.length > 0) {
    pinnedKeys.forEach((id) => {
      const claim = getClaimsState(state).get(CLAIMS.TYPE.EMITTED.NAME).get(id)
        || getClaimsState(state).get(CLAIMS.TYPE.RECEIVED.NAME).get(id)
        || getClaimsState(state).get(CLAIMS.TYPE.GROUPED.NAME).get(id);

      if (claim) {
        pinnedMap[id] = claim;
      }
    });
    return new ImmutableMap({ ...pinnedMap });
  }

  return new ImmutableMap({});


}; */
