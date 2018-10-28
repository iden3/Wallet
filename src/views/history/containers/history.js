import React, { Component } from 'react';
import { Widget } from 'base_components';

import './history.scss';

/**
 * Main view of the historical actions made by user in this device
 */
class History extends Component {
  render() {
    return (
      <div className="i3-ww-history">
        <Widget
          isFetching={false}
          hasError={false}
          hasData
          title="History">
          <div>
            There is nothing in your history yet... Or maybe yes.
            Oh, wait! This section is under construction.
            Come back soon to check what you do with your identity ;)
          </div>
        </Widget>
      </div>
    );
  }
}

export default History;
