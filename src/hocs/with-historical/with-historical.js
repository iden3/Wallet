import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import historical from 'state/historical';

const {
  actions: {
    handleFetchingHistorical,
  },
  selectors: {
    getHistoricalFetching,
    getHistoricalError,
    getHistorical,
  },
} = historical;

function withHistorical(HistoricalComponent) {
  class HistoricalWrapper extends Component {
    static propTypes = {
      /*
       Flag to check if the app is fetching the historical
       */
      isFetchingHistorical: PropTypes.bool.isRequired,
      /*
       If there is any error when retrieve identities
       */
      historicalError: PropTypes.string.isRequired,
      /*
       Call back to retrieve all the records of the historical of an identity
       */
      getHistorical: PropTypes.func.isRequired,
    };

    render() {
      return (
        <HistoricalComponent {...this.props} />
      );
    }
  }

  function mapStateToProps(state) {
    return {
      isFetchingHistorical: getHistoricalFetching(state),
      historicalError: getHistoricalError(state),
      getHistorical: identityAddr => getHistorical(state, identityAddr),
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        handleFetchingHistorical,
      }, dispatch,
    );
  }

  return connect(mapStateToProps, mapDispatchToProps)(HistoricalWrapper);
}

export default withHistorical;
