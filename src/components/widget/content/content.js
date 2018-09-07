import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'base_components';

import './content.scss';

/**
 * Wrapper for dynamically loaded content that depending on the status/outcome
 * of the request shows a spinner, no-data message, error message, or the actual component
 */
class Content extends Component {
  static propTypes = {
    /*
      isFetching flag
     */
    isFetching: PropTypes.bool.isRequired,
    /*
     *Boolean variable to show if there is an error
     */
    hasError: PropTypes.bool.isRequired,
    /*
      Determines whether to show the no-data message
     */
    hasData: PropTypes.bool.isRequired,
    /*
      Min height property to prevent loading spinner collapsing when its container has no height
     */
    minHeight: PropTypes.string,
    /*
      Children
     */
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    minHeight: 'auto',
  };

  render() {
  /* const cmptClasses = classNames({
      'i3-ww-widget__content': true,
      'i3-ww-widget__content--minimized': this.props.isMinimized,
    }); */

    return (
      <div
        className="i3-ww-widget__content"
        style={{ minHeight: this.props.minHeight }}>
        {this.props.hasData && !this.props.hasError && this.props.children}
        {!this.props.hasData && !this.props.hasError && !this.props.isFetching && (
          <div className="i3-ww-widget__content-alert">
            No data available
          </div>
        )}
        {this.props.hasError && !this.props.isFetching && (
          <div>
            Unkown error
          </div>
        )}
        {this.props.isFetching && (
          <div className="i3-ww-widget__content-spinner">
            <Spinner />
          </div>
        )}
      </div>
    );
  }
}

export default Content;
