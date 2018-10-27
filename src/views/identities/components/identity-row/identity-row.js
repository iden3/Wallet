import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
} from 'base_components';

import './identity-row.scss';

/**
 * Generates a row with the information needed to show in the list of identities.
 */
class IdentityRow extends PureComponent {
  static propTypes = {
    /*
     The string to render before the date in each row
     */
    content: PropTypes.string.isRequired,
    /*
     Extra data of the identity, to show it in the collapsible content
     */
    data: PropTypes.arrayOf(PropTypes.node),
    /*
     Id of the identity to used it as a key
     */
    id: PropTypes.string.isRequired,
  };

  render() {
    const mainContent = (
      <div
        className="i3-ww-identity-row__main-content"
        tabIndex="-1"
        role="gridcell">
        <div className="i3-ww-identity-row__description">
          {this.props.content}
        </div>
      </div>
    );

    return (
      <Fragment>
        <Row
          key={this.props.id}
          className="i3-ww-identity-row"
          collapsible={this.props.data}
          mainContent={mainContent} />
      </Fragment>
    );
  }
}

export default IdentityRow;
