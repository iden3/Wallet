import { Map as ImmutableMap } from 'immutable';

export const getidentitiesState = state => state.identities;
export const getIdentitiesFetching = state => getidentitiesState(state).get('isFetching');
export const getIdentitiesError = state => getidentitiesState(state).get('error');
export const getIdentity = (state, address) => getidentitiesState(state).get('identities').get(address);
export const getDefaultIdentity = (state) => {
  const idDefaultAddr = getidentitiesState(state).get('currentIdentity');
  const idDefault = getIdentity(state, idDefaultAddr);
  return new ImmutableMap(idDefault) || new ImmutableMap({});
};
export const getIdentitiesNumber = state => getidentitiesState(state).get('identities').size || 0;
export const getIdentities = state => getidentitiesState(state).get('identities');
