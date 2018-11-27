import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  Switch,
  Route,
  withRouter,
  Redirect,
} from 'react-router-dom';
import { Map as ImmutableMap } from 'immutable';
import { Layout } from 'views';
import {
  withClaims,
  withIdentities,
} from 'hocs';
import * as ROUTES from 'constants/routes';

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
    /*
     Selector to get the current loaded identity information
     */
    currentIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
    //
    // From withClaims HoC
    //
    /*
      Action to retrieve all claims from storage (for set the later in the app state)
    */
    handleSetClaimsFromStorage: PropTypes.func.isRequired,
  };

  /**
   * First time app is loaded set in the app state the identities
   * and claims that belong to this identity, that are in the storage.
   */
  componentDidMount() {
    this.props.handleSetIdentitiesFromStorage()
      .then(() => this.props.handleSetClaimsFromStorage(this.props.currentIdentity));
  }

  render() {
    return (
      <div className="i3-ww-app">
        <div className="i3-ww-popups" />
        <Switch>
          <Route exact path="/:tab" component={Layout} />
          <Redirect
            from="/"
            to={ROUTES.DASHBOARD.MAIN} />
        </Switch>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withClaims,
  withIdentities,
)(App);
