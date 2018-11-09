import {
  FETCHING_HISTORICAL,
  FETCHING_HISTORICAL_SUCCESS,
  FETCHING_HISTORICAL_ERROR,
} from './constants';


function fetchingHistorical() {
  return {
    type: FETCHING_HISTORICAL,
  };
}

function fetchingHistoricalSuccess(data) {
  return {
    type: FETCHING_HISTORICAL_SUCCESS,
    data,
  };
}

function fetchingHistoricalError(error) {
  console.log(error);
  return {
    type: FETCHING_HISTORICAL_ERROR,
    error: 'Fetching historical error',
  };
}

export default function handleFetchingHistorical() {
  return function (dispatch) {
    dispatch(fetchingHistorical());
    return Promise.resolve()
      .then(({ data }) => {
        dispatch(fetchingHistoricalSuccess({
          data,
        }));
      })
      .catch(error => dispatch(fetchingHistoricalError(error)));
  };
}
