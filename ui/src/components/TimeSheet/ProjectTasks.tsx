import React, { useMemo } from "react";

import * as models from "api/models";

import Task from "components/TimeSheet/Task";

interface Props {
  tasks: models.Task[];
  project: models.Project;
  dateRange: Date[];
  weekTotal: number;
  monthTotal: number;
}

function ProjectTasks({
  tasks,
  weekTotal,
  monthTotal,
  project,
  dateRange,
}: Props) {
  const projectTasks = useMemo(
    () => tasks.filter((t) => t.project === project.id),
    [tasks, project]
  );

  return (
    <div className="border-1 bg-gray-50 border-radius-sm my-4">
      <div className="bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-700 text-sm md:text-base text-left p-4 justify-between items-center">
        <div className="font-semibold w-full md:w-auto">{project.name}</div>
        <div className="md:text-right">
          <div className="font-semibold text-sm">{weekTotal} hours</div>
          <div className="text-xs text-gray-400">
            {monthTotal} hours in April
          </div>
        </div>
      </div>
      {projectTasks.map((task) => (
        <div className="pl-4" key={task.id}>
          <Task project={project} dateRange={dateRange} task={task} />
        </div>
      ))}
    </div>
  );
}

export default ProjectTasks;
