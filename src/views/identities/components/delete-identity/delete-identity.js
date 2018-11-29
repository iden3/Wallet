import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'base_components';

class DeleteIdentity extends PureComponent {
    static propTypes = {
      onConfirm: PropTypes.func.isRequired,
      address: PropTypes.string,
      label: PropTypes.string,
    }

    render() {
      return (
        <div className="i3-ww-identities__delete-confirmation">
          <div className="i3-ww-identities__delete-confirmation-text">
              You are about to delete the identity
            {''}
            {this.props.label}
            {' '}
            with address
            {' '}
            {this.props.address}
            {''}
              from this application and device. This action can not be undone. If you continue, you
              accept that all data stored will be deleted.
          </div>
          <div className="i3-ww-identities__delete-confirmation-button">
            <Button
              type="primary"
              htmlType="button"
              onClick={this.props.onConfirm}>
                I understand it: Delete the identity!
            </Button>
          </div>
        </div>
      );
    }
}

export default DeleteIdentity;
