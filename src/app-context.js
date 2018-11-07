import React, { Component } from 'react';
import PropTypes from 'prop-types';

const AppContext = React.createContext();
const AppContextConsumer = AppContext.Consumer;

/**
 * Creates context for all the application.
 *
 */
class AppContextProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    value: PropTypes.any,
  };

  render() {
    const { children, value } = this.props;

    return (
      <AppContext.Provider value={{ ...value }}>
        {children}
      </AppContext.Provider>
    );
  }
}

export { AppContextProvider, AppContextConsumer };
