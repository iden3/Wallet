import React, { Component } from 'react';
import { compose } from 'redux';
import {
  Switch,
  Route,
  withRouter,
  Redirect,
} from 'react-router-dom';
import { Layout } from 'views';
import * as ROUTES from 'constants/routes';

import './app.scss';

/**
 * This is a root platform component that loads the configuration and renders
 * the Layout that contains all the routes. Thanks to nesting all the routes
 * under this component, we have the tab params available in the child components.
 */
class App extends Component {
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
)(App);
