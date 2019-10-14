import React from 'react';
import { Button } from 'rebass';

const Button = ({label, onClick, disabled=false, className=''}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
