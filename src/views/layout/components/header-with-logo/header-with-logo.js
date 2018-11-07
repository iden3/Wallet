import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';

import './header-with-logo.scss';

class HeaderWithLogo extends PureComponent {
  static propTypes = {
    enableLink: PropTypes.bool.isRequired,
  };

  render() {
    const header = <div className="i3-ww-header-logo" />;
    const content = this.props.enableLink
      ? <Link to={ROUTES.DASHBOARD.MAIN}>{header}</Link>
      : header;

    return (content);
  }
}

export default HeaderWithLogo;
