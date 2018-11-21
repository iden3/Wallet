import React, { Component } from 'react';
import { compose } from 'redux';
import { Widget } from 'base_components';
import { withHistorical } from 'hocs';

import './historical.scss';

/**
 * Main view of the historical actions made by user in this device
 */
class Historical extends Component {
  render() {
    return (
      <div className="i3-ww-historical">
        <Widget
          isFetching={false}
          hasError={false}
          hasData
          title="Historical">
          <div>
            There is nothing in your historical yet... Or maybe yes.
            Oh, wait! This section is under construction.
            Come back soon to check what are you doing with your identity ;)
          </div>
        </Widget>
      </div>
    );
  }
}

export default compose(withHistorical)(Historical);
