import React from "react";
import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  closeText?: string;
}

function SlideOver({ children, isOpen, onClose, className }: Props) {
  const slideOver = isOpen ? "translate-x-0" : "translate-x-full";

  return createPortal(
    <div
      className={`fixed top-0 bottom-0 right-0 w-full sm:w-1/2 max-w-md transform ease-in-out duration-300 ${slideOver} ${
        className || ""
      }`}
    >
      {isOpen && (
        <div
          className="absolute top-0 sm:left-0 pt-4 pr-2 flex sm:pr-4 translate-x-1/2 print:hidden"
          onClick={onClose}
        >
          <button className="rounded-md block text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white">
            <span className="sr-only">Close panel</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="h-full flex flex-col py-6 bg-white shadow-xl print:shadow-none overflow-y-scroll print:overflow-y-hidden print:overflow-hidden">
        <div className="px-4 sm:px-6 mt-6 sm:mt-0 pt-8">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default SlideOver;
