import React, { useMemo } from "react";

import * as models from "api/models";
import InvoiceToggleableItem from "components/Invoices/InvoiceToggleableItem";
import {
  getActiveTasks,
  TimeSlipTask,
  getGroupedByTask,
  getGroupedByTime,
} from "invoices";

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
  const items = useMemo(() => getGroupedByTime(tasks, timeSlips), [
    tasks,
    timeSlips,
  ]);
  const activeTasks = getActiveTasks(invoice, timeSlips, tasks);
  const timeSlipTaskIds = new Set(timeSlips.map((t) => t.task));
  const invoiceTasks = tasks.filter((t) => invoice.tasks.includes(t.id || 0));
  const timeSlipTasks = tasks.filter((t) => timeSlipTaskIds.has(t.id || 0));
  const tasksGrouping =
    invoice.groupBy === models.InvoiceGroupByEnum.Tasks
      ? timeSlipTasks.concat(invoiceTasks)
      : invoiceTasks;
  const tasksGroup = getGroupedByTask(tasksGrouping, timeSlips);

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
          {items.map((item) => (
            <InvoiceToggleableItem
              key={item.id}
              item={item}
              invoice={invoice}
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
            <div className="flex sm:w-1/4 justify-end mr-8">
              <div className="text-sm">Total</div>
            </div>
          </div>
          {tasksGroup.map((item) => (
            <InvoiceToggleableItem
              key={item.id}
              item={item}
              invoice={invoice}
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
