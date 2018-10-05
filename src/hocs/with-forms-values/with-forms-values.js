import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import forms from 'state/forms';

const {
  actions: {
    handleFetchingForms,
    handleUpdatePassphrase,
  },
  selectors: {
    getForm,
    getFormsError,
    getFormsFetching,
  },
} = forms;

/**
 * HOC to compose with the values the application forms
 * getForm is the important selector here to retrieve the value
 * of a form in particular
 * @param {element} FormComponent - Original component to compose
 * @returns {element} FormsValuesWrapped - Composed component
 */
function withFormsValuesWrapper(FormComponent) {
  class FormsValuesWrapped extends Component {
    static propTypes = {
      /*
       Fetch the forms values stores at the app state
       */
      handleFetchingForms: PropTypes.func.isRequired,
      /*
       Action to update passphrase when new identity is created
       */
      handleUpdatePassphrase: PropTypes.func.isRequired,
      /*
       If fetching data about the value of the forms
     */
      isFetchingForms: PropTypes.bool.isRequired,
      /*
       If there is an error fetching value
       */
      fetchingFormsError: PropTypes.string.isRequired,
      /*
        The value of the required form to get values
       */
      getForm: PropTypes.func.isRequired,
    };

    render() {
      return (<FormComponent {...this.props} />);
    }
  }

  function mapStateToProps(state) {
    return {
      isFetchingForms: getFormsFetching(state),
      fetchingFormsError: getFormsError(state),
      getForm: form => getForm(state, form),
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      handleFetchingForms,
      handleUpdatePassphrase,
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(FormsValuesWrapped);
}

export default withFormsValuesWrapper;
