import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tree as TreeCmpt } from 'antd';
import { Icon } from 'base_components';

const { TreeNode } = TreeCmpt;

/**
 * Wraps antd Layout.Header component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/layout/ to check props.
 */
class Tree extends PureComponent {
  static propTypes = {
    /*
     Leaves of the tree
     */
    leaves: PropTypes.arrayOf(PropTypes.shape([
      PropTypes.string,
      PropTypes.string,
    ])).isRequired,
    /*
     Root label of the tree
     */
    root: PropTypes.string.isRequired,
    /*
     Icon to show before the root
     */
    rootIcon: PropTypes.string,
    /*
     Icon to show before each leaf
     */
    leavesIcon: PropTypes.string,
  };

  static defaultProps = {
    rootIcon: 'share-alt',
    leavesIcon: 'link',
  };

  _getLeaves() {
    return this.props.leaves.map((leaf, index) => {
      return (
        <TreeNode
          icon={<Icon type={this.props.leavesIcon} />}
          title={`${leaf.label}: ${leaf.data}`}
          key={`0-0-${index + 1}`} />
      );
    });
  }

  render() {
    const rootIcon = (<Icon type={this.props.rootIcon} />);
    const leaves = this._getLeaves();

    return (
      <TreeCmpt
        title={this.props.root}
        icon={rootIcon}
        key="0-0">
        {leaves}
      </TreeCmpt>
    );
  }
}

export default Tree;
