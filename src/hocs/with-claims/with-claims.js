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
  },
  selectors: {
    getClaimsError,
    getClaimsFetching,
    getClaims,
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
       Selector to get the list of claims.
       Expect the type of the claims as parameter
      */
      getClaims: PropTypes.func.isRequired,
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
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      handleCreateClaim,
      handleAuthorizeClaim,
      handleSetClaimsFromStorage,
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(ClaimsWrapper);
}

export default withClaims;
