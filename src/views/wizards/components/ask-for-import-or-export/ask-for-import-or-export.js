import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  IMPORT,
  EXPORT,
} from 'constants/app';
import {
  FORWARD,
} from 'constants/wizard';
import {
  Button, Icon,
} from 'base_components';

import './ask-for-import-or-export.scss';

class AskForImportOrExport extends PureComponent {
  static propTypes = {
    /**
     * Callback that controls the movement to next step
     */
    move: PropTypes.func.isRequired,
    /**
     * Set action to import or export
     */
    setAction: PropTypes.func.isRequired,
    /*
     To disable or not the export button
     */
    isFirstIdentity: PropTypes.bool.isRequired,
  };

  move = (action) => {
    this.props.setAction(action);
    this.props.move(FORWARD);
  };

  render() {
    return (
      <div>
        <div className="i3-ww-import-export__export">
          <p className="i3-ww-subtitle">
            Backup all your data
          </p>
          <p>
            A encrypted file will be saved to your device.
          </p>
          <Button
            onClick={() => this.move(EXPORT)}
            type="primary"
            disabled={this.props.isFirstIdentity}
            htmlType="button">
            <Icon type="upload" />
            Export
          </Button>
        </div>
        <div className="i3-ww-import-export__separator" />
        <div className="i3-ww-import-export__import">
          <p className="i3-ww-subtitle">
            Import your backup
          </p>
          <p>
            Import your data from a previous backup file done in a wallet.
            <br />
            Keep in mind that all your current data will removed and replaced by the backup.
          </p>
          <Button
            onClick={() => this.move(IMPORT)}
            type="primary"
            htmlType="button">
            Import
            <Icon type="download" />
          </Button>
        </div>
      </div>
    );
  }
}

export default AskForImportOrExport;
