import React, { useContext } from "react";

import * as models from "api/models";

import TimeSlip from "components/TimeSheet/TimeSlip";
import { TimeSlipContext } from "components/TimeSheet/TimeSlipContext";

interface Props {
  task: models.Task;
  project: models.Project;
  dateRange: Date[];
}

function Task({ task, project, dateRange }: Props) {
  const { timeSheet } = useContext(TimeSlipContext);
  const entries = timeSheet.entries[task.id || -1] || [];

  return (
    <div className="border-1 border-grey-400 border-radius-sm flex my-1">
      <div className="flex flex-grow flex-wrap py-2 text-gray-700 text-sm md:text-base text-left min-w-1/3 max-w-1/3">
        <div className="font-semibold w-full md:w-auto">{project.name}</div>
        <div className="mx-2 hidden md:block">―</div>
        <div className="text-left">
          {task.name} : {task.id}
        </div>
      </div>

      <div className="flex">
        {entries.map((entry) => (
          <TimeSlip timeSlipEntry={entry} key={entry.dateStr} />
        ))}
      </div>
    </div>
  );
}

export default Task;
