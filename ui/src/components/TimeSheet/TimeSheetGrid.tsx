import React, { useContext, useMemo } from "react";
import { range } from "lodash";
import { format, addDays, addHours } from "date-fns";

import * as models from "api/models";

import DateRange from "components/TimeSheet/DateRange";
import ProjectTasks from "components/TimeSheet/ProjectTasks";
import Button from "components/Button";
import { TimeSlipContext } from "components/TimeSheet/TimeSlipContext";

interface Props {
  user: models.User;
  startDate: Date;
  projects: models.Project[];
}

function TimeSheetGrid({ user, startDate, projects }: Props) {
  const { timeSheet } = useContext(TimeSlipContext);
  const { tasks = [] } = timeSheet;
  const dateRange = useMemo(() => {
    return range(7).map((day) => addHours(addDays(startDate, day), 12));
  }, [startDate]);

  const prevDateStr = format(addDays(startDate, -7), "yyyy-MM-dd");
  const nextDateStr = format(addDays(startDate, 7), "yyyy-MM-dd");

  const projectList = projects
    .map((project) => {
      return { project, tasks: tasks.filter((t) => t.project === project.id) };
    })
    .filter(({ tasks }) => tasks.length);

  return (
    <div className="p-3">
      <div className="flex items-center">
        <div className="flex-grow w-48 md:w-64 flex items-center">
          <Button
            variant="light"
            to={`/?date=${prevDateStr}`}
            className="rounded-l"
            group="left"
          >
            Prev
          </Button>
          <Button variant="light" to={`/?date=${nextDateStr}`} group="right">
            Next
          </Button>
        </div>
        <DateRange dateRange={dateRange} />
      </div>
      {projectList.map(({ project, tasks }) => (
        <ProjectTasks
          dateRange={dateRange}
          project={project}
          tasks={tasks}
          key={project.id}
        />
      ))}
    </div>
  );
}

export default TimeSheetGrid;
