import React, { useContext, useMemo } from "react";
import { range, groupBy } from "lodash";
import { format, addDays, addHours } from "date-fns";

import * as models from "api/models";

import Task from "components/TimeSheet/Task";
import DateRange from "components/TimeSheet/DateRange";
import { TimeSlipContext } from "components/TimeSheet/TimeSlipContext";

const getProject = (
  taskProjects: { [projectId: number]: models.Project[] },
  projectId: number
): models.Project => {
  const project = taskProjects[projectId] || [];
  return project[0] || {};
};

interface Props {
  user: models.User;
  startDate: Date;
  projects: models.Project[];
}

function TimeSheet({ user, startDate, projects }: Props) {
  const { timeSheet } = useContext(TimeSlipContext);
  const { tasks } = timeSheet;
  const taskProjects = groupBy(projects, "id");
  const dateRange = useMemo(() => {
    console.log("Re-crunch Date Range");
    return range(7).map((day) => addHours(addDays(startDate, day), 12));
  }, [startDate]);

  return (
    <div className="p-3">
      <div className="flex">
        <div className="flex-grow min-w-1/3 max-w-1/2" />
        <DateRange dateRange={dateRange} />
      </div>
      <div>
        {tasks.map((task) => (
          <Task
            key={task.id}
            project={getProject(taskProjects, task.project || -1)}
            dateRange={dateRange}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}

export default TimeSheet;
