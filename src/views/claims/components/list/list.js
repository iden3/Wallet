import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import {
  List as ListCmpt,
  Scrollable,
} from 'base_components';
import * as CLAIM from 'constants/claim';
import * as APP_SETTINGS from 'constants/app';
import Claim from '../claim-row';

import './list.scss';

const claimTypes = [CLAIM.TYPE.RECEIVED.NAME, CLAIM.TYPE.EMITTED.NAME, CLAIM.TYPE.GROUPED.NAME, 'all'];

/**
 * Creates a scrollable list to show the claims (that can be received, emitted or grouped)
 */
class List extends PureComponent {
  static propTypes = {
    /*
     Type of the list of claims, to show one info or other
     */
    type: PropTypes.oneOf(claimTypes).isRequired,
    /*
     Call back to execute when the claim is pinned or unpinned
     */
    togglePinned: PropTypes.func.isRequired,
    /*
     Lit of the claims to list
     */
    list: PropTypes.instanceOf(ImmutableMap),
  };

  /**
   * Generates each row of a claim with the information needed.
   * Depending on the type (emitted, received or grouped) some props or others are sent.
   *
   * @returns {array} of React elements with a Claim row
   * @private
   */
  _getClaimsList() {
    const claimsList = this.props.list.toJS();
    const claims = Object.keys(claimsList).map((claim) => {
      // common props to the three types of claims: emitted, received or grouped
      const claimProps = {
        date: claimsList[claim].date,
        isPinned: claimsList[claim].isPinned || false,
        id: claimsList[claim].id,
        togglePinned: this.props.togglePinned,
        data: this._getClaimScrollableData(claimsList[claim]),
      };

      return this._getRow(claimsList[claim], claimProps);
    });

    return (<ListCmpt rows={claims} />);
  }

  /**
   * Compose a row with the claim information to populate the claims list.
   *
   * @param {Object} claim - With the claim information
   * @param {Object} claimProps - With the props to send to the row
   * @private
   */
  _getRow(claim, claimProps) {
    let content;
    let groups = [];
    const key = `claim-${claimProps.id}`;

    switch (this.props.type) {
      case CLAIM.TYPE.RECEIVED.NAME:
        content = claim.introducedContent
          ? claim.introducedContent
          : `Issued by ${claim.issuer || claim.url || 'Unknown identity'}`;
        break;
      case CLAIM.TYPE.EMITTED.NAME:
        content = claim.introducedContent
          ? claim.introducedContent
          : 'Issued to iden3.io';
        break;
      case CLAIM.TYPE.GROUPED.NAME:
        if (claim.groups.length > 0) {
          content = `Grouped in ${claim.groups.join(', ') || 'It is not in any group'}`;
          groups = claim.groups || [];
        }
        break;
      case 'all': // for the pinned list
        content = `Issued to ${claim.to || APP_SETTINGS.DEFAULT_RELAY_DOMAIN}`;
        break;
      default:
        throw new Error('No claim type allowed');
    }

    return (
      <Claim
        key={key}
        content={content}
        groups={groups}
        {...claimProps} />
    );
  }

  /**
   * Set the information that will show as extra data of the row (in an scrollable).
   *
   * @param {Object} claim - With its data
   * @returns {Element} React element to render
   * @private
   */
  _getClaimScrollableData(claim) {
    return (
      (
        <Fragment key={`claim-${claim.id}-data`}>
          <div>
            <span className="" style={{ fontWeight: 'bold', display: 'block' }}>
              { claim.type === CLAIM.TYPE.EMITTED.NAME ? 'To:' : 'From:' }
            </span>
            <span>
              {claim.url
                ? `${claim.url} on ${claim.date} at ${claim.time}`
                : `On ${claim.date} at ${claim.time}`}
            </span>
          </div>
          <br />
          <div>
            <span className="" style={{ fontWeight: 'bold', display: 'block' }}>
              { claim.url ? 'Authorized claim data:' : 'Claim data' }
            </span>
            <span>
              {claim.data}
            </span>
          </div>
          <br />
          {
            claim.proof
            && (
            <div className="i3-ww-claims-list__scrollable-proofs">
              <span className="" style={{ fontWeight: 'bold', display: 'block' }}>
              Claim proof:
              </span>
              <span>
                <p>
                  <span className="" style={{ fontWeight: 'bold', display: 'block' }}>
                  Root:
                  </span>
                  <span>
                    {claim.proof.Root}
                  </span>
                </p>
                <p>
                  <span className="" style={{ fontWeight: 'bold', display: 'block' }}>
                  Leaf:
                  </span>
                  <span>
                    {claim.proof.Leaf}
                  </span>
                </p>
                <p>
                  <span className="" style={{ fontWeight: 'bold', display: 'block' }}>
                  Proof:
                  </span>
                  <span>
                    {claim.proof.Proof}
                  </span>
                </p>
              </span>
            </div>
            )
          }
        </Fragment>)
    );
  }

  render() {
    const claimsList = this.props.list.size > 0
      ? this._getClaimsList()
      : <div>No claims neither over here or over there</div>;

    return (
      <div className="i3-ww-claims-list">
        <Scrollable
          fetchMore={() => {}}>
          {claimsList}
        </Scrollable>
      </div>
    );
  }
}

export default List;
