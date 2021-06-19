import React, { useMemo } from "react";

import * as models from "api/models";
import InvoiceToggleableItem from "components/Invoices/InvoiceToggleableItem";
import { TimeSlipTask, getGroupedByTask, getGroupedByTime } from "invoices";

interface Props {
  tasks: models.Task[];
  timeSlips: models.TimeSlip[];
  invoice: models.Invoice;
  project: models.Project;
  onToggle: (item: TimeSlipTask) => void;
}

function InvoiceEditableItems({
  invoice,
  project,
  tasks,
  timeSlips,
  onToggle,
}: Props) {
  const timeSlipItems = useMemo(
    () => getGroupedByTime(invoice, tasks, timeSlips),
    [invoice, tasks, timeSlips]
  );
  const timeSlipTaskIds = new Set(timeSlipItems.map((t) => t.task.id));
  const fixedTasks = tasks.filter((t) => invoice.tasks.includes(t.id || 0));
  const activeTasks = tasks.filter((t) => timeSlipTaskIds.has(t.id || 0));
  const tasksGrouping =
    invoice.groupBy === models.InvoiceGroupByEnum.Tasks
      ? activeTasks.concat(fixedTasks)
      : fixedTasks;
  const tasksGroup = getGroupedByTask(invoice, tasksGrouping, timeSlips);

  return (
    <React.Fragment>
      {invoice.groupBy === models.InvoiceGroupByEnum.Timeslips && (
        <div className="my-4">
          <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm md:text-base text-left px-2 sm:px-4 justify-between items-center">
            <div className="text-sm">Date</div>
            <div className="flex sm:w-1/4 justify-between mr-8">
              <div className="text-sm mr-3">Hours</div>
              <div className="text-sm">Total</div>
            </div>
          </div>
          {timeSlipItems.map((item) => (
            <InvoiceToggleableItem
              key={item.id}
              item={item}
              project={project}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}

      {tasksGroup.length > 0 && (
        <div className="my-4">
          <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm md:text-base text-left px-2 sm:px-4 justify-between items-center">
            <div className="text-sm">Task</div>
            <div className="flex sm:w-1/4 justify-between mr-8">
              <div className="text-sm mr-3">Hours</div>
              <div className="text-sm">Total</div>
            </div>
          </div>
          {tasksGroup.map((item) => (
            <InvoiceToggleableItem
              key={item.id}
              item={item}
              project={project}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </React.Fragment>
  );
}

export default InvoiceEditableItems;
