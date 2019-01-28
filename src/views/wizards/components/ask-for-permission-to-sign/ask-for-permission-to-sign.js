import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
} from 'base_components';

/**
 * View of the last step to do a sign in.
 * Show the information to the user in a clear way in order
 * that can accept it knowing what they are doing.
 */
class AskForPermissionToSign extends PureComponent{
  static propTypes = {
    signInData: PropTypes.string.isRequired,
    confirmSignIn: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <div>
          { this.props.signInData }
        </div>
        <div className="i3-ww-sipw__buttons">
          <Button
            onClick={this.props.confirmSignIn}
            type="primary"
            htmlType="button">
            Confirm
            <Icon type="right" />
          </Button>
        </div>
      </div>

    );
  }
}

export default AskForPermissionToSign;
