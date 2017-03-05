'use strict';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';


const Confirm = (props) => {
  const actions = [
    <FlatButton
      label='Cancel'
      primary={true}
      onTouchTap={props.onCancel}
    />,
    <RaisedButton
      className='btn btn-success'
      label='Confirm'
      primary={true}
      keyboardFocused={true}
      onTouchTap={props.onConfirm}
    />,
  ];

  return (
    <Dialog
      title={props.title}
      actions={actions}
      modal={false}
      open={props.open}
      onRequestClose={props.onCancel}
    >
    {props.message}
    </Dialog>
  );
};

export {Confirm}
