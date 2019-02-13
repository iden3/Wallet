import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import {
  List as ListCmpt,
  Scrollable,
} from 'base_components';
import { utils } from 'helpers';
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
    /*
     Call back when another identity is selected to load it in the app
    */
    onChangeCurrentIdentity: PropTypes.func.isRequired,
    currentIdentity: PropTypes.instanceOf(ImmutableMap),
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

    Object.keys(identitiesList).forEach((identity, index) => {
      identities.push(
        <Identity
          order={index}
          onChangeCurrentIdentity={this.props.onChangeCurrentIdentity}
          key={`identity-${identitiesList[identity].address}`}
          address={identitiesList[identity].address}
          isCurrent={this.props.currentIdentity.get('address') === identitiesList[identity].address}
          id={identitiesList[identity].address}
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
        case 'address':
          finalKey = 'Address:';
          finalValue = identity[key];
          break;
        case 'relayURL':
          finalKey = 'Relay:';
          finalValue = utils.getHostnameFromUrl(identity.relayURL);
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
        <Fragment key={`content-${identity.address}-${finalKey}`}>
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
