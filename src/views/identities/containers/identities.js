import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Map as ImmutableMap } from 'immutable';
import { Widget } from 'base_components';
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
  };

  render() {
    return (
      <div className="i3-ww-identities">
        <Widget
          isFetching={false}
          hasError={false}
          hasData
          title="Identities">
          <List
            defaultIdentity={this.props.defaultIdentity}
            togglePinned={this.togglePinned}
            list={this.props.identities} />
        </Widget>
      </div>
    );
  }
}

export default compose(withIdentities)(Identities);
