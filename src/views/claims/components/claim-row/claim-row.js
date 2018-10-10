import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { format } from 'date-fns';
import {
  Icon,
  Row,
} from 'base_components';
import * as CLAIM from 'constants/claim';

import './claim-row.scss';

const claimTypes = [CLAIM.TYPE.ASSIGN_NAME.NAME, CLAIM.TYPE.SIGN.NAME, CLAIM.TYPE.DEFAULT.NAME];

/**
 * Generates a row with the information needed to show in the list of claims.
 * We need to send the string with the content depending on claim's type (emitted,
 * received or grouped)
 */
class ClaimRow extends PureComponent {
  static propTypes = {
    /*
     Array with the groups that this claim belongs to
     */
    groups: PropTypes.arrayOf(PropTypes.string),
    /*
     Last date of modification (creation or last version)
     */
    date: PropTypes.object.isRequired,
    /*
      Type of the claim to show the icon or not (if it's grouped)
     */
    type: PropTypes.oneOf(claimTypes).isRequired,
    /*
     To show a filled icon or not if it's pinned to the dashboard pinned widget
     */
    isPinned: PropTypes.bool.isRequired,
    /*
     The string to render before the date in each row
     */
    content: PropTypes.string.isRequired,
    /*
     Id of the claim
     */
    id: PropTypes.number.isRequired,
    /*
     Call back to trigger when pin icon is clicked
     */
    togglePinned: PropTypes.func.isRequired,
  };

  state = {
    isPinned: this.props.isPinned,
  };

  /**
   * Change the stat to render complementary icon
   * and trigger the toggle pinned function
   */
  togglePinned = () => {
    this.setState(prevState => ({ isPinned: !prevState.isPinned }));
    this.props.togglePinned(this.props.id);
  };

  /**
   * Handle if key is intro (code 13) when pinned
   * claim icon is controlled by keyboard, then
   * trigger togglePinned call back
   * @param {object} e - event key
   */
  togglePinnedHandleKeyUp = (e) => {
    const key = e.which;

    if (key === 13 || key === 32) {
      this.togglePinned();
    }
  };

  render() {
    const typeClassNames = classNames({
      'i3-ww-claim-row__type': true,
      default: this.props.type === CLAIM.TYPE.DEFAULT.NAME,
      'assign-name': this.props.type === CLAIM.TYPE.ASSIGN_NAME.NAME,
      sign: this.props.type === CLAIM.TYPE.SIGN.NAME,
    });
    const formatedDate = format(
      this.props.date,
      ' d / MMM / yyyy',
    );
    const initialContent = !this.props.groups && (
      <div className="i3-ww-claim-row__initial-content">
        <div className="i3-ww-claim-row__date">
          {`${formatedDate}`}
        </div>
        <div
          role="gridcell"
          tabIndex={0}
          onKeyUp={this.togglePinnedHandleKeyUp}
          onClick={this.togglePinned}>
          {this.state.isPinned ? <Icon type="star" theme="filled" /> : <Icon type="star" />}
        </div>
      </div>
    );
    const mainContent = (
      <div
        className="i3-ww-claim-row__main-content"
        tabIndex="-1"
        role="gridcell">
        <div className={typeClassNames}>
          {this.props.type.charAt(0).toUpperCase()}
        </div>
        <div>
          {this.props.content}
        </div>
      </div>
    );
    const finalContent = (
      <div
        className="i3-ww-claim-row__final-content"
        tabIndex={0}
        role="gridcell">
        <Icon type="down" />
      </div>
    );

    return (
      <Fragment>
        <Row
          className="i3-ww-claim-row"
          initialContent={initialContent}
          mainContent={mainContent}
          finalContent={finalContent} />
      </Fragment>
    );
  }
}

export default ClaimRow;
