import React from 'react';
import { compose } from 'redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import {
  Content,
  Footer,
  Header,
  Layout as LayoutCmpt,
} from 'base_components';
import {
  Claims,
  Dashboard,
  History,
  Identities,
  NavBar,
} from 'views';
import * as ROUTES from 'constants/routes';

import './layout.scss';

/**
 * Main layout of the app. Routes are set up here.
 */
class Layout extends React.Component {
  render() {
    return (
      <LayoutCmpt className="i3-ww-layout">
        <Header className="i3-ww-header">
          <NavBar />
        </Header>
        <Content className="i3-ww-content">
          <div>
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
          </div>
        </Content>
        <Footer className="i3-ww-footer">
          Footer
        </Footer>
      </LayoutCmpt>
    );
  }
}

export default compose(
  withRouter,
)(Layout);