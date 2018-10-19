import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import claims from 'state/claims';

const {
  actions: {
    handleCreateClaim,
    handleAuthorizeClaim,
  },
  selectors: {
    getClaimsError,
    getClaimsFetching,
    getClaim,
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
       Selector to get the information related to a claim.
       Expect the local id of the claim as parameter
      */
      getClaim: PropTypes.func.isRequired,
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
      getClaim: claimId => getClaim(state, claimId),
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      handleCreateClaim,
      handleAuthorizeClaim,
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(ClaimsWrapper);
}

export default withClaims;
