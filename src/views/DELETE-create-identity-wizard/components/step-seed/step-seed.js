import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
} from 'base_components';

class StepSeed extends PureComponent {
  static propTypes = {
    move: PropTypes.func,
    seed: PropTypes.array,
  }

  static defaultProps = {
    seed: ['as', 'the', 'keyboard', 'nurse', 'television', 'show', 'music', 'pop', 'house', 'carpet', 'glasses', 'mice'],
  }

  moveBackwards = () => {
    this.props.move('backwards');
  }

  moveForward = () => {
    const element = document.createElement('a');
    const file = new Blob([this.props.seed.join(' '), { type: 'text/plain' }]);

    element.href = URL.createObjectURL(file);
    element.download = 'iden3.txt';
    element.click();
    // this.props.move('forward');
  }

  render() {
    return (
      <div className="i3-ww-ci__step i3-ww-ci__show-seed">
        <div className="i3-ww-ci__title">
          <p className="i3-ww-title">Your name/label</p>
        </div>
        <div className="i3-ww-ci__content">
            Your seed is:
            as the keyboard nurse television show music pop house carpet glasses mice
        </div>
        <div className="i3-ww-ci__buttons">
          <Button
            onClick={this.moveBackwards}
            type="primary"
            htmlType="button">
            <Icon type="left" />
            Back
          </Button>
          <Button
            onClick={this.moveForward}
            type="primary"
            htmlType="button">
            Already have kept them. Move Forward!
            <Icon type="right" />
          </Button>
        </div>
      </div>
    );
  }
}

export default StepSeed;
