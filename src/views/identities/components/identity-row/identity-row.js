import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as ICONS from 'constants/icons';
import {
  Icon,
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
    /*
     Flag to know if current row belongs to the current identity to don't show the "change identity" icon and
     put another background color
    */
    isCurrent: PropTypes.bool.isRequired,
    /*
     Call back when another identity is selected to load it in the app
    */
    onChangeCurrentIdentity: PropTypes.func.isRequired,
    /*
     Address of the identity if we want to change to another one
    */
    address: PropTypes.string.isRequired,
  };

  render() {
    const rowClasses = classNames({
      'i3-ww-identity-row': true,
      'i3-ww-identity-row__main-content--current-user': this.props.isCurrent,
    });
    const mainContent = (
      <div
        className="i3-ww-identity-row__main-content"
        tabIndex="-1"
        role="gridcell">
        {!this.props.isCurrent
        && (
          <div
            role="gridcell"
            tabIndex="0"
            onKeyUp={() => this.props.onChangeCurrentIdentity(this.props.address)}
            onClick={() => this.props.onChangeCurrentIdentity(this.props.address)}
            className="i3-ww-identity-row__change-identity">
            <Icon type={ICONS.CHANGE_IDENTITY} />
          </div>
        )}
        <div className="i3-ww-identity-row__description">
          {this.props.content}
        </div>
      </div>
    );

    return (
      <Fragment>
        <Row
          className={rowClasses}
          key={`identity-row-${this.props.id}`}
          id={this.props.id}
          collapsible={this.props.data}
          mainContent={mainContent} />
      </Fragment>
    );
  }
}

export default IdentityRow;
