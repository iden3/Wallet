import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { FORWARD, BACKWARDS } from 'constants/wizard';
import Step from '../components';

import './wizard.scss';

/**
* Class to wrap all the wizards of the applications. A Wizard is a workflow with
* different views that they can go forward or backwards.
*/
class Wizard extends Component {
  static propTypes = {
    /*
     Array with the views sorted to show the wizard steps.
     Each element should be a React element to render.
    */
    sortedSteps: PropTypes.arrayOf(
      PropTypes.shape({
        /*
         React component (not element) to send to the Step
        */
        content: PropTypes.func.isRequired,
        /*
         Props of the component
        */
        ownProps: PropTypes.object,
        /*
         Own classes of the step
        */
        classes: PropTypes.array,
        /*
         Title of the step
        */
        title: PropTypes.string,
        /*
         Subtitle of the step
        */
        subtitle: PropTypes.string,
      }).isRequired,
    ).isRequired,
    /*
     When wizard finished a callback to trigger
    */
    lastAction: PropTypes.func,
    /*
     Own class of the inner view
    */
    className: PropTypes.string,
  }

  static defaultProps = {
    lastAction: () => {},
  }

  state = {
    currentStep: 0,
    goToDashboard: false,
  }

  componentWillUnmount() {
    this.setState({ goToDashboard: true });
  }

  /**
   * Set component state to show the right view of the welcome wizard.
   *
   * @param {string} direction should be 'forward' or 'backwards'
   */
  changeStep = (direction = FORWARD) => {
    if (!this.state.goToDashboard) {
      let { currentStep } = this.state;

      if (direction === FORWARD) {
        currentStep = this.state.currentStep + 1;
      } else if (direction === BACKWARDS) {
        currentStep = this.state.currentStep - 1;
      }

      if (currentStep === this.props.sortedSteps.length) {
        this.props.lastAction();
        this.setState({ goToDashboard: true });
      } else {
        this.setState({ currentStep });
      }
    }
  }

  render() {
    const step = this.props.sortedSteps[this.state.currentStep];
    const {
      content, ownProps, classes, title, subtitle,
    } = step;
    const cmptClasses = ClassNames('i3-ww-wizard', this.props.className);

    return (
      <div className={cmptClasses}>
        <div className="i3-ww-wizard__title">
          <div>
            { title && <p className="i3-ww-title">{title}</p> }
            { subtitle && <p className="i3-ww-subtitle">{subtitle}</p> }
          </div>
        </div>
        <div className="i3-ww-wizard__step">
          <Step
            ownProps={ownProps}
            content={content}
            title={title}
            subtitle={subtitle}
            classes={classes}
            move={this.changeStep} />
        </div>
      </div>
    );
  }
}

export default Wizard;
