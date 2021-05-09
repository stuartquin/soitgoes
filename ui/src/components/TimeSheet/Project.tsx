import React, { useMemo } from "react";
import { groupBy } from "lodash";
import { format, addDays } from "date-fns";

import * as models from "api/models";
import Task from "components/TimeSheet/Task";

interface Props {
  project: models.Project;
  tasks: models.Task[];
  timeSlips: models.TimeSlip[];
  start: Date;
}

const getDateRange = (start: Date): Date[] => {
  return [0, 2, 3, 4, 5, 6, 7].map((day) => addDays(start, day));
};

function Project({ project, tasks, timeSlips, start }: Props) {
  const taskTimeSlips = useMemo(() => groupBy(timeSlips, "task"), [timeSlips]);
  const dateRange = getDateRange(start);

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
        <Task
          task={task}
          timeSlips={taskTimeSlips[task.id || ""] || []}
          dateRange={dateRange}
        />
      ))}
    </div>
  );
}

export default Project;
