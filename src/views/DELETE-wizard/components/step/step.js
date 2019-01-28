import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

/**
* Single view of a wizard.
*/
class Step extends Component {
  static propTypes = {
    /*
     React component (not element) to render
    */
    content: PropTypes.func.isRequired,
    /*
     Array of props of this view
    */
    ownProps: PropTypes.object,
    /*
     Callback to control the movement into the different views into the wizard
    */
    move: PropTypes.func.isRequired,
    /*
     Own class of the view
    */
    classes: PropTypes.array,
    /*
     Title of this step
    */
    title: PropTypes.string.isRequired,
  }

  render() {
    const Content = this.props.content;
    const cmptClasses = ClassNames('i3-ww-wizard__content', this.props.classes);

    return (
      <div className={cmptClasses}>
        <Content move={this.props.move} {...this.props.ownProps} />
      </div>
    );
  }
}

export default Step;
