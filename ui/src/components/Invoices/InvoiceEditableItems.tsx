import React, { useMemo } from "react";

import InvoiceToggleableItem from "components/Invoices/InvoiceToggleableItem";
import * as models from "api/models";

interface GroupedTimeSlip {
  timeSlip: models.TimeSlip;
  task: models.Task;
}

interface Props {
  tasks: models.Task[];
  timeSlips: models.TimeSlip[];
  invoice: models.Invoice;
  project: models.Project;
  onToggleTimeSlip: (timeSlip: models.TimeSlip) => void;
}

function InvoiceEditableItems({
  invoice,
  project,
  tasks,
  timeSlips,
  onToggleTimeSlip,
}: Props) {
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
        <div className="flex sm:w-1/4 justify-between mr-8">
          <div className="text-sm mr-3">Hours</div>
          <div className="text-sm">Total</div>
        </div>
      </div>
      {groupedTimeSlips.map(({ task, timeSlip }) => (
        <InvoiceToggleableItem
          task={task}
          timeSlip={timeSlip}
          invoice={invoice}
          project={project}
          onToggleTimeSlip={onToggleTimeSlip}
        />
      ))}
    </div>
  );
}

export default InvoiceEditableItems;
