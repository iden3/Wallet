import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  Icon,
  Menu,
  MenuItem,
} from 'base_components';
import { MobileMenu } from '..';
import {
  CAMERA,
  NOTIFICATIONS,
} from 'constants/icons';
import { ClaimReader } from 'views';

import './buttons-bar.scss';

/**
 * Class that creates the buttons to show in the main nav bar.
 * In this case it's shown the cam and notifications button.
 * Also the burger icon for the menu to change the view if we
 * are in a size of tablet or phone.
 */
class ButtonsBar extends PureComponent {
  static propTypes = {
    addCamButton: PropTypes.bool,
    addNotificationsButton: PropTypes.bool,
    mobileMenuItems: PropTypes.arrayOf(PropTypes.node),
    isDesktopVisible: PropTypes.bool,
  };

  static defaultProps = {
    addCamButton: false,
    addNotificationsButton: false,
    isDesktopVisible: false,
  };

  state = {
    isCameraVisible: false,
  };

  /**
   * Update the state to show or not the box with the camera.
   * This callback is called from the camera button.
   */
  toggleCameraVisibility = () => {
    this.setState(
      prevState => ({ isCameraVisible: !prevState.isCameraVisible }),
    );
  };

  render() {
    return (
      <Fragment>
        <div className="i3-ww-nav-bar__buttons">
          { this.props.addCamButton && (
            <Menu
              mode="horizontal"
              onClick={this.toggleCameraVisibility}
              selectedKeys={[this.state.isCameraVisible ? 'cameraButton' : '']}>
              <MenuItem key="cameraButton">
                <Icon type={CAMERA} theme="filled" />
              </MenuItem>
            </Menu>
          )}
          { this.props.addNotificationsButton && (
            <Menu
              selectedKeys={[this.props.isDesktopVisible ? 'notificationsButton' : '']}
              mode="horizontal">
              <MenuItem key="notificationsButton">
                <Badge count={0}>
                  <Icon type={NOTIFICATIONS} />
                </Badge>
              </MenuItem>
            </Menu>
          )}
          <MobileMenu items={this.props.mobileMenuItems} />
        </div>
        {/* Box to show camera for reading QR */}
        { this.props.addCamButton && (
          <ClaimReader
            isCameraVisible={this.state.isCameraVisible}
            toggleCameraVisibility={this.toggleCameraVisibility} />
        )}
      </Fragment>
    );
  }
}

export default ButtonsBar;
