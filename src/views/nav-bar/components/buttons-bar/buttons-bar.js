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
import {
  ClaimReader,
  SaveSeedWizard,
} from 'views';

import './buttons-bar.scss';

/**
 * Class that creates the buttons to show in the main nav bar.
 * In this case it's shown the cam and notifications button.
 * Also the burger icon for the menu to change the view if we
 * are in a size of tablet or phone.
 */
class ButtonsBar extends PureComponent {
  static propTypes = {
    /*
     If needed to show a button to show the cam
    */
    addCamButton: PropTypes.bool,
    /*
     If needed to show a button with the notifications
    */
    addNotificationsButton: PropTypes.bool,
    /*
     If needed to show a button to warn users that they need to save the seed / private key
    */
    addSaveSeedNotification: PropTypes.bool,
    /*
     The menu shown in mobile phone size
    */
    mobileMenuItems: PropTypes.arrayOf(PropTypes.node),
    /*
     Just to know if we are in the create identity wizard when we don't have any identity or not
    */
    isDesktopVisible: PropTypes.bool,
  };

  static defaultProps = {
    addCamButton: false,
    addNotificationsButton: false,
    addSaveSeedNotification: false,
    isDesktopVisible: false,
  };

  state = {
    isCameraVisible: false,
    isSaveSeedWizardVisible: false,
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

  /**
  * Update the state to show or not the box with the save seed wizard.
  */
  toggleShowSaveSeedWizard = () => {
    this.setState(
      prevState => ({ isSaveSeedWizardVisible: !prevState.isSaveSeedWizardVisible }),
    );
  }

  render() {
    return (
      <Fragment>
        <div className="i3-ww-nav-bar__buttons">
          {
            this.props.addSaveSeedNotification && (
            <Menu
              mode="horizontal"
              onClick={this.toggleShowSaveSeedWizard}
              selectedKeys={[this.state.isDesktopVisible ? 'saveSeedNotification' : '']}>
              <MenuItem key="saveSeedNotification">
                <div className="i3-ww-blink">
                  <Badge dot>
                    <Icon type="notification" />
                  </Badge>
                </div>
              </MenuItem>
            </Menu>
            )
          }
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
        {/* Box to show wizard to save seed */}
        {
          this.state.isSaveSeedWizardVisible && (
            <SaveSeedWizard
              isVisible={this.state.isSaveSeedWizardVisible}
              toggleVisibility={this.toggleShowSaveSeedWizard} />
          )
        }
      </Fragment>
    );
  }
}

export default ButtonsBar;
