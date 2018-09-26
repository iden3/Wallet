import React, { Component } from 'react';
import { compose } from 'redux';
import {
  Switch, Route, withRouter, Redirect,
} from 'react-router-dom';
import Layout from 'views/layout';
import CreateIdentity from 'views/create-identity';
import LocalStorage from 'helpers/local-storage';
import * as ROUTES from 'constants/routes';

/**
 * This is a root platform component that loads the configuration and renders
 * the Layout that contains all the routes. Thanks to nesting all the routes
 * under this component, we have the tab params available in the child components.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this._localStorage = new LocalStorage('iden3');
  }

  /**
   * Check if at current application there is an identity.
   * If yes, we will show the dashboard. If not,
   * screens for create a new identity are shown
   * @returns {boolean} true if already exists an identity
   */
  checkIdentityExistence = () => {
    return !!this._localStorage.domain;
  };

  render() {
    const showCreateIdentityWizard = this.checkIdentityExistence();
    const LayoutCmpt = (props) => {
      return (
        <Layout
          showNavBar={showCreateIdentityWizard}
          {...props} />);
    };

    return (
      <div className="i3-ww-app">
        <div className="i3-ww-popups" />
        <CreateIdentity show={!showCreateIdentityWizard} />
        <Switch>
          <Route path="/:tab" component={LayoutCmpt} />
          <Redirect from="/" to={ROUTES.DASHBOARD.MAIN} />
        </Switch>
      </div>
    );
  }
}

export default compose(
  withRouter,
)(App);
