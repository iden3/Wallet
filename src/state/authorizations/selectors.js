export const getAuthorizationsState = state => state.authorizations;
export const getAuthorizationsFetching = state => getAuthorizationsState(state).get('isFetching');
export const getAuthorizations = state => getAuthorizationsState(state).get('actions');
