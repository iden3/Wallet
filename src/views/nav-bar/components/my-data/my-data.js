import React, { PureComponent } from 'react';
import {
  ImportExportDataWizard,
} from 'views';

/**
 * Component that calls the Import / Export view wizard
 */
class MyData extends PureComponent {
  render() {
    return (
      <ImportExportDataWizard />
    );
  }
}

export default MyData;
