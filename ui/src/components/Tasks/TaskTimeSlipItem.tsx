import React from "react";

import * as models from "api/models";
import { format } from "date-fns";
import { formatCurrency } from "currency";
import { formatHours } from "timeSlips";

interface Props {
  timeSlip: models.TimeSlip;
}

function TaskTimeSlipItem({ timeSlip }: Props) {
  return (
    <div className="flex my-3 px-2 sm:px-4 justify-between items-center">
      <div className="flex flex-wrap items-center flex-grow">
        <div className="text-gray-800 text-sm md:text-lg truncate w-3/4">
          {format(timeSlip.date, "yyyy-MM-dd")}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm md:text-lg text-gray-800">
          {formatCurrency(timeSlip.cost || 0)}
        </div>
        <div className="capitalize text-sm text-gray-600">
          {formatHours(timeSlip.hours || 0)} Hours
        </div>
      </div>
    </div>
  );
}

export default TaskTimeSlipItem;
