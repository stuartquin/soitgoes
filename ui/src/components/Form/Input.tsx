import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  disabled?: boolean;
  [x: string]: any;
}

function Input({ className, disabled, ...props }: Props) {
  const classes = `shadow appearance-none border border-grey-300 rounded p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
    className || ""
  }`;

  const disabledClasses = disabled
    ? `${classes} bg-gray-200`
    : `${classes} bg-white`;

  return (
    <input
      className={disabledClasses}
      {...props}
      disabled={disabled || false}
    />
  );
}

export default Input;
