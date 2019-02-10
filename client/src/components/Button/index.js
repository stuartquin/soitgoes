import React from 'react';

const Button = ({label, onClick, disabled=false, className=''}) => {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
