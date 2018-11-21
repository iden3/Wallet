export const getHistoricalState = state => state.historical;
export const getHistoricalFetching = state => getHistoricalState(state).get('isFetchingHistorical');
export const getHistoricalError = state => getHistoricalState(state).get('error')().get('message');
export const getHistorical = (state, identityAddr) => (identityAddr
  ? getHistoricalState(state).get('records')
  : getHistoricalState(state).get('records').get(identityAddr));
