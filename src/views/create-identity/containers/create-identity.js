import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'base_components';
import * as BOX_CONSTANTS from 'constants/box';

class CreateIdentity extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
  };

  state = {
    show: this.props.show,
  };

  /**
   * Change the visibility of the create identity pop-up in the local state
   */
  toggleVisibility = () => {
    this.setState(prevState => ({ show: !prevState.show }));
  };

  render() {
    const inside = (<div>Create identity</div>);

    return (
      <div className="i3-ww-create-identity">
        <Box
          type={BOX_CONSTANTS.TYPE.SIDE_PANEL}
          onClose={this.toggleVisibility}
          content={inside}
          title="Create identity"
          show={this.state.show} />
      </div>
    );
  }
}

export default CreateIdentity;
