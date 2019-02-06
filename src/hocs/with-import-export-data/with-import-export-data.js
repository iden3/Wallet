import React, { Component } from 'react';

function withImportExportData(ImportExportComponent) {
  class ImportExportDataWrapper extends Component {
    render() {
      return (
        <ImportExportComponent />
      );
    }
  }

  return ImportExportDataWrapper;
}

export default withImportExportData;
