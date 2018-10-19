import { Map as ImmutableMap } from 'immutable';

export const getIdentitesState = state => state.identities;
export const getIdentitiesFetching = state => getIdentitesState(state).get('isFetching');
export const getIdentitiesError = state => getIdentitesState(state).get('error');
export const getIdentity = (state, idAddr) => getIdentitesState(state).get('identities').get(idAddr);
export const getDefaultIdentity = (state) => {
  const idDefaultAddr = getIdentitesState(state).get('currentIdentity');
  const idDefault = getIdentity(state, idDefaultAddr);
  return idDefault || new ImmutableMap({});
};
