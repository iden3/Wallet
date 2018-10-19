import {
  Map as ImmutableMap,
} from 'immutable';
import * as FORMS from 'constants/forms';
import {
  FETCHING_FORMS,
  FETCHING_FORMS_ERROR,
  FETCHING_FORMS_SUCCESS, UPDATE_IDENTITY_NAME_FORM,
  UPDATE_PASSPHRASE_FORM,
} from './constants';

const initialState = new ImmutableMap({
  error: '',
  isFetching: true,
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
        forms: state.get('forms').set(FORMS.PASSPHRASE, action.data),
      });
    }
    case UPDATE_IDENTITY_NAME_FORM: {
      return state.merge({
        isFetching: false,
        forms: state.get('forms').set(FORMS.IDENTITY_NAME, action.data.get(FORMS.IDENTITY_NAME)),
      });
    }
    default:
      return state;
  }
}

export default forms;
