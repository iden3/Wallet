import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Menu,
  MenuItem,
} from 'base_components';
import { Dropdown as DropDownCmpt } from 'antd';

/**
 * Wraps antd DropDown. DropDown component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/Tag/ to check props.
 */
class DropDown extends PureComponent {
  static propTypes = {
    /*
     Array of options to show in the drop-down
     */
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    /*
     Title that will be the call to action to display the drop-down
     */
    title: PropTypes.string,
  };

  static defaultProps = {
    title: 'Choose an option',
  };

  /**
   * Retrieve the elements to show in the drop-down, setting the
   * key and the string of the option
   *
   * @returns {element} With the elements to render in the drop-down
   */
  getItemsList = () => {
    return (
      <Menu>
        { this.props.options.map((option, index) => (
          <MenuItem key={`${index}-${option}`}>
            {option}
          </MenuItem>
        )) }
      </Menu>
    );
  };

  render() {
    const items = this.getItemsList();

    return (
      <div className="i3-ww-drop-down">
        <DropDownCmpt
          overlay={items}
          trigger={['click']}>
          <span>
            {this.props.title}
            <Icon type="down" />
          </span>
        </DropDownCmpt>
      </div>
    );
  }
}

export default DropDown;
