import React from "react";
import { sumBy } from "lodash";

import * as models from "api/models";
import { formatCurrency } from "currency";

interface Props {
  project: models.Project;
  timeSlips: models.TimeSlip[];
  task: models.Task;
  children?: React.ReactNode;
}

const getFormattedHours = (hours: number): string => {
  return hours.toFixed(2).replace(".", ":");
};

function InvoiceTaskItem({ timeSlips, task, project, children }: Props) {
  const hourlyRate = timeSlips.length ? timeSlips[0].hourlyRate : 0;
  const totalHours = sumBy(timeSlips, "hours");
  const totalCost =
    task.billingType === models.TaskBillingTypeEnum.Fixed
      ? task.cost
      : totalHours * (hourlyRate || 0);

  return (
    <div className="flex my-3 px-2 sm:px-4 justify-between items-center">
      <div className="flex flex-wrap items-center flex-grow">
        <div className="text-gray-800 text-sm md:text-lg mr-2 w-full sm:w-auto">
          {task.name}
        </div>
      </div>
      <div className="flex min-w-1/4 justify-between">
        <div className="text-sm mr-3">{getFormattedHours(totalHours)}</div>
        <div className="text-sm">{formatCurrency(totalCost || 0)}</div>
      </div>
      {children}
    </div>
  );
}

export default InvoiceTaskItem;
