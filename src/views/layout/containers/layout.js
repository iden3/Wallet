import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import {
  Switch, Route, withRouter, Redirect,
} from 'react-router-dom';
import classNames from 'classnames';
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
  Welcome,
} from 'views';
import * as ROUTES from 'constants/routes';
import {
  Footer,
  HeaderWithLogo,
} from '../components';

import './layout.scss';

/**
 * Main layout of the app. Routes are set up here.
 * If there is no identity, all requests are redirected to the Welcome view
 * to create a new one
 */
class Layout extends React.Component {
  static propTypes = {
    /*
     Flag used to know if we need to show the regular nav-bar (if already exist
     an identity) an redirect to welcome page if it does not exist
     */
    existsIdentity: PropTypes.bool,
  };

  static defaultProps = {
    existsIdentity: true,
  };


  render() {
    const cmptClasses = classNames({
      'i3-ww-header': true,
      'i3-ww-header__no-nav-bar': !this.props.existsIdentity,
    });

    return (
      <LayoutCmpt className="i3-ww-layout">
        <Header className={cmptClasses}>
          <HeaderWithLogo />
          { this.props.existsIdentity && <NavBar /> }
        </Header>
        <Content className="i3-ww-content">
          {/* If exists an identity we use the regular routes
            to access to any of the views. Otherwise, all requests
            are redirect to the Welcome view wizard to create an identity */}
          { this.props.existsIdentity
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
                <Route path="/:tab" component={Welcome} />
                <Redirect from="/" to={ROUTES.WELCOME.MAIN} />
              </Switch>
            )
            }
          <Footer />
        </Content>
      </LayoutCmpt>
    );
  }
}

export default compose(
  withRouter,
)(Layout);
