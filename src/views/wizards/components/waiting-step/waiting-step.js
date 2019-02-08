import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FORWARD } from 'constants/wizard';
import {
  Button,
  Spinner,
} from 'base_components';

/**
 * This is wizard step in which we place a spinner waiting for any async (or other type that
 * we need to wait) action. When the prop "finishedAction" is true, spinner is removed
 * and we show the text sent (if sent) and a button with a "call to action".
 */
class WaitingStep extends PureComponent {
  static propTypes = {
    /*
     Callback to handle the movement of the wizard
     */
    move: PropTypes.func.isRequired,
    /*
     Flag to point out that action that is showing spinning it's over
     */
    finishedAction: PropTypes.bool.isRequired,
    /*
    Information text to place before call to action button
     */
    getInfoText: PropTypes.func,
    /*
    Call to action button text after action finished
     */
    buttonText: PropTypes.string,
  };

  static defaultProps = {
    buttonText: 'Continue',
    getInfoText: () => {},
  };

  /**
   * Show the content after the spinner has dissapeared.
   * It show a text if sent in props.getInfoText (function)
   * and a button to continue to next step.
   *
   * @returns {*}
   */
  getFinalContent = () => {
    const text = this.props.getInfoText();

    return (
      <div>
        { text
        && (
          <div>
            <p>
              {text}
            </p>
          </div>
        )
        }
        <div className="i3-ww-ssw__buttons">
          <Button
            onClick={() => this.props.move(FORWARD)}
            type="primary"
            htmlType="button">
            {this.props.buttonText}
          </Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="i3-ww-wizard__waiting-step">
        { this.props.finishedAction ? this.getFinalContent() : <Spinner /> }
      </div>
    );
  }
}

export default WaitingStep;
