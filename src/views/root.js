import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import configureStore from 'store/configure-store';
import App from 'views/app';

/**
 * Root class of the application in which we create the store of the app and the main routing system
 */
class Root extends Component {
  render() {
    return (
      <Provider store={configureStore({})}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    );
  }
}

export default hot(module)(Root);
