import React, { useMemo } from "react";

import InvoiceTaskItem from "components/Invoices/InvoiceTaskItem";
import * as models from "api/models";

interface GroupedTask {
  timeSlips: models.TimeSlip[];
  task: models.Task;
}

interface Props {
  tasks: models.Task[];
  timeSlips: models.TimeSlip[];
  project: models.Project;
}

function InvoiceTaskItems({ project, tasks, timeSlips }: Props) {
  const groupedTasks = useMemo(
    () =>
      tasks.map((task) => {
        return {
          task,
          timeSlips: timeSlips.filter((t) => t.task === task.id),
        } as GroupedTask;
      }),
    [tasks, timeSlips]
  );

  return (
    <div className="my-4">
      <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm md:text-base text-left px-2 sm:px-4 justify-between items-center">
        <div className="text-sm">Task</div>
        <div className="flex sm:w-1/4 justify-between">
          <div className="text-sm mr-3">Hours</div>
          <div className="text-sm">Total</div>
        </div>
      </div>
      {groupedTasks.map(({ task, timeSlips }) => (
        <InvoiceTaskItem
          key={task.id}
          timeSlips={timeSlips}
          task={task}
          project={project}
        />
      ))}
    </div>
  );
}

export default InvoiceTaskItems;
