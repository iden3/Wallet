import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import {
  List as ListCmpt,
  Scrollable,
} from 'base_components';
import Identity from '../identity-row';

/**
 * Creates a scrollable list to show the identities and related information
 */
class List extends PureComponent {
  static propTypes = {
    /*
     Lit of the claims to list
     */
    list: PropTypes.instanceOf(ImmutableMap),
  };

  /**
   * Generates each row of a claim with the information needed.
   * Depending on the type (emitted, received or grouped) some props or others are sent.
   *
   * @returns {Object} - With React list component of identities
   * @private
   */
  _getIdentitiesList() {
    const identities = [];
    const identitiesList = this.props.list.toJS();

    Object.keys(identitiesList).forEach((identity) => {
      identities.push(
        <Identity
          key={`identity-${identitiesList[identity].idAddr}`}
          id={identitiesList[identity].idAddr}
          content={identitiesList[identity].label}
          data={this._setExtraData(identitiesList[identity])} />,
      );
    });

    return (<ListCmpt rows={identities} />);
  }

  /**
   * Data to show when a row show the collapsible content.
   *
   * @parameter {Object} identity- with its data
   * @returns {array} of React nodes
   * @private
   */
  _setExtraData(identity) {
    return Object.keys(identity).map((key) => {
      let finalValue;
      let finalKey;

      switch (key) {
        case 'idAddr':
          finalKey = 'Address:';
          finalValue = identity[key];
          break;
        case 'relay':
          finalKey = 'Relay:';
          finalValue = identity.relay.url;
          break;
        case 'date':
          finalKey = 'Created on:';
          finalValue = `${identity.date} at ${identity.time}`;
          break;
        case 'label':
          finalKey = 'Identity: ';
          finalValue = `${identity.label}@${identity.domain}`;
          break;
        default:
          finalValue = null;
      }

      return finalValue && (
        <Fragment key={`content-${identity.idAddr}-${finalKey}`}>
          <div>
            <span style={{ fontWeight: 'bold', display: 'block' }}>
              {finalKey}
            </span>
            <span>
              {finalValue}
            </span>
          </div>
          <br />
        </Fragment>
      );
    });
  }

  render() {
    const identitiesList = this.props.list.size > 0
      ? this._getIdentitiesList()
      : <div>No identities neither over here or over there</div>;

    return (
      <div>
        <Scrollable
          fetchMore={() => {}}>
          {identitiesList}
        </Scrollable>
      </div>
    );
  }
}

export default List;
