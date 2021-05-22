import React, { useContext, useMemo } from "react";
import { range, groupBy } from "lodash";
import { Link } from "react-router-dom";
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

function TimeSheetGrid({ user, startDate, projects }: Props) {
  const { timeSheet } = useContext(TimeSlipContext);
  const { tasks } = timeSheet;
  const taskProjects = groupBy(projects, "id");
  const dateRange = useMemo(() => {
    return range(7).map((day) => addHours(addDays(startDate, day), 12));
  }, [startDate]);

  const prevDateStr = format(addDays(startDate, -7), "yyyy-MM-dd");
  const nextDateStr = format(addDays(startDate, 7), "yyyy-MM-dd");

  return (
    <div className="p-3">
      <div className="flex">
        <div className="flex-grow min-w-1/3 max-w-1/2">
          <Link to={`/?date=${prevDateStr}`}>Prev</Link>
          <Link to={`/?date=${nextDateStr}`}>Next</Link>
        </div>
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

export default TimeSheetGrid;
