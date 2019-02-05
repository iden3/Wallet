import { Map as ImmutableMap } from 'immutable';

export const getIdentitiesState = (state) => {
  return state.identities;
};
export const getIdentitiesFetching = state => getIdentitiesState(state).get('isFetching');
export const getIdentitiesError = state => getIdentitiesState(state).get('error');
export const getIdentity = (state, address) => getIdentitiesState(state).get('identities').get(address);
export const getCurrentIdentity = (state) => {
  const idDefaultAddr = getIdentitiesState(state).get('currentIdentity');
  if (idDefaultAddr) {
    const idDefault = getIdentity(state, idDefaultAddr).toJS();
    return new ImmutableMap(idDefault) || new ImmutableMap({});
  }
  return new ImmutableMap({});
};
export const getIdentitiesNumber = state => getIdentitiesState(state).get('identities').size || 0;
export const getIdentities = state => getIdentitiesState(state).get('identities');
export const getNeedsToSaveMasterKey = state => getIdentitiesState(state).get('needsToSaveMasterKey') || false;
