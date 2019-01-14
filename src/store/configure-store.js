import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from 'state/reducers';

// TODO: Try to load save state to local Storage
// the problem is that we are using immutable
// and it's not serializable. Change it to don't use immutable
// or use a library like transit-immutable (warning: could be expensive operation!)

/* const dal = new DAL(APP_SETTINGS.LOCAL_STORAGE);

// helpers to persist state in the local storage
const loadState = () => {
  try {
    const serializedState = dal.getItem('state');
    if (!serializedState) return undefined;
    return serializedState;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    return dal.setItem('state', state);
  } catch (err) {
    return undefined;
  }
}; */

export default function configureStore(initialState = {}) {
  // const persistedState = loadState();
  const store = createStore(
    rootReducer,
    initialState,
    // persistedState, // in the local storage
    composeWithDevTools(applyMiddleware(thunk)),
  );
  // to query state in the console
  window.appState = store.getState();

  // save in the local storage any change in the app state
  // ensure that is not called more than once each second (is expensive write in the local storage)
  /* store.subscribe(utils.throttle(200, () => {
    saveState(store.getState());
  })); */

  /* store.subscribe(() => {
    saveState(store.getState());
  }); */

  if (module.hot) {
    const nextReducer = require('state/reducers');
    module.hot.accept('state/reducers', () => {
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
