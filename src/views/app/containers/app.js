import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  Switch,
  Route,
  withRouter,
  Redirect,
} from 'react-router-dom';
import Layout from 'views/layout';
import LocalStorage from 'helpers/local-storage';
import { withIdentities } from 'hocs';
// import * as identitiesHelper from 'helpers/identities';
import * as ROUTES from 'constants/routes';
import * as APP_SETTINGS from 'constants/app';
import { AppContextProvider } from 'app_context';

import './app.scss';

/**
 * This is a root platform component that loads the configuration and renders
 * the Layout that contains all the routes. Thanks to nesting all the routes
 * under this component, we have the tab params available in the child components.
 */
class App extends Component {
  static propTypes = {
    //
    // From withIdentities HoC
    //
    /*
     Action to set in the app state the identities from the app state first time app is loaded
     */
    handleSetIdentitiesFromStorage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.localStorage = new LocalStorage('iden3');
  }

  /**
   * First time app is loaded set in the app state the identities
   * that are in the storage.
   */
  componentDidMount() {
    this.props.handleSetIdentitiesFromStorage();
  }

  /**
   * Check if in the current application there is an identity.
   * If yes, we will show the dashboard. If not,
   * screens for create a new identity are shown.
   * @returns {boolean} true if already exists an identity
   */
  checkIdentityExistence = () => {
    let hasIdentities = true;

    if (!this.localStorage.existsKey(APP_SETTINGS.ST_IDENTITIES_NUMBER)) {
      this.localStorage.setItem(APP_SETTINGS.ST_IDENTITIES_NUMBER, 0);
      hasIdentities = false;
    } else if (this.localStorage.getItem(APP_SETTINGS.ST_IDENTITIES_NUMBER) === 0) {
      // exists identities-number in the local storage and is zero
      hasIdentities = false;
    }
    // TODO: We need to check if there are identities in the storage and if yes, check their integrity: well formed, etc...
    /* else {
      // exists identities objects with right information in the storage
      const rightIdentities = identitiesHelper.areIdentitiesConsistent();
      // set the number of right identities in the storage
      this.localStorage.setItem(APP_SETTINGS.ST_IDENTITIES_NUMBER, rightIdentities);
      // update the default identity
      identitiesHelper.updateDefaultId();
      hasIdentities = !!rightIdentities;
    } */

    return hasIdentities;
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
  withIdentities,
)(App);
