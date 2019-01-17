import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as BOX_CONSTANTS from 'constants/box';
import { Box } from 'base_components';
import {
  Welcome,
  ShowSeed,
  AskForSeed,
  ShowQR,
} from '../components';

class SaveSeedWizard extends Component {
  state = {
    boxContent: null,
  }

  /**
   * Show or not the box with the confirmation for deleting the identities.
   */
  toggleBox = (content) => {
    this.setState(prevState => ({ boxContent: prevState.boxContent ? null : content }));
  }

  render() {
    const wizardContent = this._getBoxContent();

    return (
      <div>
        <Box
          type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
          side={BOX_CONSTANTS.SIDE.RIGHT}
          onClose={this.toggleBox}
          content={wizardContent}
          title={utils.capitalizeFirstLetter(this.state.boxContent)}
          show={!!this.state.boxContent} />
      </div>
    );
  }
}

export default SaveSeedWizard;
