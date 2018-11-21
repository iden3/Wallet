import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
} from 'immutable';
import {
  FETCHING_HISTORICAL,
  FETCHING_HISTORICAL_ERROR,
  FETCHING_HISTORICAL_SUCCESS,
} from './constants';

const initialState = new ImmutableMap({
  error: new ImmutableRecord({ message: '' }),
  isFetchingHistorical: true,
  records: ImmutableList(),
});

function historical(state = initialState, action) {
  switch (action.type) {
    case FETCHING_HISTORICAL:
      return state.merge({
        isFetchingHistorical: true,
        error: new ImmutableRecord({ message: '' }),
      });
    case FETCHING_HISTORICAL_ERROR:
      return state.merge({
        isFetchingHistorical: false,
        error: state.get('error').set('message', action.error),
      });
    case FETCHING_HISTORICAL_SUCCESS:
      return state.merge({
        isFetchingHistorical: false,
        error: new ImmutableRecord({ message: '' }),
        records: action.data,
      });
    default:
      return state;
  }
}

export default historical;
