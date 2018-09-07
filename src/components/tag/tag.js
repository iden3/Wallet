import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tag as TagCmpt } from 'antd';

/**
 * Wraps antd Tag. Tag component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/Tag/ to check props.
 */
class Tag extends PureComponent {
  static propTypes = {
    /*
    Children
     */
    children: PropTypes.node,
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <TagCmpt {...restProps}>
        {children}
      </TagCmpt>
    );
  }
}

export default Tag;
