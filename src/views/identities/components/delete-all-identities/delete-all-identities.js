import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'base_components';

/**
* The content to show inside the confirmation box to delete all de identities.
* There is a warning text and the button to delete them.
*/
class DeleteAllIdentities extends PureComponent {
    static propTypes = {
      onConfirm: PropTypes.func.isRequired,
    };

    render() {
      return (
        <div className="i3-ww-identities__delete-confirmation">
          <div className="i3-ww-identities__delete-confirmation-text">
          You are about to delete all the identities from this application
          and device. This action can not be undone. If you continue, you
          accept that all data stored will be deleted.
          </div>
          <div className="i3-ww-identities__delete-confirmation-button">
            <Button
              type="primary"
              htmlType="button"
              onClick={this.props.onConfirm}>
            I understand it: Delete them!
            </Button>
          </div>
        </div>
      );
    }
}

export default DeleteAllIdentities;
