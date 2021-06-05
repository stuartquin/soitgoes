import React from "react";

function InvoiceDetailLoading() {
  return (
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="flex my-4">
          <div className="h-20 bg-gray-200 rounded flex-grow"></div>
          <div className="h-20 bg-gray-100 rounded ml-4 w-1/4"></div>
        </div>
        <div className="my-16">
          <div className="h-6 bg-gray-200 rounded my-4"></div>
          <div className="h-6 bg-gray-100 rounded my-4"></div>
          <div className="h-6 bg-gray-200 rounded my-4"></div>
          <div className="h-6 bg-gray-100 rounded my-4"></div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetailLoading;
