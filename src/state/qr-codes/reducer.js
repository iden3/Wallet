import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable';
import {
  FETCHING_QR_CODES,
  FETCHING_QR_CODES_ERROR,
  FETCHING_QR_CODES_SUCCESS,
} from './constants';

const initialState = new ImmutableMap({
  error: '',
  isFetching: true,
  qrCodes: ImmutableList(),
});

function qrCodes(state = initialState, action) {
  switch (action.type) {
    case FETCHING_QR_CODES:
      return state.merge({
        isFetching: true,
      });
    case FETCHING_QR_CODES_ERROR:
      return state.merge({
        isFetching: false,
        qrCodes: action.data,
      });
    case FETCHING_QR_CODES_SUCCESS:
      return state.merge({
        isFetching: false,
        qrCodes: ImmutableList(),
        error: action.error,
      });
    default:
      return state;
  }
}

export default qrCodes;
