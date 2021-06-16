import React from "react";
import { Link } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  variant: string;
  to?: string;
  group?: string;
  className?: string;
  disabled?: boolean;
  [x: string]: any;
};

const LINKS: { [variant: string]: string } = {
  primary: "text-blue-500 hover:text-blue-700",
  light: "text-gray-200 hover:text-gray-700",
  success: "text-green-400 hover:text-green-800",
};

function ActionLink({
  variant,
  children,
  className,
  group,
  to,
  disabled,
  ...props
}: Props) {
  const linkClasses = `${LINKS[variant]} underline cursor-pointer leading-4 ${
    className || ""
  }`;
  const disabledClasses = disabled
    ? `${linkClasses} opacity-50 cursor-not-allowed`
    : linkClasses;

  return to && !disabled ? (
    <Link to={to} className={disabledClasses} {...props}>
      {children}
    </Link>
  ) : (
    <a className={disabledClasses} {...props}>
      {children}
    </a>
  );
}

export default ActionLink;
