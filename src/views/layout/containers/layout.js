import React from 'react';
import { compose } from 'redux';
import {
  Switch, Route, withRouter, Redirect,
} from 'react-router-dom';
import classNames from 'classnames';
import { AppContextConsumer } from 'app_context';
import {
  Content,
  Header,
  Layout as LayoutCmpt,
} from 'base_components';
import {
  Claims,
  Dashboard,
  History,
  Identities,
  NavBar,
  CreateIdentity,
} from 'views';
import * as ROUTES from 'constants/routes';
import {
  Footer,
  HeaderWithLogo,
} from '../components';

import './layout.scss';

/**
 * Main layout of the app. Routes are set up here.
 * If there is no identity, all requests are redirected to the Create identity view
 * to create a new one
 */
class Layout extends React.Component {
  render() {
    return (
      <AppContextConsumer>
        { ({ existsIdentity }) => (
          <LayoutCmpt className="i3-ww-layout">
            <Header className={classNames({
              'i3-ww-header': true,
              'i3-ww-header__no-nav-bar': !existsIdentity,
            })}>
              <HeaderWithLogo />
              { existsIdentity && <NavBar /> }
            </Header>
            <Content className="i3-ww-content">
              {/* If exists an identity we use the regular routes
              to access to any of the views. Otherwise, all requests
              are redirect to the Create identity view wizard to create an identity */}
              { existsIdentity
                ? (
                  <Switch>
                    <Route
                      path={ROUTES.DASHBOARD.MAIN}
                      component={Dashboard} />
                    <Route
                      path={ROUTES.CLAIMS.MAIN}
                      component={Claims} />
                    <Route
                      path={ROUTES.HISTORY.MAIN}
                      component={History} />
                    <Route
                      path={ROUTES.IDENTITIES.MAIN}
                      component={Identities} />
                  </Switch>
                )
                : (
                  <Switch>
                    <Route path="/:tab" component={CreateIdentity} />
                    <Redirect from="/" to={ROUTES.CREATE_IDENTITY.MAIN} />
                  </Switch>
                )
              }
              <Footer />
            </Content>
          </LayoutCmpt>
        )}
      </AppContextConsumer>
    );
  }
}

export default compose(
  withRouter,
)(Layout);
