import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import claims from 'state/claims';

const {
  actions: {
    handleCreateClaim,
    handleAuthorizeClaim,
    handleSetClaimsFromStorage,
    handleCreateGenericClaim,
    // handleUpdatePinnedClaims,
  },
  selectors: {
    getClaimsError,
    getClaimsFetching,
    getClaims,
    // getPinnedClaims,
  },
} = claims;

function withClaims(ClaimsComponent) {
  class ClaimsWrapper extends Component {
    static propTypes = {
      /*
       Action creator to crate a claim
       */
      handleCreateClaim: PropTypes.func.isRequired,
      /*
       Action authorize a claim received
       */
      handleAuthorizeClaim: PropTypes.func.isRequired,
      /*
       Action to retrieve all claims from storage (for set the later in the app state)
       */
      handleSetClaimsFromStorage: PropTypes.func.isRequired,
      /*
       Handle to create a claim
       */
      handleCreateGenericClaim: PropTypes.func.isRequired,
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
       List of the pinned pins to the dashboard
       */
      // pinnedClaims: PropTypes.instanceOf(ImmutableMap).isRequired,
      /*
       Flag to check if the app is fetching the claims
       */
      isFetchingClaims: PropTypes.bool.isRequired,
      /*
       Flag indicating any error when retrieve claims
       */
      claimsError: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ClaimsComponent {...this.props} />
      );
    }
  }

  function mapStateToProps(state) {
    return {
      isFetchingClaims: getClaimsFetching(state),
      claimsError: getClaimsError(state),
      getClaims: type => getClaims(state, type),
      // pinnedClaims: getPinnedClaims(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      handleCreateClaim,
      handleAuthorizeClaim,
      handleSetClaimsFromStorage,
      handleCreateGenericClaim,
      // handleUpdatePinnedClaims,
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(ClaimsWrapper);
}

export default withClaims;
