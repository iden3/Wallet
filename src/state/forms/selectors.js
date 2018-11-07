export const getFormsState = state => state.forms;
export const getForm = (state, form) => getFormsState(state).get('forms').get(form);
export const getFormsFetching = state => getFormsState(state).get('isFetching');
export const getFormsError = state => getFormsState(state).get('error');
