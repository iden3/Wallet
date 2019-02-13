import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Portal,
  PopUp,
  SidePanel,
} from 'base_components';
import * as BOX_CONSTANTS from 'constants/box';
import Header from './header';

import './box.scss';

const boxTypes = Object.values(BOX_CONSTANTS.TYPE);

/**
 * Element to show information sent by another component. We can show it in a
 * regular emergent pop-up or in a sidebar that appears from the left or right.
 * The responsibility of the state of the box (if is shown or not) it's here.
 * Shouldn't be in the parent. The parent will send a call back to trigger
 * anything that it's important to execute after the Box is hidden.
 */
class Box extends Component {
  static propTypes = {
    /*
    The content to show
     */
    content: PropTypes.object.isRequired,
    /*
     If box should have the width of all the screen. Also will no have opacity (set to 1)
     */
    fullScreen: PropTypes.bool,
    /*
      Call back from any parent to trigger when box is closed
     */
    onClose: PropTypes.func,
    /*
     Show the box or not
     */
    show: PropTypes.bool,
    /*
     Side to show the side panel, prop only valid if prop type is 'side'
     */
    side: PropTypes.string,
    /*
     Title to show in the header
     */
    title: PropTypes.string,
    /*
    The type of box to show
     */
    type: PropTypes.oneOf(boxTypes).isRequired,
  };

  static defaultProps = {
    fullScreen: false,
  };

  state = {
    container: {},
    isVisible: this.props.show,
  };

  /**
   * Set the new state if visibility changes regarding parent component.
   *
   * @param {object} props new props from parent
   * @param {object} state current state before have been updated
   *
   * @returns {object} updated state
   */
  static getDerivedStateFromProps(props, state) {
    if (props.show !== state.isVisible) {
      return { isVisible: props.show };
    }
    return state;
  }

  componentDidMount() {
    if (document.getElementsByClassName('i3-ww-popups')[0] && this.node) {
      document.getElementsByClassName('i3-ww-popups')[0].appendChild(this.node);
    }
  }

  /**
   * Remove the listeners to the focus and escape and return the focus
   * to the las element active before show the Box.
   */
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleClose, true);
    document.removeEventListener('focus', this.handleFocus, true);
    this.lastActive && this.lastActive.focus();
    document.getElementsByClassName('i3-ww-popups')[0].removeChild(this.node);
  }

  /**
   * Set the focus for usability in the content shown in the  box.
   *
   * @param {object} event
   */
  handleFocus = (event) => {
    if (this.state.isVisible && !this.state.container.contains(event.target)) {
      event.stopPropagation();
      this.state.container.focus();
    }
  };

  /**
   * If key escape (code 27) pressed, close the box.
   *
   * @param {number} keyCode
   */
  handleClose = ({ keyCode }) => {
    if (this.state.isVisible && keyCode && keyCode === 27) {
      this.props.onClose();
      this.lastActive.focus();
    }
  };

  /**
   * If we click over the app, check if was a click inside the box or not.
   * If click made outside add or remove event listener to check the click.
   */
  handleClick = (e) => {
    // ignore clicks inside the Box
    if (this.node.contains(e.target)) {
      return;
    }

    // clicked out of the Box
    if (!this.state.isVisible) {
      document.addEventListener('click', this.handleClick, false);
    } else {
      document.removeEventListener('click', this.handleClick, false);
    }
  };

  /**
   * Handle the focus of the inner element and close with
   * the inner content of the box. For accessibility purposes.
   *
   * @param {object} container React node
   */
  setActiveContainer = (container) => {
    this.setState({
      container,
    }, () => {
      this.lastActive = document.activeElement;
      this.state.container.focus();
      document.addEventListener('focus', this.handleFocus, true);
      document.addEventListener('keydown', this.handleClose, true);
    });
  };

  /**
   * It change the visibility of the box, used when, i.e., in the
   * onClose callback sent to the child component (SidePanel or PopUp)
   */
  toggleBoxVisibility = () => {
    this.setState((prevState) => {
      if (prevState.isVisible && this.props.onClose) {
        this.props.onClose();
      }

      return { isVisible: !prevState.isVisible };
    });
  };

  /**
   * Get the content to render, a SidePanel or a Pop-up.
   *
   * @returns {object} React node with a SidePanel or a Popup component
   * @private
   */
  _getContent() {
    const Container = this.props.type === BOX_CONSTANTS.TYPE.SIDE_PANEL ? SidePanel : PopUp;
    const header = (<Header title={this.props.title} onClose={this.props.onClose} />);

    return (
      <Container
        header={header}
        fullScreen={this.props.fullScreen}
        side={this.props.side}
        onClose={this.toggleBoxVisibility}
        setActiveContainer={this.setActiveContainer}
        isVisible={this.state.isVisible}>
        {this.props.content}
      </Container>
    );
  }

  render() {
    const cmptClass = this.props.fullScreen ? 'i3-ww-box-full-screen' : 'i3-ww-box';

    return (
      <div ref={node => this.node = node}>
        { this.state.isVisible && (
          <Fragment>
            <div className="i3-ww-box-mask" />
            <div
              className={cmptClass}
              role="button"
              tabIndex={0}
              onClick={this.handleClick}
              onKeyUp={this.handleClick}>
              <Portal parentClassName={cmptClass}>
                { this._getContent() }
              </Portal>
            </div>
          </Fragment>
        )
      }
      </div>
    );
  }
}

export default Box;
