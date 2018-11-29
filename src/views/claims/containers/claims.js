import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Map as ImmutableMap } from 'immutable';
import {
  withIdentities,
  withClaims
} from 'hocs';
import { CreateClaim } from 'views';
import {
  Button,
  Tabs,
  Widget,
} from 'base_components';
import * as CLAIMS from 'constants/claim';
import { utils } from 'helpers';
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
    //
    //
    //
    /*
     Selector to get the current loaded identity information
     */
    currentIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
  };

  static defaultProps = {
    isPinnedList: false,
  };

  state = {
    isCreateClaimFormVisible: false,
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
      prevState => ({
        isCreateClaimFormVisible: !prevState.isCreateClaimFormVisible,
      }),
    );
  };

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
   * Compose the tabs to show and the drop-down to choose the sort option.
   *
   * @returns {array} or React Elements with the tabs and the drop-down to sort
   * @private
   * TODO: Add dropdown to sort by an option
   */
  _getTabs() {
    const received = {
      type: CLAIMS.TYPE.RECEIVED.NAME,
      list: this.props.getClaims(CLAIMS.TYPE.RECEIVED.NAME, this.props.currentIdentity.get('address')),
    };
    const emitted = {
      type: CLAIMS.TYPE.EMITTED.NAME,
      list: this.props.getClaims(CLAIMS.TYPE.EMITTED.NAME, this.props.currentIdentity.get('address')),
    };
    const grouped = {
      type: CLAIMS.TYPE.GROUPED.NAME,
      list: this.props.getClaims(CLAIMS.TYPE.GROUPED.NAME, this.props.currentIdentity.get('address')),
    };

    return [emitted, received, grouped].map((claimsList) => {
      return {
        title: utils.capitalizeFirstLetter(claimsList.type),
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
    if (this.props.currentIdentity) {
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
    } else {
      content = (<div />);
    }

    return (
      <div className="i3-ww-claims">
        {content}
        <div>
          {/* Box to show a form to create a claim */}
          <CreateClaim
            onClose={this.toggleCreateClaimForm}
            isVisible={this.state.isCreateClaimFormVisible} />
        </div>
      </div>
    );
  }
}

export default compose(
  withIdentities,
  withClaims,
)(Claims);
