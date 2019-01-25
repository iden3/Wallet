import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  Switch,
  Route,
  withRouter,
  Redirect,
} from 'react-router-dom';
import { Map as ImmutableMap } from 'immutable';
import classNames from 'classnames';
import {
  withClaims,
  withIdentities,
} from 'hocs';
import {
  Content,
  Header,
  Layout as LayoutCmpt,
} from 'base_components';
import {
  Claims,
  Dashboard,
  Historical,
  Identities,
  NavBar,
  CreateIdentityWizard,
} from 'views';
import * as ROUTES from 'constants/routes';
import { notificationsHelper } from 'helpers';
import { TYPE as NOTIFICATIONS } from 'constants/notifications';
import {
  HeaderWithLogo,
  Footer,
} from '../components';

import './layout.scss';

/**
 * Main layout of the app. Routes are set up here.
 * If there is no identity, all requests are redirected to the Create identity view
 * to create a new one
 */
class Layout extends React.Component {
  static propTypes = {
    //
    // from react-router-dom
    //
    location: PropTypes.object.isRequired,
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
    /*
     Flag to check is master seed has been saved
    */
    needsToSaveMasterKey: PropTypes.bool.isRequired,
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
  constructor(props) {
    super(props);
    this.props.handleSetIdentitiesFromStorage()
      .then(() => this.props.currentIdentity.size === 1
                  && this.props.handleSetClaimsFromStorage(this.props.currentIdentity));
  }

  /**
  * If we are in the Dashboard (we have at least one identity) call to the method
  * to show a warning to the user to save the master seed (if not saved before)
  */
  componentDidUpdate() {
    this.props.currentIdentity.size > 0 && this._getSaveSeedNotification();
  }

  /**
  * Create a notification node with a warning message to save the seed by the user.
  * This notification is always shown unless the user click on it to go to the wizard to save the seed.
  *
  * @returns {Node} React element with the notification.
  */
  _getSaveSeedNotification() {
    const notificationEl = document.getElementsByClassName('i3-ww-save-seed__notification')[0];

    if (this.props.needsToSaveMasterKey) {
      !notificationEl
      && notificationsHelper.showNotification({
        type: NOTIFICATIONS.WARNING,
        message: 'WARNING: Save your private key!',
        description: 'Please, click here to proceed. Otherwise, you won\'t be able to do any transaction',
        duration: 0,
        placement: 'topLeft',
        className: 'i3-ww-save-seed__notification',
      });
    } else {
      // if exists notification, remove it because master seed has been already saved
      notificationEl && notificationEl.remove(notificationEl);
    }
  }

  render() {
    const usersExist = this.props.currentIdentity.size > 0;

    return (
      <LayoutCmpt className="i3-ww-layout">
        <Header className={classNames({
          'i3-ww-header': true,
          'i3-ww-header__no-nav-bar': !usersExist,
        })}>
          <HeaderWithLogo
            location={this.props.location}
            enableLink={usersExist} />
          { usersExist && <NavBar /> }
        </Header>
        <Content className="i3-ww-content">
          {/* If exists an identity we use the regular routes
              to access to any of the views. Otherwise, all requests
              are redirect to the Create identity view wizard to create an identity */}
          { usersExist
            ? (
              <Switch>
                <Route
                  path={ROUTES.DASHBOARD.MAIN}
                  component={Dashboard} />
                <Route
                  path={ROUTES.CLAIMS.MAIN}
                  component={Claims} />
                <Route
                  path={ROUTES.HISTORICAL.MAIN}
                  component={Historical} />
                <Route
                  path={ROUTES.IDENTITIES.MAIN}
                  component={Identities} />
              </Switch>
            )
            : (
              <Switch>
                <Route path="/:tab" component={CreateIdentityWizard} />
                <Redirect from="/" to={ROUTES.CREATE_IDENTITY.MAIN} />
              </Switch>
            )
          }
          <Footer />
          <div className="i3-ww-save-seed-notification" />
        </Content>
      </LayoutCmpt>
    );
  }
}

export default compose(
  withRouter,
  withIdentities,
  withClaims,
)(Layout);
