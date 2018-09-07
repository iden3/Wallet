import {
  FETCHING_QR_CODES,
  FETCHING_QR_CODES_SUCCESS,
  FETCHING_QR_CODES_ERROR,
} from './constants';


function fetchingQrCodes() {
  return {
    type: FETCHING_QR_CODES,
  };
}

function fetchingQrCodesSuccess(response) {
  return {
    type: FETCHING_QR_CODES_SUCCESS,
    response,
  };
}

function fetchingQrCodesError(error) {
  console.log(error);
  return {
    type: FETCHING_QR_CODES_ERROR,
    error: 'Fetching qr codes error',
  };
}

export default function handleQRCodesHistory() {
  return function (dispatch) {
    dispatch(fetchingQrCodes());
    return Promise.resolve()
      .then(({ data }) => {
        dispatch(fetchingQrCodesSuccess({
          qrCodes: data,
        }));
      })
      .catch(error => dispatch(fetchingQrCodesError(error)));
  };
}
