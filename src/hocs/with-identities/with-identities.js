import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import identities from 'state/identities';
import {
  identitiesHelper,
} from 'helpers';

const {
  actions: {
    handleCreateIdentity,
    handleSetIdentitiesFromStorage,
    handleUpdateIdentitiesNumber,
    handleUpdateIdentity,
    handleDeleteAllIdentities,
    handleDeleteIdentity,
    handleChangeCurrentIdentity,
    handleSetMasterSeedAsSaved,
  },
  selectors: {
    getIdentitiesError,
    getIdentitiesFetching,
    getIdentity,
    getCurrentIdentity,
    getIdentities,
    getNeedsToSaveMasterKey,
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
       Action to delete all identities from the app
       */
      handleDeleteAllIdentities: PropTypes.func.isRequired,
      /*
        Action to delete one identity
      */
      handleDeleteIdentity: PropTypes.func.isRequired,
      /*
       Action to change the current identity of the app
      */
      handleChangeCurrentIdentity: PropTypes.func.isRequired,
      /*
       Action to change the status if master seed has already been saved by the user
      */
      handleSetMasterSeedAsSaved: PropTypes.func.isRequired,
      /*
       Selector to get the information related to an identity.
       Expect the identity address as parameter
       */
      getIdentity: PropTypes.func.isRequired,
      /*
       Selector to retrieve all the identities
       */
      identities: PropTypes.PropTypes.instanceOf(ImmutableMap).isRequired,
      /*
       Selector to get the current loaded identity information
       */
      currentIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
      /*
       Flag to check if the app is fetching the identities
       */
      isFetchingIdentities: PropTypes.bool.isRequired,
      /*
       If there is any error when retrieve identities
       */
      identitiesError: PropTypes.string.isRequired,
      /*
       Flag to check is master seed has been saved
      */
      needsToSaveMasterKey: PropTypes.bool.isRequired,
    };

    /**
    * Since this is not an action creator that should dispatch to the store,
    * this prop should be placed here. It get the master seed of the wallet.
    *
    * @returns {Promise} with the master seed or and error message otherwise
    */
    handleGetIdentityMasterSeed = (identity, passphrase) => {
      return new Promise((resolve, reject) => {
        const masterSeed = identitiesHelper.getMasterSeed(identity, passphrase);

        return masterSeed ? resolve(masterSeed) : reject(new Error('Could not be decrypted the seed'));
      });
    }

    render() {
      return (
        <IdentitiesComponent {...this.props} handleGetIdentityMasterSeed={this.handleGetIdentityMasterSeed} />
      );
    }
  }

  function mapStateToProps(state) {
    return {
      isFetchingIdentities: getIdentitiesFetching(state),
      identitiesError: getIdentitiesError(state),
      getIdentity: identityAddr => getIdentity(state, identityAddr),
      currentIdentity: getCurrentIdentity(state),
      identities: getIdentities(state),
      needsToSaveMasterKey: getNeedsToSaveMasterKey(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      handleUpdateIdentity,
      handleCreateIdentity,
      handleUpdateIdentitiesNumber,
      handleSetIdentitiesFromStorage,
      handleDeleteAllIdentities,
      handleDeleteIdentity,
      handleChangeCurrentIdentity,
      handleSetMasterSeedAsSaved,
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(IdentitiesWrapper);
}

export default withIdentities;
