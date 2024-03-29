import React from "react";
import { Link } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  variant: string;
  to?: string;
  size?: string;
  group?: string;
  className?: string;
  disabled?: boolean;
  [x: string]: any;
};

const BUTTONS: { [variant: string]: string } = {
  primary: "bg-blue-500 hover:bg-blue-700 text-white",
  light: "bg-gray-200 hover:bg-gray-300 text-gray-700",
  success: "bg-green-400 hover:bg-green-500 text-green-800",
};

const SIZES: { [size: string]: string } = {
  small: "py-1 px-2 text-sm",
  medium: "py-3 px-4 text-md",
};

const GROUP: { [group: string]: string } = {
  left: "rounded-l",
  right: "rounded-r",
  middle: "",
};

function Button({
  variant,
  children,
  className,
  group,
  size,
  to,
  disabled,
  ...props
}: Props) {
  const buttonsClasses = `${BUTTONS[variant]} ${
    SIZES[size || "medium"]
  } font-bold leading-4 ${className || ""}`;
  const groupClasses = group
    ? `${buttonsClasses} ${GROUP[group]}`
    : `${buttonsClasses} rounded`;

  const disabledClasses = disabled
    ? `${groupClasses} opacity-50 cursor-not-allowed`
    : groupClasses;

  return to && !disabled ? (
    <Link to={to} className={disabledClasses} {...props}>
      {children}
    </Link>
  ) : (
    <button className={disabledClasses} {...props}>
      {children}
    </button>
  );
}

export default Button;
