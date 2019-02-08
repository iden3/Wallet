import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Icon,
} from 'base_components';
import * as BOX_CONSTANTS from 'constants/box';
import { ImportExportDataWizard } from 'views';
import { utils } from 'helpers';

import './welcome-new-identity.scss';

/**
 * View of the first screen to guide the user
 * who is going to create a new identity. It shows an explaining text and a button to
 * move forward.
 * If we are in the case of the first identity of the wallet, also
 * will show some links such as "Import backup"
 */
class WelcomeNewIdentity extends PureComponent {
  static propTypes = {
    /*
      Call back triggered when one of the action buttons are pressed
     */
    move: PropTypes.func,
    /*
     Flag to know if it's first identity, to show one text or other
    */
    isFirstIdentity: PropTypes.bool.isRequired,
  };

  state = {
    isMyDataBoxVisible: false,
  };

  /**
   * Show or not the box with the confirmation for deleting the identities.
   */
  toggleImportBackupBox = () => {
    this.setState(prevState => ({ isMyDataBoxVisible: !prevState.isMyDataBoxVisible }));
  };

  render() {
    return (
      <div>
        <div>
          <p>
            The next steps will guide you through your active identity creation process.
            { this.props.isFirstIdentity && 'You will also be able to create more identities later.' }
            {' '}
            Keep in mind that your private key will be encrypted and stored in this device.
          </p>
        </div>
        <div className="i3-ww-ci__buttons">
          <Button
            onClick={() => this.props.move()}
            type="primary"
            htmlType="button">
            Create my identity
            <Icon type="right" />
          </Button>
        </div>
        {this.props.isFirstIdentity
          && (
            <div>
              <div>
                <div
                  onClick={() => this.toggleImportBackupBox()}
                  role="button"
                  tabIndex="0"
                  onKeyUp={() => this.toggleImportBackupBox()}
                  className="i3-ww-fake-link">
                  Import my wallet backup
                </div>
                <Box
                  type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
                  side={BOX_CONSTANTS.SIDE.RIGHT}
                  onClose={this.toggleImportBackupBox}
                  content={(<ImportExportDataWizard toggleVisibility={this.toggleImportBackupBox} />)}
                  title={utils.capitalizeFirstLetter('Import wallet backup')}
                  show={this.state.isMyDataBoxVisible}
                  fullScreen />
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default WelcomeNewIdentity;
