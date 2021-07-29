import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  disabled?: boolean;
  [x: string]: any;
}

function Textarea({ className, disabled, ...props }: Props) {
  const classes = `shadow appearance-none border border-grey-300 rounded p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
    className || ""
  }`;

  const disabledClasses = disabled
    ? `${classes} bg-gray-200`
    : `${classes} bg-white`;

  return (
    <textarea
      className={disabledClasses}
      {...props}
      disabled={disabled || false}
    ></textarea>
  );
}

export default Textarea;
