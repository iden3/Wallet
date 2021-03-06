import {
  Map as ImmutableMap,
} from 'immutable';
import * as FORMS from 'constants/forms';
import {
  FETCHING_FORMS,
  FETCHING_FORMS_ERROR,
  FETCHING_FORMS_SUCCESS,
  UPDATE_IDENTITY_NAME_FORM,
  UPDATE_PASSPHRASE_FORM,
  UPDATE_SHOW_SEED_FORM,
  CLEAR_CREATE_IDENTITY_FORMS,
  CLEAR_CREATE_IDENTITY_FORMS_SUCCESS,
  CLEAR_CREATE_IDENTITY_FORMS_ERROR,
  CLEAR_SAVE_SEED_FORMS,
  CLEAR_SAVE_SEED_FORMS_SUCCESS,
  CLEAR_SAVE_SEED_FORMS_ERROR,
} from './constants';

const initialState = new ImmutableMap({
  error: '',
  isFetching: true,
  passphrase: '',
  forms: ImmutableMap({
    [FORMS.PASSPHRASE]: ImmutableMap({
      first: '',
      second: '',
    }),
    [FORMS.IDENTITY_NAME]: '',
  }),
});

function forms(state = initialState, action) {
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
        error: action.error,
      });
    case UPDATE_PASSPHRASE_FORM: {
      return state.merge({
        isFetching: false,
        error: '',
        forms: state.get('forms').set(FORMS.PASSPHRASE, action.data),
      });
    }
    case UPDATE_IDENTITY_NAME_FORM: {
      return state.merge({
        isFetching: false,
        error: '',
        forms: state.get('forms').set(FORMS.IDENTITY_NAME, action.data.get(FORMS.IDENTITY_NAME)),
      });
    }
    case UPDATE_SHOW_SEED_FORM: {
      return state.merge({
        isFetching: false,
        error: '',
        forms: state.get('forms').set(FORMS.SHOW_SEED, action.data),
      });
    }
    case CLEAR_CREATE_IDENTITY_FORMS:
      return state.merge({
        isFetching: false,
      });
    case CLEAR_CREATE_IDENTITY_FORMS_SUCCESS:
      return state.merge({
        isFetching: false,
        error: '',
        passphrase: state.get('forms').get(FORMS.PASSPHRASE).get('first'),
        forms: ImmutableMap({
          [FORMS.PASSPHRASE]: ImmutableMap({
            first: '',
            second: '',
          }),
          [FORMS.IDENTITY_NAME]: '',
        }),
      });
    case CLEAR_CREATE_IDENTITY_FORMS_ERROR:
      return state.merge({
        isFetching: false,
        error: action.error,
      });
    case CLEAR_SAVE_SEED_FORMS:
      return state.merge({
        isFetching: true,
      });
    case CLEAR_SAVE_SEED_FORMS_SUCCESS:
      return state.merge({
        isFetching: false,
        error: '',
        passphrase: state.get('forms').get(FORMS.PASSPHRASE).get('first'),
        forms: ImmutableMap({
          [FORMS.PASSPHRASE]: ImmutableMap({
            first: '',
            second: '',
          }),
          [FORMS.SHOW_SEED]: '',
        }),
      });
    case CLEAR_SAVE_SEED_FORMS_ERROR:
      return state.merge({
        isFetching: false,
        error: action.error,
      });
    default:
      return state;
  }
}

export default forms;
