import React from "react";
import { Link } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  variant: string;
  to?: string;
  group?: string;
  className?: string;
  [x: string]: any;
};

const BUTTONS: { [variant: string]: string } = {
  primary: "bg-blue-500 hover:bg-blue-700 text-white",
  light: "bg-gray-200 hover:bg-gray-300 text-gray-700",
  success: "bg-green-400 hover:bg-green-500 text-green-800",
};

const GROUP: { [group: string]: string } = {
  left: "rounded-l",
  right: "rounded-r",
  middle: "",
};

function Button({ variant, children, className, group, to, ...props }: Props) {
  const buttonsClasses = `${BUTTONS[variant]} font-bold py-2 px-4 ${
    className || ""
  }`;
  const groupClasses = group
    ? `${buttonsClasses} ${GROUP[group]}`
    : `${buttonsClasses} rounded`;

  return to ? (
    <Link to={to} className={groupClasses} {...props}>
      {children}
    </Link>
  ) : (
    <button className={groupClasses} {...props}>
      {children}
    </button>
  );
}

export default Button;
