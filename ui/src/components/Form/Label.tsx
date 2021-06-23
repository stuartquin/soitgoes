import React, { LabelHTMLAttributes } from "react";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children?: React.ReactNode;
  [x: string]: any;
}

function Label({ className, children, ...props }: Props) {
  const classes = `block text-sm font-medium text-gray-700 mb-1
${className || ""}`;
  return (
    <label className={classes} {...props}>
      {children}
    </label>
  );
}

export default Label;
