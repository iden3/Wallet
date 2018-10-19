import React, { Component, Fragment } from 'react';
import {
  DropDown,
  Tabs,
  Widget,
} from 'base_components';
import * as CLAIM from 'constants/claim';
import { capitalizeFirstLetter } from 'helpers/utils';
import List from '../components/list';

import './claims.scss';

/**
 * Main Claims view showing the list of them and actions to manage them
 */
class Claims extends Component {
  /**
   * Togle whether a claim is pinned or not in the app state
   * @param {number} id - Claim id
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
    // const sortDropDown = (<DropDown title="Sort by" options={['Issuer', 'Date', 'Pinned first', 'Pinned last']} />);

    return [CLAIM.TYPE.RECEIVED, CLAIM.TYPE.EMITTED, CLAIM.TYPE.GROUPED].map((claim) => {
      return {
        title: capitalizeFirstLetter(claim.NAME),
        icon: claim.ICON,
        children: (
          <Fragment>
            {/* <div className="i3-ww-claims__drop-down">
              {sortDropDown}
            </div> */}
            <List
              togglePinned={this.togglePinned}
              type={claim.NAME} />
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

export default Claims;
