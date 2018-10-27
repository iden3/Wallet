import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  withClaims,
} from 'hocs';
import {
  Tabs,
  Widget,
} from 'base_components';
import * as CLAIMS from 'constants/claim';
import { capitalizeFirstLetter } from 'helpers/utils';
import List from '../components/list';

import './claims.scss';

/**
 * Main Claims view showing the list of them and actions to manage them
 */
class Claims extends Component {
  static propTypes = {
    /*
     Selector to get the list of claims.
     Expect the type of the claims as parameter
    */
    getClaims: PropTypes.func.isRequired,
  };

  /**
   * Togle whether a claim is pinned or not in the app state.
   *
   * @param {} id - Claim id
   */
  togglePinned = (id) => {
    // TODO set in the state app
    console.log(`----> toggle Claim: ${id}`);
  };

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
    const tabs = this._getTabs();

    return (
      <div className="i3-ww-claims">
        <Widget
          isFetching={false}
          hasError={false}
          hasData
          title="Claims">
          <Tabs tabs={tabs} />
        </Widget>
      </div>
    );
  }
}

export default compose(withClaims)(Claims);
