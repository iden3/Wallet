import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ImportExportDataWizard,
} from 'views';

/**
 * Component that calls the Import / Export view wizard
 */
class MyData extends PureComponent {
  static propTypes = {
    toggleVisibility: PropTypes.func.isRequired,
  };

  render() {
    return (
      <ImportExportDataWizard
        toggleVisibility={this.props.toggleVisibility} />
    );
  }
}

export default MyData;
