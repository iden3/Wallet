import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Menu,
} from 'base_components';
import { Dropdown as DropDownCmpt } from 'antd';

/**
 * Wraps antd DropDown. DropDown component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/dropdown/ to check props.
 */
class DropDown extends PureComponent {
  static propTypes = {
    /*
     Array of options to show in the drop-down
     */
    options: PropTypes.arrayOf(PropTypes.node).isRequired,
    /*
     Title or component (generally button with icon) that will be the call to action to display the drop-down
     */
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    /*
      Callback to trigger when changes the visibility
     */
    onVisibleChange: PropTypes.func,
    /*
     Placement of the popup with the options regarding its parent
     */
    placement: PropTypes.oneOf(['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight']),
    /*
     Optional call back to trigger when any click is done
     */
    onClick: PropTypes.func,
  };

  static defaultProps = {
    header: 'Choose an option',
    placement: 'bottomRight',
    onClick: () => {},
  };

  render() {
    const { header, options, ...rest } = this.props;
    const items = (
      <Menu>
        {options}
      </Menu>
    );

    return (
      <div
        className="i3-ww-drop-down"
        onClick={this.props.onClick}>
        <DropDownCmpt
          {...rest}
          overlay={items}
          trigger={['click']}>
          <span>
            {header}
            {header.constructor === String && <Icon type="down" />}
          </span>
        </DropDownCmpt>
      </div>
    );
  }
}

export default DropDown;
