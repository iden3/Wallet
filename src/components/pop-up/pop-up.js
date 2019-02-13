import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as BOX_CONSTANTS from 'constants/box';

import './pop-up.scss';

const popUpSizes = Object.values(BOX_CONSTANTS.POP_UP.SIZE);

/**
 * Pop up component for all the application
 */
class PopUp extends PureComponent {
  static propTypes = {
    /*
    Children
     */
    children: PropTypes.node.isRequired,
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
    Set if the pop-up should be shown or not
     */
    isVisible: PropTypes.bool,
    /*
     Callback set the active container to focus for accessibility
     */
    setActiveContainer: PropTypes.func.isRequired,
    /*
     Size of the pop-up, should be one of the BOX_CONSTANTS.POP_UP sizes
     */
    size: PropTypes.oneOf(popUpSizes),
  };

  static defaultProps = {
    isVisible: false,
    fullScreen: false,
    size: BOX_CONSTANTS.POP_UP.SIZE.MEDIUM,
  };

  componentDidMount() {
    this.props.setActiveContainer(this.container);
  }

  render() {
    const innerClasses = classNames({
      'i3-ww-pop-up': true,
      'i3-ww-pop-up--visible': this.props.isVisible,
      [`i3-ww-pop-up--size-${this.props.size}`]: true,
    });
    const backgroundClasses = classNames({
      'i3-ww-pop-up__background--visible': this.props.isVisible,
    });

    return (
      <Fragment>
        <div className={backgroundClasses} />
        <div
          className={innerClasses}
          role="dialog">
          <div>
            {this.props.header}
          </div>
          <div
            ref={(el) => { this.container = el; }}
            role="document">
            {this.props.children}
          </div>
          <div>
            {this.props.footer}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default PopUp;
