'use strict';
import React from 'react';

import Button from 'components/Button';

const Confirm = (props) => {
  const confirmText = props.confirmText || 'Confirm';

  return props.open ? (
    <div>
      {props.children}
      <div>
        <Button label="Cancel" onClick={props.onCancel} />
        <Button
          className="btn btn-success"
          label={confirmText}
          onClick={props.onConfirm}
        />
      </div>
    </div>
  ) : null;
};

export { Confirm };
