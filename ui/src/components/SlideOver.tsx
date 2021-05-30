import React from "react";

interface Props {
  children: React.ReactChild;
  isOpen: boolean;
  onClose: () => void;
}

function SlideOver({ children, isOpen, onClose }: Props) {
  const slideOver = isOpen ? "translate-x-0" : "translate-x-full";
  // <div className="fixed inset-y-0 right-0 pl-10 max-w-1/2 flex">

  return (
    <div
      className={`fixed top-0 bottom-0 right-0 w-full sm:w-1/2 max-w-md transform ease-in-out duration-300 ${slideOver}`}
    >
      {isOpen && (
        <div
          className="absolute top-0 left-12 sm:left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4 translate-x-1/2"
          onClick={onClose}
        >
          <button className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
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

      <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
        <div className="px-4 sm:px-6 mt-6 sm:mt-0">{children}</div>
      </div>
    </div>
  );
}

export default SlideOver;
