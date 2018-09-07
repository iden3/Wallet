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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nulla consequat convallis neque id laoreet. Donec pulvinar eleifend commodo.
            Nullam pretium erat sed aliquam pharetra. Praesent ornare consectetur vulputate.
            Donec imperdiet nisi nisi, non fermentum elit dignissim sed.
            Donec pretium ultrices ante eget semper. Phasellus auctor auctor elit eu efficitur.

            Cras tempor dignissim libero vel elementum.
            Pellentesque suscipit, leo id consequat iaculis, elit felis tincidunt diam,
            a vulputate enim mauris quis magna.
            Mauris ac vehicula ligula. Fusce ac lacus aliquam, maximus tellus ut, consequat ligula.
            Integer a massa sit amet neque mattis suscipit sed eget augue.
            Curabitur felis nibh, venenatis vitae ante vitae, porta viverra ligula.
            Sed tempor nisi in nibh varius posuere.
            Phasellus sit amet orci tristique, sollicitudin felis ac, laoreet diam.
            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            Nam blandit dolor id sagittis varius. Proin sed est molestie est convallis vehicula non sit amet nulla.
            Donec nec enim id neque rutrum pharetra. Aliquam eget pretium leo.
            Sed vitae risus egestas, lacinia tellus a, ultricies leo.
            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
          </div>
        </Widget>
      </div>
    );
  }
}

export default History;
