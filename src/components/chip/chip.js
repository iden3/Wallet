import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './chip.scss';

/**
* Class that renders a Chip component with a text inside.
*/
class Chip extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    index: PropTypes.string,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    background: PropTypes.string,
  }

  render() {
    return (
      <div>
        <div
          className="i3-ww-chip"
          style={this.props.background ? { background: this.props.background } : {}}
          role="button"
          tabIndex={0}
          onKeyUp={(e) => {
            (e.key === 'Enter' || e.key === ' ') && this.props.onClick(this.props.index);
          }}
          onClick={() => this.props.onClick(this.props.index)}
          key={this.props.index}>
          {this.props.content}
          {this.props.onClose
              && (
                <span
                  role="button"
                  tabIndex={0}
                  onKeyUp={(e) => {
                    (e.key === 'Enter' || e.key === ' ') && this.props.onClose(this.props.index);
                  }}
                  onClick={() => this.props.onClose(this.props.index)}>
                  x
                </span>
              )}
        </div>
      </div>
    );
  }
}

export default Chip;
