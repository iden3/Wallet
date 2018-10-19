import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import identities from 'state/identities';

const {
  actions: {
    handleCreateIdentity,
    handleSetIdentitiesFromStorage,
    handleUpdateIdentitiesNumber,
    handleUpdateIdentity,
  },
  selectors: {
    getIdentitiesError,
    getIdentitiesFetching,
    getIdentity,
    getDefaultIdentity,
  },
} = identities;

function withIdentities(IdentitiesComponent) {
  class IdentitiesWrapper extends Component {
    static propTypes = {
      /*
       Action creator to update the identities
       */
      handleCreateIdentity: PropTypes.func.isRequired,
      /*
       Action to add o subtract an identity when created or deleted
       */
      handleUpdateIdentitiesNumber: PropTypes.func.isRequired,
      /*
       Action to set in the app state the identities from the app state first time app is loaded
       */
      handleSetIdentitiesFromStorage: PropTypes.func.isRequired,
      /*
       Selector to get the information related to an identity.
       Expect the identity address as parameter
       */
      getIdentity: PropTypes.func.isRequired,
      /*
       Selector to get the current loaded identity information
       */
      defaultIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
      /*
       Flag to check if the app is fetching the identities
       */
      isFetchingIdentities: PropTypes.bool.isRequired,
      /*
       Flag indicating any error when retrieve identities
       */
      identitiesError: PropTypes.string.isRequired,
    };

    render() {
      return (
        <IdentitiesComponent {...this.props} />
      );
    }
  }

  function mapStateToProps(state) {
    return {
      isFetchingIdentities: getIdentitiesFetching(state),
      identitiesError: getIdentitiesError(state),
      getIdentity: idAddr => getIdentity(state, idAddr),
      defaultIdentity: getDefaultIdentity(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      handleUpdateIdentity,
      handleCreateIdentity,
      handleUpdateIdentitiesNumber,
      handleSetIdentitiesFromStorage,
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(IdentitiesWrapper);
}

export default withIdentities;
