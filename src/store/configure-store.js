import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from 'state/reducers';

export default function configureStore(initialState = {}) {
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk)),
  );
  // to query state in the console
  window.appState = store.getState();

  if (module.hot) {
    const nextReducer = require('state/reducers');
    module.hot.accept('state/reducers', () => {
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
