import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

/**
 * A portal component that allows components to render elements
 * outside of their own markup. It creates a div HTML element to
 * inject the children sent by other component. I.e. will be used
 * to show content in a pop-up or in a side-bar. We need to send
 * information to there.
 */
class Portal extends Component {
  // domNode where to inject the sent content
  domNode = document.createElement('div');

  static propTypes = {
    /*
     The content to be shown
     */
    children: PropTypes.node,
    /*
    The id of the container to inject the content
     */
    parentId: PropTypes.string,
    /*
    The class name of the container to inject the content
     */
    parentClassName: PropTypes.string,
  };

  static defaultProps = {
    parentClassName: 'i3-ww-popups',
  };

  /**
   * Once component mounted and portal created, check where is the container
   * to inject the sent content. We will check for an Id or ClassName
   */
  componentDidMount() {
    if (this.props.parentId && document.getElementById(this.props.parentId)) {
      document.getElementById(this.props.parentId).appendChild(this.domNode);
    }

    if (this.props.parentClassName && document.getElementsByClassName(this.props.parentClassName)[0]) {
      document.getElementsByClassName(this.props.parentClassName)[0].appendChild(this.domNode);
    }
  }

  /**
   * Once component has been unmounted remove the portal created
   */
  componentWillUnmount() {
    if (this.props.parentId && document.getElementById(this.props.parentId)) {
      document.getElementById(this.props.parentId).removeChild(this.domNode);
    }

    if (this.props.parentClassName
      && document.getElementsByClassName(this.props.parentClassName)[0]
      && document.getElementsByClassName(this.props.parentClassName)[0].hasChildNodes()) {
      document.getElementsByClassName(this.props.parentClassName)[0].removeChild(this.domNode);
    }
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.domNode,
    );
  }
}

export default Portal;
