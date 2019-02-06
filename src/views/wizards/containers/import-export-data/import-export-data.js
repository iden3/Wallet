import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  withImportExportData,
  Wizard,
} from 'hocs';

import './import-export-data.scss';

class ImportExportData extends Component {
  render() {
    return (
      <div>Import export data </div>
    );
  }
}

export default compose(withImportExportData)(ImportExportData);
