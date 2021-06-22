import React from "react";

function TimeSheetLoading() {
  return (
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="flex my-4">
          <div className="h-12 bg-gray-100 rounded mr-16 w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded flex-grow"></div>
        </div>
        <div className="my-16">
          <div className="h-64 bg-gray-200 rounded my-4"></div>
        </div>
        <div className="my-16">
          <div className="h-64 bg-gray-100 rounded my-4"></div>
        </div>
      </div>
    </div>
  );
}

export default TimeSheetLoading;
