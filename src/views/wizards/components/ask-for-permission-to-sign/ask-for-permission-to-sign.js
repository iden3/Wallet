import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon, Input,
} from 'base_components';

/**
 * View of the last step to do a sign in.
 * Show the information to the user in a clear way in order
 * that can accept it knowing what they are doing.
 */
class AskForPermissionToSign extends PureComponent{
  static propTypes = {
    signInData: PropTypes.object.isRequired,
    confirmSignIn: PropTypes.func.isRequired,
    identityLabel: PropTypes.string.isRequired,
    identityDomain: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
  };

  state = {
    passphrase: '',
  };

  /**
   * Handle the Input controlled components values when changed. Set the
   * state of each input with current  value.
   *
   * @param value
   * @param input
   */
  handleInputChange = (value, input) => {
    this.setState({ [input]: value });
  };

  render() {
    return (
      <div>
        <div>
          <p>
            Hey! You are about to do a sign in at
            <br />
            <b>{this.props.signInData.body.data.origin}</b>
          </p>
          <p>
            The username used will be
            <br />
            <b>{this.props.identityLabel}</b>
            <br />
            <b>
            @{this.props.identityDomain}
            </b>
          </p>
          <p>
            If you agree, please write your passphrase down and confirm the sign in.
          </p>
        </div>
        <div>
          <form>
            <div className="i3-ww-siw__input-wrapper">
              <Input
                placeholder="Enter passphrase"
                value={this.state.passphrase}
                onChange={e => this.handleInputChange(e.target.value, 'passphrase')}
                isPasswordType />
            </div>
          </form>
        </div>
        <div className="i3-ww-siw__buttons">
          <Button
            loading={this.props.isFetching}
            disabled={!this.state.passphrase}
            onClick={() => this.props.confirmSignIn(this.state.passphrase)}
            type="primary"
            htmlType="button">
            Confirm
            <Icon type="right" />
          </Button>
        </div>
      </div>);

  }
}

export default AskForPermissionToSign;
