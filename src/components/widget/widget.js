import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Header from './header';
import Content from './content';

import './widget.scss';

/**
 * Main Widget class to wrap the content of any feature of the app.
 * We can minimize it.
 */
class Widget extends PureComponent {
  static propTypes = {
    /*
      isFetching flag
     */
    isFetching: PropTypes.bool.isRequired,
    /*
      Boolean variable to show if there is an error
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

  state = {
    isMinimized: false,
  };

  toggleMinimizeMaximizeWidget = () => {
    this.setState(prevProps => ({ isMinimized: !prevProps.isMinimized }));
  };

  render() {
    const { title, ...rest } = this.props;
    const contentClasses = classNames({
      'i3-ww-widget__content--minimized': this.state.isMinimized,
    });

    return (
      <div className="i3-ww-widget">
        <div>
          <Header
            isMinimized={this.state.isMinimized}
            onClick={this.toggleMinimizeMaximizeWidget}
            title={title} />
        </div>
        <div className={contentClasses}>
          <Content isMinimized={this.state.isMinimized} {...rest} />
        </div>
      </div>
    );
  }
}

export default Widget;
