import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './scrollable.scss';

/**
 * Just a wrapper to create an infinite scroll with
 * the children rendered inside.
 */
class Scrollable extends PureComponent {
  static propTypes = {
    /*
     The height of the scrollable component
     */
    height: PropTypes.number,
    /*
      If we want scroll to the top when new props received
     */
    shouldScrollTop: PropTypes.bool,
    /*
     Call back to trigger when we arrive to the end of current position of the scroll
     */
    fetchMore: PropTypes.func.isRequired,
    /*
     Children
     */
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    height: 500,
  };

  /**
   * Check if we have new props and shouldScrollTop has changed
   * to reset focus to the top of the inner child (should be a table)
   * @param {object} nextProps - nex props to receive
   */
  componentWillReceiveProps(nextProps) {
    if (!this.props.shouldScrollTop && nextProps.shouldScrollTop) {
      this.wrapper.scrollTop = 0;
    }
  }

  /**
   * Check if we need to trigger the callback sent when we have
   * reached the height of the scroll. This is called each time we
   * are scrolling (onscroll event).
   * @param {number} scrollHeight - Current height of the scroll
   * @param {number} scrollTop - Top of the scroll
   * @param {number} offsetHeight - Offset of the scroll height
   */
  handleScroll = ({ target: { scrollHeight, scrollTop, offsetHeight } }) => {
    if (scrollTop + offsetHeight === scrollHeight) {
      this.props.fetchMore();
    }
  };

  render() {
    return (
      <div
        ref={(wrapper) => { this.wrapper = wrapper; }}
        onScroll={this.handleScroll}
        className="i3-ww-scrollable"
        style={{ height: `${this.props.height}px` }}>
        {this.props.children}
      </div>
    );
  }
}

export default Scrollable;
