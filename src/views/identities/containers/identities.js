import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Map as ImmutableMap } from 'immutable';
import {
  Box,
  Button,
  Icon,
  Widget,
} from 'base_components';
import * as BOX_CONSTANTS from 'constants/box';
import * as ICONS from 'constants/icons';
import { withIdentities } from 'hocs';
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
    askForDelete: false,
  };

  addIdentity = () => {
    console.log('Add identity');
  }

  /**
   * Call the action to delete all the identities in the app state
   * and in the storage, and redirect to to the wizard to create an identity
   */
  deleteAllIdentities = () => {
    this.toggleAskConfirmation();
    this.state.askForDelete && this.props.handleDeleteAllIdentities();
  };

  deleteIdentity = () => {
    this.toggleAskConfirmation();
  }

  /**
   * Show or not the box with the confirmation for deleting the identities.
   */
  toggleAskConfirmation = () => {
    this.setState(prevState => ({ askForDelete: !prevState.askForDelete }));
  };

  /**
   * The content to show in the confirmation box to delete all de identities.
   * There is a warning text and the button to delete them.
   *
   * @returns {Object} React element with the content to show
   * @private
   */
  _getConfirmationContent() {
    return (
      <div className="i3-ww-identities__delete-confirmation">
        <div className="i3-ww-identities__delete-confirmation-text">
          You are about to delete all the identities of in this application
          and device. This action can not be undone. If you continue, you
          accept that all data stored will deleted.
        </div>
        <div className="i3-ww-identities__delete-confirmation-button">
          <Button
            type="primary"
            htmlType="button"
            onClick={this.deleteAllIdentities}>
            I understand it: Delete them!
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const headerButtons = (
      <div className="i3-ww-widget__action-buttons">
        <Button
          type="primary"
          htmlType="button"
          onClick={this.addIdentity}>
          <Icon type={ICONS.ADD_IDENTITY} />
        </Button>
        <Button
          type="primary"
          htmlType="button"
          onClick={this.toggleAskConfirmation}>
          <Icon type={ICONS.DELETE_ALL_IDENTITIES} />
        </Button>
      </div>
    );
    const confirmationContent = this._getConfirmationContent();

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
        <div>
          <Box
            type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
            side={BOX_CONSTANTS.SIDE.RIGHT}
            onClose={this.toggleAskConfirmation}
            content={confirmationContent}
            title="Delete all the identities"
            show={this.state.askForDelete} />
        </div>
      </div>
    );
  }
}

export default compose(withIdentities)(Identities);
