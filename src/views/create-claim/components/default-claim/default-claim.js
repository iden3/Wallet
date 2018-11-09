import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextArea,
} from 'base_components';

import './default-claim.scss';

/**
 * View to create a default claim. Has an area text and a button.
 */
class DefaultClaim extends PureComponent {
  static propTypes = {
    /*
     Call back to create a claim
     */
    handleCreateDefaultClaim: PropTypes.func.isRequired,
  };

  state = {
    inputClaimData: '',
  };

  /**
   * Trigger call back from props to create the claim.
   * After create it, clean the input value
   */
  createDefaultClaim = () => {
    this.props.handleCreateDefaultClaim(this.state.inputClaimData);
    this.setState({ inputClaimData: '' });
  };

  /**
   * Handle the Input controlled components values when changed. Set the
   * state of each input with current  value.
   *
   * @param {string} value - from the input
   */
  handleInputChange = (value) => {
    this.setState({ inputClaimData: value });
  };


  render() {
    return (
      <div className="i3-ww-claims__create">
        <div className="i3-ww-claims__create-text">
          Please, insert the content for the new claim:
        </div>
        <div className="i3-ww-claims__create-area-text">
          <TextArea
            value={this.state.inputClaimData}
            placeholder="Content of the the new claim"
            onChange={e => this.handleInputChange(e.target.value)} />
        </div>
        <div className="i3-ww-claims__create-button">
          <Button
            onClick={this.createDefaultClaim}
            type="primary"
            htmlType="button">
            Create claim
          </Button>
        </div>
      </div>
    );
  }
}

export default DefaultClaim;
