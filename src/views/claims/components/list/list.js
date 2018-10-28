import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import { format } from 'date-fns';
import {
  List as ListCmpt,
  Scrollable,
} from 'base_components';
import * as CLAIM from 'constants/claim';
import Claim from '../claim-row';

const claimTypes = [CLAIM.TYPE.RECEIVED.NAME, CLAIM.TYPE.EMITTED.NAME, CLAIM.TYPE.GROUPED.NAME];

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
      const formatedDate = format(
        claimsList[claim].date,
        'd/MMM/yyyy',
      );
      const formatedTime = format(
        claimsList[claim].date,
        'hh:mm',
      );
      const claimProps = {
        date: formatedDate,
        isPinned: claimsList[claim].isPinned || false,
        id: claimsList[claim].id,
        togglePinned: this.props.togglePinned,
        key: `claim-${claimsList[claim].id}`,
        data: [(
          <Fragment key={`claim-${claimsList[claim].id}-data`}>
            <div>
              <span className="" style={{ fontWeight: 'bold', display: 'block' }}>
              Created:
              </span>
              <span>
                {formatedDate}
                {' '}
                at
                {' '}
                {formatedTime}
              </span>
            </div>
            <br />
            <div>
              <span className="" style={{ fontWeight: 'bold', display: 'block' }}>
              Proof of claim:
              </span>
              <span>
                {claimsList[claim].data}
              </span>
            </div>

          </Fragment>),
        ],
      };
      let ClaimCmpt;

      switch (this.props.type) {
        case CLAIM.TYPE.RECEIVED.NAME:
          ClaimCmpt = (
            <Claim
              content={`Issued by ${claimsList[claim].issuer || 'Unknown identity'}`}
              {...claimProps} />);
          break;
        case CLAIM.TYPE.EMITTED.NAME:
          ClaimCmpt = (
            <Claim
              content={`Emitted to ${claimsList[claim].to || 'iden3.io'}`}
              {...claimProps} />);
          break;
        case CLAIM.TYPE.GROUPED.NAME:
          ClaimCmpt = claimsList[claim].groups.length > 0 && (
            <Claim
              content={`Grouped in ${claimsList[claim].groups.join(', ') || 'It is not in any group'}`}
              groups={claimsList[claim].groups || []}
              {...claimProps} />);
          break;
        default:
          throw new Error('No claim type allowed');
      }

      return ClaimCmpt;
    });

    return (<ListCmpt rows={claims} />);
  }

  render() {
    const claimsList = this.props.list.size > 0
      ? this._getClaimsList()
      : <div>No claims neither over here or over there</div>;

    return (
      <div>
        <Scrollable
          fetchMore={() => {}}>
          {claimsList}
        </Scrollable>
      </div>
    );
  }
}

export default List;
