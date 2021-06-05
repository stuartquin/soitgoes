import React, { useMemo } from "react";

import InvoiceDateItem from "components/Invoices/InvoiceDateItem";
import * as models from "api/models";

interface GroupedTimeSlip {
  timeSlip: models.TimeSlip;
  task: models.Task;
}

interface Props {
  tasks: models.Task[];
  timeSlips: models.TimeSlip[];
  project: models.Project;
}

function InvoiceDateItems({ project, tasks, timeSlips }: Props) {
  const groupedTimeSlips = useMemo(
    () =>
      timeSlips.map((timeSlip) => {
        return {
          timeSlip,
          task: tasks.find((t) => t.id === timeSlip.task),
        } as GroupedTimeSlip;
      }),
    [tasks, timeSlips]
  );

  return (
    <div className="my-4">
      <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm md:text-base text-left px-2 sm:px-4 justify-between items-center">
        <div className="text-sm">Date</div>
        <div className="flex sm:w-1/4 justify-between">
          <div className="text-sm mr-3">Hours</div>
          <div className="text-sm">Total</div>
        </div>
      </div>
      {groupedTimeSlips.map(({ task, timeSlip }) => (
        <InvoiceDateItem
          key={timeSlip.id}
          timeSlip={timeSlip}
          task={task}
          project={project}
        />
      ))}
    </div>
  );
}

export default InvoiceDateItems;
