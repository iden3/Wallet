import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Redirect, Switch } from 'react-router-dom';
import { Map as ImmutableMap } from 'immutable';
import {
  Button,
  Widget,
} from 'base_components';
import { withIdentities } from 'hocs';
import * as ROUTES from 'constants/routes';
import List from '../components/list';


import './identities.scss';

/**
 * Main view of the identities management of an user.
 */
class Identities extends Component {
  static propTypes = {
    /*
     Selector to retrieve all the identities
     */
    identities: PropTypes.PropTypes.instanceOf(ImmutableMap).isRequired,
    /*
     Selector to get the current loaded identity information
     */
    defaultIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
    /*
     Action to delete all identities from the app
     */
    handleDeleteAllIdentities: PropTypes.func.isRequired,
  };

  state = {
    redirectToWizard: false,
  };

  /**
   * Call the action to delete all the identities in the app state
   * and in the storage, and redirec to to the wizard to create an identity
   */
  deleteAllIdentities = () => {
    this.props.handleDeleteAllIdentities()
      .then(() => this.setState({ redirectToWizard: true }));
  };

  render() {
    const headerButtons = (
      <Button
        type="primary"
        htmlType="button"
        onClick={this.deleteAllIdentities}>
        Delete all
      </Button>
    );

    return (
      <div className="i3-ww-identities">
        <Widget
          isFetching={false}
          hasError={false}
          hasData
          title="Identities"
          headerButtons={headerButtons}>
          <List
            defaultIdentity={this.props.defaultIdentity}
            togglePinned={this.togglePinned}
            list={this.props.identities} />
        </Widget>
        {
          this.state.redirectToWizard
          && <Redirect to={ROUTES.CREATE_IDENTITY.MAIN} />
        }
      </div>
    );
  }
}

export default compose(withIdentities)(Identities);
