import React from "react";
import { format } from "date-fns";

import * as models from "api/models";
import Task from "components/TimeSheet/Task";

interface Props {
  project: models.Project;
  tasks: models.Task[];
  dateRange: Date[];
}

function Project({ project, tasks, dateRange }: Props) {
  return (
    <div>
      <div className="border-2 border-blue-600 border-radius-sm flex">
        <div className="p-3 text-left flex-grow">{project.name}</div>
        {dateRange.map((date) => (
          <div className="p-3 w-16" key={date.toISOString()}>
            {format(date, "E")}
          </div>
        ))}
      </div>
      {tasks.slice(0, 5).map((task) => (
        <Task key={task.id} task={task} dateRange={dateRange} />
      ))}
    </div>
  );
}

export default Project;
