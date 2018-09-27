import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Menu,
  MenuItem,
} from 'base_components';
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';

import './identity-item.scss';

/**
 * Class that creates the menu item that show
 * an avatar for the current user and their name.
 * TODO: Right now avatar is generic and hardcoded
 */
class IdentityItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
  };

  static defaultProps = {
    title: 'Identity A',
  };

  render() {
    return (
      <div className="i3-ww-nav-bar-identity">
        <Menu mode="horizontal">
          <MenuItem>
            <Link to={ROUTES.IDENTITIES.MAIN} replace>
              <span>
                <Avatar
                  shape="square"
                  size={64}
                  style={{ color: '#f56a00', backgroundColor: 'white' }} />
                {this.props.title}
              </span>
            </Link>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default IdentityItem;
