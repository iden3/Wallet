import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';

import './header-with-logo.scss';

/**
 * Render a header before the nav-bar with an image of
 * the project. Also enable if clicking on the image
 * go to the dashboard.
 */
class HeaderWithLogo extends PureComponent {
  static propTypes = {
    // If we enable the link to go to the dashboard
    enableLink: PropTypes.bool.isRequired,
    // React-routed-dome location to see if we are in the dashboard, don't push again in the history
    // the same location
    location: PropTypes.object.isRequired,
  };

  render() {
    const header = <div className="i3-ww-header-logo" />;
    const content = this.props.enableLink
      ? (
        <Link
          replace={this.props.location && ROUTES.DASHBOARD.MAIN === this.props.location.pathname}
          to={ROUTES.DASHBOARD.MAIN}>
          {header}
        </Link>
      )
      : header;

    return (content);
  }
}

export default HeaderWithLogo;
