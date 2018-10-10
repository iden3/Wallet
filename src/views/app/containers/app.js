import React, { Component } from 'react';
import { compose } from 'redux';
import {
  Switch, Route, withRouter, Redirect,
} from 'react-router-dom';
import Layout from 'views/layout';
import LocalStorage from 'helpers/local-storage';
import * as ROUTES from 'constants/routes';
import { AppContextProvider } from 'app_context';

import './app.scss';

/**
 * This is a root platform component that loads the configuration and renders
 * the Layout that contains all the routes. Thanks to nesting all the routes
 * under this component, we have the tab params available in the child components.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.localStorage = new LocalStorage('iden3');
  }

  /**
   * Check if at current application there is an identity.
   * If yes, we will show the dashboard. If not,
   * screens for create a new identity are shown
   * @returns {boolean} true if already exists an identity
   */
  checkIdentityExistence = () => {
    if (!this.localStorage.domain || !this.localStorage.doesKeyExist('identity')) {
      this.localStorage = new LocalStorage('iden3');
      return false;
    }

    return true;
  };

  render() {
    const existsIdentity = this.checkIdentityExistence();
    const redirectTo = existsIdentity ? ROUTES.DASHBOARD.MAIN : ROUTES.CREATE_IDENTITY.MAIN;

    return (
      <AppContextProvider value={{ existsIdentity }}>
        <div className="i3-ww-app">
          <div className="i3-ww-popups" />
          <Switch>
            <Route path="/:tab" component={Layout} />
            <Redirect from="/" to={redirectTo} />
          </Switch>
        </div>
      </AppContextProvider>
    );
  }
}

export default compose(
  withRouter,
)(App);
