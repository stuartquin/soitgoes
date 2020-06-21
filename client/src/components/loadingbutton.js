'use strict';
import React from 'react';

const LoadingButton = (props) => {
  let button;

  if (props.isLoading) {
    button = (
      <button className={props.className} disabled={true}>
        {props.text}
      </button>
    );
  } else {
    button = (
      <button className={props.className} onClick={props.onClick}>
        {props.text}
      </button>
    );
  }

  return button;
};

export { LoadingButton };
