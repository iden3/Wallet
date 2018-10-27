import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import { format } from 'date-fns';
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
    /*
     Selector to get the current loaded identity information
     */
    defaultIdentity: PropTypes.instanceOf(ImmutableMap).isRequired,
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

    this.props.list.forEach((identity) => {
      identities.push(
        <Identity
          id={identity.get('idAddr')}
          content={identity.get('label')}
          data={this._setExtraData(identity)} />,
      );
    });

    return (<ListCmpt rows={identities} />);
  }

  /**
   * Data to show when a row show the collapsible content.
   *
   * @returns {array} of React nodes
   * @private
   */
  _setExtraData(identity) {
    const data = [];

    identity.forEach((value, key) => {
      if (key !== 'keys' && key !== 'id') {
        const _value = key === 'date'
          ? format(value, 'd/MMM/yyyy')
          : key === 'relay'
            ? value.get('url')
            : value;
        data.push(
          <Fragment>
            <span style={{ fontWeight: 'bold', display: 'block' }}>
              {key}
            </span>
            <span>
              {_value}
            </span>
          </Fragment>,
        );
      }
    });

    return data;
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
