import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Row,
} from 'base_components';

import './claim-row.scss';

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
    id: PropTypes.string.isRequired,
    /*
     Call back to trigger when pin icon is clicked
     */
    togglePinned: PropTypes.func.isRequired,
    /*
     Key of the DOM element
     */
    key: PropTypes.string,
    /*
     Extra data of the claim, to show it in the collapsible content
     */
    data: PropTypes.arrayOf(PropTypes.node),
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
   * trigger togglePinned call back.
   *
   * @param {object} e - event key
   */
  togglePinnedHandleKeyUp = (e) => {
    const key = e.which;

    if (key === 13 || key === 32) {
      this.togglePinned();
    }
  };

  render() {
    const initialContent = !this.props.groups && (
      <div className="i3-ww-claim-row__initial-content">
        <div className="i3-ww-claim-row__date">
          {`${this.props.date}`}
        </div>
        <div
          className="i3-ww-claim-row__pin-it"
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
        <div className="i3-ww-claim-row__description">
          {this.props.content}
        </div>
      </div>
    );

    return (
      <Fragment>
        <Row
          id={this.props.key}
          collapsible={this.props.data}
          className="i3-ww-claim-row"
          initialContent={initialContent}
          mainContent={mainContent} />
      </Fragment>
    );
  }
}

export default ClaimRow;
