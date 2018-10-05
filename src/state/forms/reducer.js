import {
  Map as ImmutableMap,
} from 'immutable';
import {
  FETCHING_FORMS,
  FETCHING_FORMS_ERROR,
  FETCHING_FORMS_SUCCESS,
  UPDATE_PASSPHRASE_FORM,
} from './constants';

const initialState = new ImmutableMap({
  error: '',
  isFetching: true,
  forms: ImmutableMap({
    passphrase: ImmutableMap({
      first: '',
      second: '',
    }),
  }),
});

function history(state = initialState, action) {
  switch (action.type) {
    case FETCHING_FORMS:
      return state.merge({
        isFetching: true,
      });
    case FETCHING_FORMS_ERROR:
      return state.merge({
        isFetching: false,
        forms: action.data,
      });
    case FETCHING_FORMS_SUCCESS:
      return state.merge({
        isFetching: false,
        forms: ImmutableMap(),
        error: action.error,
      });
    case UPDATE_PASSPHRASE_FORM: {
      return state.merge({
        isFetching: false,
        forms: state.get('forms').set('passphrase', action.data),
      });
    }
    default:
      return state;
  }
}

export default history;
