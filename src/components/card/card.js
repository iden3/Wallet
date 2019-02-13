import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card as CardCmpt } from 'antd';

/**
 * Wraps antd Card component to isolate the views from
 * any UI framework that we decide to use.
 * Please, visit to https://ant.design/components/card/ to check props.
 */
class Badge extends PureComponent {
  static propTypes = {
    /*
     Could be 'inner' or not set
     */
    type: PropTypes.string,
    /*
     The title of the card. A React node element
     */
    title: PropTypes.string.isRequired,
    /*
     The inner content of the card
     */
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    type: 'inner',
  };

  render() {
    return (
      <CardCmpt {...this.props}>
        {this.props.children}
      </CardCmpt>
    );
  }
}

export default Badge;
