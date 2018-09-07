import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs as TabsCmpt } from 'antd';
import { Icon } from 'base_components';

const { TabPane: TabPaneCmpt } = TabsCmpt;

/**
 * Overrides antd Tabs component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/tabs/ to check props.
 *
 * We need to send the tabs and their children to render the panel
 * that belongs to a tab
 */
class Tabs extends PureComponent {
  static propTypes = {
    /*
     The key of the tab selected by default
     */
    defaultActiveKey: PropTypes.string,
    /*
     An array of tabs. Each tab should contain an object with the info to render
     */
    tabs: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
      children: PropTypes.element.isRequired,
    })).isRequired,
  };

  static defaultProps = {
    defaultActiveKey: 'tab0',
  };

  /**
   * Compose the array of tabs to render regarding the info sent via props
   * @returns {array} of TabPane components with the tabs and their children
   * @private
   */
  _getTabs() {
    return this.props.tabs.map((tab, index) => {
      const icon = tab.icon && (<Icon type={tab.icon} />);

      return (
        <TabPaneCmpt
          key={`tab${index}`}
          tab={(
            <span>
              {icon}
              {tab.title}
            </span>
        )}>
          {tab.children}
        </TabPaneCmpt>
      );
    });
  }

  render() {
    const tabs = this._getTabs();

    return (
      <TabsCmpt defaultActiveKey={this.props.defaultActiveKey}>
        {tabs}
      </TabsCmpt>
    );
  }
}

export default Tabs;
