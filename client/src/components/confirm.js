'use strict';
import React from 'react';

import Button from 'components/Button';

const Confirm = (props) => {
  const confirmText = props.confirmText || 'Confirm';
  const actions = [
    <Button
      label='Cancel'
      onClick={props.onCancel}
    />,
    <Button
      className='btn btn-success'
      label='Confirm'
      onClick={props.onConfirm}
    />,
  ];

  return props.open ? (
    <div>
      {props.children}
    </div>
  ) : null;
};

export {Confirm}
