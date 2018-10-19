import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';
import {
  FETCHING_HISTORY,
  FETCHING_HISTORY_ERROR,
  FETCHING_HISTORY_SUCCESS,
} from './constants';

const initialState = new ImmutableMap({
  error: '',
  isFetching: true,
  history: ImmutableList(),
});

function history(state = initialState, action) {
  switch (action.type) {
    case FETCHING_HISTORY:
      return state.merge({
        isFetching: true,
      });
    case FETCHING_HISTORY_ERROR:
      return state.merge({
        isFetching: false,
        history: action.data,
      });
    case FETCHING_HISTORY_SUCCESS:
      return state.merge({
        isFetching: false,
        error: action.error,
      });
    default:
      return state;
  }
}

export default history;
