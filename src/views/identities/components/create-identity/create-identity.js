import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CreateIdentity as CreateIdentityView } from 'views';

/**
 * Component that calls the Create identity view wizard
 */
class CreateIdentity extends PureComponent {
  static propTypes = {
    /*
     Call back to trigger when identity created, in this case will be close the box
    */
    afterCreateIdentity: PropTypes.func,
  }

  static defaultProps = {
    afterCreateIdentity: () => {},
  }

  render() {
    return (
      <CreateIdentityView
        isFirstIdentity={false}
        afterCreateIdentity={this.props.afterCreateIdentity} />
    );
  }
}

export default CreateIdentity;
