import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as BOX_CONSTANTS from 'constants/box';

import './side-panel.scss';

const onTheSide = Object.values(BOX_CONSTANTS.SIDE);

/**
 * Side panel that appears from one of app side with the children sent
 */
class SidePanel extends PureComponent {
  static propTypes = {
    /*
     Header React element
     */
    header: PropTypes.node,
    /*
     Footer React element
     */
    footer: PropTypes.node,
    /*
     If box should have the width of all the screen. Also will no have opacity (set to 1)
     */
    fullScreen: PropTypes.bool,
    /*
    Children
     */
    children: PropTypes.node.isRequired,
    /*
    Set if tha side panel should be shown or not when it's created
     */
    isVisible: PropTypes.bool,
    /*
     Callback set the active container to focus for accessibility
     */
    setActiveContainer: PropTypes.func.isRequired,
    /*
    Side where show the side panel
     */
    side: PropTypes.oneOf(onTheSide),
  };

  static defaultProps = {
    side: 'right',
    fullScreen: false,
  };

  componentDidMount() {
    this.props.setActiveContainer(this.container);
  }

  render() {
    const cmptClasses = classNames({
      'i3-ww-side-panel': true,
      'i3-ww-side-panel--full_screen': this.props.fullScreen,
      'i3-side-panel--regular-size': !this.props.fullScreen,
      [`i3-ww-side-panel--${this.props.side}`]: true,
      'i3-ww-side-panel--visible': this.props.isVisible,
    });

    return (
      <div
        className={cmptClasses}
        role="dialog">
        <div>
          {this.props.header}
        </div>
        <div
          role="document"
          ref={(el) => { this.container = el; }}
          className="i3-ww-side-panel__inner">
          {this.props.children}
        </div>
        <div>
          {this.props.footer}
        </div>
      </div>
    );
  }
}

export default SidePanel;
