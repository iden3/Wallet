import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  List as ListCmpt,
  Scrollable,
} from 'base_components';
import * as _claimsList from 'fixtures/fixtures';
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
  };

  /**
   * Generates each row of a claim with the information needed.
   * Depending on the type (emitted, received or grouped) some props or others are sent.
   * @returns {array} of React elements with a Claim row
   * @private
   */
  _getClaimsList() {
    const claims = _claimsList.claims.map((claim) => {
      // common props to the three types of claims: emitted, received or grouped
      const claimProps = {
        date: claim.date,
        isPinned: claim.isPinned,
        id: claim.id,
        togglePinned: this.props.togglePinned,
        key: `claim-${claim.id}`,
      };
      let ClaimCmpt;

      switch (this.props.type) {
        case CLAIM.TYPE.RECEIVED.NAME:
          ClaimCmpt = (
            <Claim
              content={`Issued by ${claim.issuer}`}
              type={CLAIM.TYPE[claim.type.toUpperCase()].ICON}
              {...claimProps} />);
          break;
        case CLAIM.TYPE.EMITTED.NAME:
          ClaimCmpt = (
            <Claim
              content={`Emitted to ${claim.to}`}
              type={CLAIM.TYPE[claim.type.toUpperCase()].ICON}
              {...claimProps} />);
          break;
        case CLAIM.TYPE.GROUPED.NAME:
          ClaimCmpt = claim.groups.length > 0 && (
            <Claim
              content={`Grouped in ${claim.groups.join(', ')}`}
              groups={claim.groups}
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
    const claimsList = this._getClaimsList();

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
