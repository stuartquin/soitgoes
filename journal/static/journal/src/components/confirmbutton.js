'use strict';
import React from 'react';


const TIMEOUT = 5000;

class ConfirmButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmMode: false
    };
  }

  onInitialClick() {
    this.setState({confirmMode: true});
    setTimeout(() => this.setState({confirmMode: false}), TIMEOUT);
  }

  render() {
    let button;
    if (this.state.confirmMode) {
      button = (
        <button className='btn btn-danger btn-block btn-raised'
          onClick={() => this.props.onConfirmClick()}>
          {this.props.confirmText} 
          <span className='glyphicon glyphicon-question-sign pull-right'
            aria-hidden='true'>
          </span>
        </button>
      );
    } else {
      button = (
        <button className='btn btn-warning btn-block btn-raised'
          onClick={() => this.onInitialClick()}>
          {this.props.text}
        </button>
      );
    }

    return button;
  }
}


export {ConfirmButton};
