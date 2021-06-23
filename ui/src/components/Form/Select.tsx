import React, { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  disbaled?: boolean;
  children: React.ReactNode;
  [x: string]: any;
}

function Select({ className, children, disabled, ...props }: Props) {
  const classes = `shadow border border-grey-300 rounded p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
    className || ""
  }`;

  const disabledClasses = disabled
    ? `${classes} bg-gray-200`
    : `${classes} bg-white`;

  return (
    <select className={disabledClasses} disabled={disabled || false} {...props}>
      {children}
    </select>
  );
}

export default Select;
