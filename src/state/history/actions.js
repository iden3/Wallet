import {
  FETCHING_HISTORY,
  FETCHING_HISTORY_SUCCESS,
  FETCHING_HISTORY_ERROR,
} from './constants';


function fetchingHistory() {
  return {
    type: FETCHING_HISTORY,
  };
}

function fetchingHistorySuccess(response) {
  return {
    type: FETCHING_HISTORY_SUCCESS,
    response,
  };
}

function fetchingHistoryError(error) {
  console.log(error);
  return {
    type: FETCHING_HISTORY_ERROR,
    error: 'Fetching history error',
  };
}

export default function handleFetchingHistory() {
  return function (dispatch) {
    dispatch(fetchingHistory());
    return Promise.resolve()
      .then(({ data }) => {
        dispatch(fetchingHistorySuccess({
          history: data,
        }));
      })
      .catch(error => dispatch(fetchingHistoryError(error)));
  };
}
