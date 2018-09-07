import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'base_components/index';

import './header.scss';

/**
 * Header of a Box component. Will have a title and a button to close it.
 * TODO: Implement to have different kind of buttons with their callbacks
 */
class Header extends PureComponent {
  static propTypes = {
    /*
      Callback from any parent to trigger when box is closed
     */
    onClose: PropTypes.func,
    /*
     Title to show in the header
     */
    title: PropTypes.string,
  };

  static defaultProps = {
    title: 'No title',
  };

  render() {
    return (
      <div className="i3-ww-box__header">
        <span className="i3-ww-box__header-title">
          {this.props.title}
        </span>
        <div className="i3-ww-box__header-buttons-area">
          <Button
            onClick={this.props.onClose}
            type="default"
            htmlType="button"
            icon="close" />
        </div>
      </div>
    );
  }
}

export default Header;
