'use strict';
import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const TIMEOUT = 5000;

class ConfirmButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmMode: false,
    };
  }

  onInitialClick() {
    this.setState({ confirmMode: true });
    setTimeout(() => this.setState({ confirmMode: false }), TIMEOUT);
  }

  render() {
    let button;
    if (this.state.confirmMode) {
      button = (
        <RaisedButton
          className="btn-error"
          label={this.props.confirmText}
          fullWidth={true}
          onTouchTap={(evt) => this.props.onConfirmClick()}
        />
      );
    } else {
      button = (
        <RaisedButton
          className="btn-default"
          label={this.props.text}
          fullWidth={true}
          onTouchTap={(evt) => this.onInitialClick()}
        />
      );
    }

    return button;
  }
}

export { ConfirmButton };
