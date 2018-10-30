import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Map as ImmutableMap } from 'immutable';
import {
  withClaims,
  withIdentities,
} from 'hocs';
import {
  Box,
  Button,
  Tabs,
  TextArea,
  Widget,
} from 'base_components';
import notificationsHelper from 'helpers/notifications';
import * as CLAIMS from 'constants/claim';
import * as BOX_CONSTANTS from 'constants/box';
import { capitalizeFirstLetter } from 'helpers/utils';
import List from '../components/list';

import './claims.scss';

/**
 * Main Claims view showing the list of them and actions to manage them
 */
class Claims extends Component {
  static propTypes = {
    /*
     if is the list of pinned, retrieve only the pinned and with no tabs in the list
     */
    isPinnedList: PropTypes.bool,
    //
    // from withClaims HoC
    //
    /*
     List of the pinned pins to the dashboard
     */
    // pinnedClaims: PropTypes.instanceOf(ImmutableMap),
    /*
     Action to update when a claim is pinned to dashboard or removed from the pinned
     */
    // handleUpdatePinnedClaims: PropTypes.func.isRequired,
    /*
     Selector to get the list of claims.
     Expect the type of the claims as parameter
    */
    getClaims: PropTypes.func.isRequired,
    /*
     Handle to create a claim
     */
    handleCreateDefaultClaim: PropTypes.func.isRequired,
    //
    // from withIdentities HoC
    //
    /*
     Selector to get the current loaded identity information
     */
    defaultIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
  };

  static defaultProps = {
    isPinnedList: false,
  };

  state = {
    inputClaimData: '',
    isCreateClaimFormVisible: false,
  };

  createDefaultClaim = () => {
    this.props.handleCreateDefaultClaim(this.props.defaultIdentity, this.state.inputClaimData)
      .then(() => this.toggleCreateClaimForm())
      .catch(error => notificationsHelper.showNotification('error', {
        message: 'Error',
        description: `We are sorry... There was an error creating the claim:\n ${error}`,
        style: {
          background: '#f95555',
          color: 'white',
        },
      }));
  };

  /**
   * Handle the Input controlled components values when changed. Set the
   * state of each input with current  value.
   *
   * @param {string} value - from the input
   */
  handleInputChange = (value) => {
    this.setState({ inputClaimData: value });
  };

  /**
   * Togle whether a claim is pinned or not in the app state.
   *
   * @param {} id - Claim id
   */
  togglePinned = (id) => {
    // TODO set in the state app
    // this.props.handleUpdatePinnedClaims(this.props.pinnedClaims, id);
  };

  /**
   * Update the state to show or not the box with the camera.
   * This callback is called from the camera button.
   */
  toggleCreateClaimForm = () => {
    this.setState(
      prevState => ({ isCreateClaimFormVisible: !prevState.isCreateClaimFormVisible }),
    );
  };

  _getCreateClaimContent() {
    return (
      <div className="i3-ww-claims__create">
        <div className="i3-ww-claims__create-text">
          Please, insert the content for the new claim:
        </div>
        <div className="i3-ww-claims__create-area-text">
          <TextArea
            value={this.state.inputClaimData}
            placeholder="Content of the the new claim"
            onChange={e => this.handleInputChange(e.target.value)} />
        </div>
        <div className="i3-ww-claims__create-button">
          <Button
            onClick={this.createDefaultClaim}
            type="primary"
            htmlType="button">
            Create claim
          </Button>
        </div>

      </div>
    );
  }

  /**
   * Get the list of the pinned claims.
   *
   * @returns {Element} React list to render or a message pointing that there are not pinned claims
   * @private
   */
  _getPinned() {
    /* return (
      this.props.pinnedClaims.size > 0
        ? (
          <List
            togglePinned={this.togglePinned}
            type="all"
            list={this.props.pinnedClaims} />
        )
        : (
          <div>
          Not pinned claims yet.
            <br />
          Why do not you take a walk on your claims list and pin some?
          </div>
        )
    ); */
    return (
      <div>
      Not pinned claims yet.
        <br />
      Why do not you take a walk on your claims list and pin some?
      </div>
    );
  }

  /**
   * Compose the tabs to show and the drop-down to choose the sort option
   * @returns {array} or React Elements with the tabs and the drop-down to sort
   * @private
   * TODO: Add dropdown to sort by an option
   */
  _getTabs() {
    const received = { type: CLAIMS.TYPE.RECEIVED.NAME, list: this.props.getClaims(CLAIMS.TYPE.RECEIVED.NAME) };
    const emitted = { type: CLAIMS.TYPE.EMITTED.NAME, list: this.props.getClaims(CLAIMS.TYPE.EMITTED.NAME) };
    const grouped = { type: CLAIMS.TYPE.GROUPED.NAME, list: this.props.getClaims(CLAIMS.TYPE.GROUPED.NAME) };

    return [emitted, received, grouped].map((claimsList) => {
      return {
        title: capitalizeFirstLetter(claimsList.type),
        children: (
          <Fragment>
            <List
              togglePinned={this.togglePinned}
              list={claimsList.list}
              type={claimsList.type} />
          </Fragment>),
      };
    });
  }

  render() {
    let content;
    const createClaimContent = this._getCreateClaimContent();

    if (this.props.isPinnedList) {
      content = this._getPinned();
    } else {
      const tabs = this._getTabs();
      const headerButtons = (
        <Button
          type="primary"
          htmlType="button"
          onClick={this.toggleCreateClaimForm}>
          Create
        </Button>
      );
      content = (
        <Widget
          isFetching={false}
          hasError={false}
          hasData
          title="Claims"
          headerButtons={headerButtons}>
          <Tabs tabs={tabs} />
        </Widget>
      );
    }

    return (
      <div className="i3-ww-claims">
        {content}
        <div>
          <Box
            type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
            side={BOX_CONSTANTS.SIDE.RIGHT}
            onClose={this.toggleCreateClaimForm}
            content={createClaimContent}
            title="Create a claim"
            show={this.state.isCreateClaimFormVisible} />
        </div>
      </div>
    );
  }
}

export default compose(
  withClaims,
  withIdentities,
)(Claims);
