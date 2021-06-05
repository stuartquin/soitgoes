import React from "react";
import { format } from "date-fns";

import * as models from "api/models";
import { formatCurrency } from "currency";

interface Props {
  project: models.Project;
  timeSlip: models.TimeSlip;
  task: models.Task;
}

const getFormattedHours = (hours: number): string => {
  return hours.toFixed(2).replace(".", ":");
};

function InvoiceDateItem({ timeSlip, task, project }: Props) {
  return (
    <div className="flex my-3 px-2 sm:px-4 justify-between items-center">
      <div className="flex flex-wrap items-center flex-grow">
        <div className="text-gray-800 text-sm md:text-lg mr-2 w-full sm:w-auto">
          {format(timeSlip.date, "yyyy-MM-dd")}
        </div>
        <div className="text-gray-500 text-sm">{task.name}</div>
      </div>
      <div className="flex min-w-1/4 justify-between">
        <div className="text-sm mr-3">
          {getFormattedHours(timeSlip.hours || 0)}
        </div>
        <div className="text-sm">
          {formatCurrency(parseFloat(timeSlip.cost || "0"))}
        </div>
      </div>
    </div>
  );
}

export default InvoiceDateItem;
