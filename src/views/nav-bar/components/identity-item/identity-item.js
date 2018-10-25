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
 *
 */
class IdentityItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
  };

  static defaultProps = {
    title: 'Identity A',
  };

  render() {
    // get the first word of the identity name/label
    const title = this.props.title.replace(/ .*/, '');

    console.log(`=====> TITLE: ${this.props.title}`);

    return (
      <div className="i3-ww-nav-bar__identity">
        <Menu mode="horizontal">
          <MenuItem>
            <Link to={ROUTES.IDENTITIES.MAIN} replace>
              <span className="i3-ww-nav-bar--identity-icon-name">
                <Avatar value={this.props.title} />
                <span className="i3-ww-nav-bar--identity-name">
                  {title}
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
