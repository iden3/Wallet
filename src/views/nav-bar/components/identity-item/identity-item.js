import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Menu,
  MenuItem,
} from 'base_components';
import { utils } from 'helpers';
import * as ROUTES from 'constants/routes';

import './identity-item.scss';

/**
 * Class that creates the menu item that show
 * an avatar for the current user and their name.
 *
 */
class IdentityItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
  };

  static defaultProps = {
    title: 'Identity',
    icon: utils.generateHash(),
  };

  render() {
    return (
      <div className="i3-ww-nav-bar__identity">
        <Menu mode="horizontal">
          <MenuItem>
            <Link to={ROUTES.IDENTITIES.MAIN} replace>
              <span className="i3-ww-nav-bar--identity-icon-name">
                <Avatar
                  title={this.props.title}
                  icon={this.props.icon} />
                <span className="i3-ww-nav-bar--identity-name">
                  {this.props.title}
                </span>
              </span>
            </Link>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default IdentityItem;
