import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import authorizations from 'state/authorizations';

const {
  actions: {
    handleCAppSignIn,
  },
  selectors: {
    getAuthorizationsFetching,
    getAuthorizations,
  },
} = authorizations;

function withAuthorizations(AuthComponent) {
  class AuthorizationWrapper extends Component {
    static propTypes = {
      /*
        Flag to check if is doing an authorization
      */
      isFetchingAuthorization: PropTypes.bool.isRequired,
      /*
        Centralized application login
      */
      handleCAppSignIn: PropTypes.func.isRequired,
      /*
       List of the authorizations
       */
      list: PropTypes.instanceOf(ImmutableMap).isRequired,
    };

    render() {
      return (
        <AuthComponent {...this.props} />
      );
    }
  }

  function mapStateToProps(state) {
    return {
      isFetchingAuthorization: getAuthorizationsFetching(state),
      list: getAuthorizations(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      handleCAppSignIn,
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(AuthorizationWrapper);
}

export default withAuthorizations;
