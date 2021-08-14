import React from "react";
import { XIcon } from "@heroicons/react/outline";

type Props = {
  children: React.ReactNode;
  variant: string;
  className?: string;
  onDismiss?: () => void;
};

const VARIANTS: { [variant: string]: string } = {
  primary: "bg-blue-50 text-blue-400",
  light: "bg-gray-50 text-gray-700",
  success: "bg-green-50 text-green-800",
};

function Alert({ variant, children, className, onDismiss }: Props) {
  const variantClasses = `${VARIANTS[variant]} ${
    className || ""
  } relative p-3 sm:p-4`;

  return (
    <div className={variantClasses}>
      {onDismiss && (
        <XIcon
          className="w-4 h-4 absolute right-3 top-3 cursor-pointer"
          onClick={onDismiss}
        />
      )}

      {children}
    </div>
  );
}

export default Alert;
