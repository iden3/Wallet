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
import { utils } from 'helpers';
import { withIdentities } from 'hocs';
import {
  CreateIdentity as CreateIdentityWizard,
  DeleteIdentity,
  DeleteAllIdentities,
} from '../components';
import List from '../components/list';


import './identities.scss';

const boxContent = {
  deleteOne: 'delete identity',
  deleteAll: 'delete all identities',
  createIdentity: 'create identity wizard',
};

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
    currentIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
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
  };

  state = {
    boxContent: null,
  };

  /**
   * Show the box when create identity choice has been selected by the user.
   */
  createIdentity = () => {
    this.state.boxContent === boxContent.createIdentity && this.toggleBox();
  };

  /**
   * Call the action to delete all the identities in the app state
   * and in the storage, and redirect to to the wizard to create an identity
   */
  deleteAllIdentities = () => {
    this.toggleBox();
    this.state.boxContent === boxContent.deleteAll && this.props.handleDeleteAllIdentities();
  };

  /**
   * Call the action to remove an identity.
   */
  deleteIdentity = () => {
    this.toggleBox();
    this.state.boxContent === boxContent.deleteOne && this.props.handleDeleteIdentity();
  };

  /**
   * Call back when clicked the button of an identity row to change to this.
   *
   * @param {string} address - new identity address to load
   */
  onChangeCurrentIdentity = (address) => {
    this.props.handleChangeCurrentIdentity(address);
  };

  /**
   * Show or not the box with the confirmation for deleting the identities.
   */
  toggleBox = (content) => {
    this.setState(prevState => ({ boxContent: prevState.boxContent ? null : content }));
  };

  /**
   * Factory function to show one content or other regarding who is calling it.
   * In this view choices are: create an identity, remove one or remove all.
   *
   * @returns {Object} with React element to show
    */
  _getBoxContent() {
    switch (this.state.boxContent) {
      case boxContent.createIdentity:
        return (
          <CreateIdentityWizard
            afterCreateIdentity={this.createIdentity} />
        );
      case boxContent.deleteAll:
        return <DeleteAllIdentities onConfirm={this.deleteAllIdentities} />;
      case boxContent.deleteOne:
        return (
          <DeleteIdentity
            address="0xfefefe5656565"
            label="Label of the id"
            onConfirm={this.deleteIdentity} />
        );
      default:
        return (<div />);
    }
  }

  render() {
    const headerButtons = (
      <div className="i3-ww-widget__action-buttons">
        <Button
          type="primary"
          htmlType="button"
          onClick={() => this.toggleBox(boxContent.createIdentity)}>
          <Icon type={ICONS.ADD_IDENTITY} />
        </Button>
        <Button
          type="primary"
          htmlType="button"
          onClick={() => this.toggleBox(boxContent.deleteAll)}>
          <Icon type={ICONS.DELETE_ALL_IDENTITIES} />
        </Button>
      </div>
    );
    const boxElements = this._getBoxContent();
    const cmptClassName = 'i3-ww-identities';

    return (
      <div className={cmptClassName}>
        <Widget
          isFetching={false}
          hasError={false}
          hasData
          title="Identities"
          headerButtons={headerButtons}>
          <List
            onChangeCurrentIdentity={this.onChangeCurrentIdentity}
            currentIdentity={this.props.currentIdentity}
            togglePinned={this.togglePinned}
            list={this.props.identities} />
        </Widget>
        <div>
          <Box
            type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
            side={BOX_CONSTANTS.SIDE.RIGHT}
            onClose={this.toggleBox}
            content={boxElements}
            title={utils.capitalizeFirstLetter(this.state.boxContent)}
            show={!!this.state.boxContent} />
        </div>
      </div>
    );
  }
}

export default compose(withIdentities)(Identities);
