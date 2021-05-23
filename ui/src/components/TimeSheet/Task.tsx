import React, { useContext, useMemo } from "react";
import { format } from "date-fns";

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
  const taskEntries = timeSheet.entries[task.id || -1];
  const entries = useMemo(() => {
    return dateRange
      .map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return taskEntries[dateStr];
      })
      .filter((entry) => entry);
  }, [dateRange, taskEntries]);

  return (
    <div className="border-1 border-grey-400 border-radius-sm flex py-1">
      <div
        className="py-2 text-left text-gray-700 text-sm md:text-base text-left w-48 md:w-64"
        style={{ minWidth: "140px" }}
      >
        {task.name}
      </div>

      <div className="flex flex-grow">
        {entries.map((entry) => (
          <TimeSlip timeSlipEntry={entry} key={entry.date.toISOString()} />
        ))}
      </div>
    </div>
  );
}

export default Task;
