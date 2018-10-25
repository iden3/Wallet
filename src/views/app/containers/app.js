import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  Switch,
  Route,
  withRouter,
  Redirect,
} from 'react-router-dom';
import {
  Layout,
} from 'views';
import LocalStorage from 'helpers/local-storage';
import { withIdentities } from 'hocs';
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
  withIdentities,
)(App);
