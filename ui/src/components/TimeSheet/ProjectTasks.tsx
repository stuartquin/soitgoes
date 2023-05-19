import React, { useCallback, useContext, useMemo } from "react";
import { format, sub } from "date-fns";

import * as models from "api/models";

import Task from "components/TimeSheet/Task";
import { TimeSheetType } from "components/TimeSheet/TimeSlipContext";
import CopyIcon from "components/CopyIcon";
import { TimeSlipContext } from "components/TimeSheet/TimeSlipContext";

interface Props {
  tasks: models.Task[];
  project: models.Project;
  dateRange: Date[];
  weekTotal: number;
  monthTotal: number;
  timeSheet: TimeSheetType;
}

function ProjectTasks({
  tasks,
  weekTotal,
  monthTotal,
  project,
  dateRange,
  timeSheet,
}: Props) {
  const { updateHours } = useContext(TimeSlipContext);
  const projectTasks = useMemo(
    () => tasks.filter((t) => t.project === project.id),
    [tasks, project, timeSheet]
  );
  const startDate = dateRange[0];

  const handleCopy = useCallback(() => {
    const projectTime = projectTasks.map((t) => timeSheet[t.id || -1]);
    dateRange.forEach((date) => {
      const lastWeek = format(sub(date, { days: 7 }), "yyyy-MM-dd");
      const current = format(date, "yyyy-MM-dd");

      projectTime.forEach((p) => {
        const previousTimeslip = p[lastWeek].timeSlip;
        if (previousTimeslip.hours) {
          updateHours({ ...p[current] }, previousTimeslip.hours);
        }
      });
    });
  }, [projectTasks, dateRange, timeSheet, updateHours]);

  return (
    <div className="border-1 bg-gray-50 border-radius-sm my-4">
      <div className="bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-700 text-sm md:text-base text-left p-4 justify-between items-center">
        <div className="font-semibold w-full md:w-auto">{project.name}</div>
        <div className="flex items-center">
          <div className="flex sm:text-right sm:block">
            <div className="font-semibold text-xs md:text-sm">
              {weekTotal} hours
            </div>
            <div className="text-xs text-gray-400 ml-2">
              {monthTotal} hours in {format(startDate, "MMMM")}
            </div>
          </div>
          <CopyIcon
            className="w-6 h-6 ml-2 cursor-pointer"
            onClick={handleCopy}
          />
        </div>
      </div>
      {projectTasks.map((task) => (
        <div className="pl-4" key={task.id}>
          <Task
            timeSheet={timeSheet}
            project={project}
            dateRange={dateRange}
            task={task}
          />
        </div>
      ))}
    </div>
  );
}

export default ProjectTasks;
