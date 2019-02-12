import React, { Component } from 'react';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Icon,
  Widget,
} from 'base_components';
import { Claims } from 'views';
import { withClaims } from 'hocs';
import * as ROUTES from 'constants/routes';

import './dashboard.scss';

/**
 * Main view of the app. We will show a widget with pending actions and
 * the pinned claims to show by the user
 */
class Dashboard extends Component {
  render() {
    const headerButtons = (
      <Link to={ROUTES.CLAIMS.MAIN}>
        All claims
        {' '}
        <Icon type="right" />
      </Link>
    );

    return (
      <div className="i3-ww-dashboard">
        <Widget
          isFetching={false}
          hasError={false}
          hasData
          title="Pending actions">
          <div className="i3-ww-dashboard__notifications">
              Zero!!! Cero!!! Zéro!!! ноль!!!
            <br />
              You are a hero, you are up to date!
          </div>
        </Widget>
        <Widget
          isFetching={false}
          hasError={false}
          hasData
          title="My claims"
          headerButtons={headerButtons}>
          <Claims isPinnedList />
        </Widget>
      </div>
    );
  }
}

export default compose(withClaims)(Dashboard);
