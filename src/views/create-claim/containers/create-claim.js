import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import { notificationsHelper } from 'helpers';
import { Box } from 'base_components';
import {
  withClaims,
  withIdentities,
} from 'hocs';
import * as BOX_CONSTANTS from 'constants/box';
import * as CLAIMS_CONSTANTS from 'constants/claim';
import { TYPE as NOTIFICATIONS } from 'constants/notifications';
import { GenericClaim } from '../components';

/**
 * Render in a box the content to create a claim.
 * Also send to the children component the proper action creators
 * to create one or other claim. Basically, this is a factory class.
 */
class CreateClaim extends Component {
  static propTypes = {
    // type of the claim, should be in the constants claims types
    type: PropTypes.string,
    /*
     If this form is visible or not, because is placed in a Box
     */
    isVisible: PropTypes.bool,
    /*
     Call back from parent if we need to do anything when change the visibility of the box
     */
    onClose: PropTypes.func,
    //
    // from withClaims HoC
    //
    /*
     Handle to create a generic claim
     */
    handleCreateGenericClaim: PropTypes.func.isRequired,
    //
    // from withIdentities HoC
    //
    /*
     Selector to get the current loaded identity information
     */
    currentIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
  };

  static defaultProps = {
    type: CLAIMS_CONSTANTS.TYPE.BASIC.NAME,
    isVisible: false,
  };

  /**
   * Factory to trigger an action or other depending on the type
   * of the claim to create.
   */
  createClaim = (data) => {
    let createClaimCB;

    switch (this.props.type) {
      case CLAIMS_CONSTANTS.TYPE.BASIC.NAME:
        createClaimCB = this.props.handleCreateGenericClaim;
        break;
      default:
        createClaimCB = this.props.handleCreateGenericClaim;
    }

    createClaimCB(this.props.currentIdentity, data)
      .then(() => {
        this.props.onClose();
        notificationsHelper.showNotification({
          type: NOTIFICATIONS.SUCCESS,
          description: 'Claim created',
        });
      })
      .catch(error => notificationsHelper.showNotification({
        type: NOTIFICATIONS.ERROR,
        description: `There was an error creating the claim:\n ${error}`,
      }));
  };

  /**
   * Get the content to render depending on the type of claim.
   *
   * @returns {Object} React element
   * @private
   */
  _getContent() {
    switch (this.props.type) {
      case CLAIMS_CONSTANTS.TYPE.BASIC.NAME:
        return <GenericClaim handleCreateGenericClaim={this.createClaim} />;
      default:
        return <GenericClaim handleCreateGenericClaim={this.createClaim} />;
    }
  }

  render() {
    const createClaimContent = this._getContent();

    return (
      <Box
        type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
        side={BOX_CONSTANTS.SIDE.RIGHT}
        onClose={this.props.onClose}
        content={createClaimContent}
        title={`Create a ${this.props.type} claim`}
        show={this.props.isVisible} />
    );
  }
}

export default compose(
  withClaims,
  withIdentities,
)(CreateClaim);
