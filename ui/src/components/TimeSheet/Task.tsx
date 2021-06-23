import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import * as models from "api/models";

import TimeSlip from "components/TimeSheet/TimeSlip";
import { TimeSheetType } from "components/TimeSheet/TimeSlipContext";

interface Props {
  task: models.Task;
  project: models.Project;
  dateRange: Date[];
  timeSheet: TimeSheetType;
}

function Task({ task, timeSheet, project, dateRange }: Props) {
  const taskEntries = timeSheet[task.id || -1];
  const entries = useMemo(() => {
    return dateRange
      .map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return taskEntries[dateStr];
      })
      .filter((entry) => entry);
  }, [dateRange, taskEntries]);

  const url = `/time?task=${task.id}&date=${format(
    dateRange[0],
    "yyyy-MM-dd"
  )}`;

  return (
    <div className="border-1 border-grey-400 border-radius-sm flex py-1">
      <div
        className="py-2 text-left text-gray-700 text-sm md:text-base text-left w-48 md:w-64 truncate"
        style={{ minWidth: "140px" }}
      >
        <Link to={url}>{task.name}</Link>
      </div>

      <div className="flex flex-grow justify-end">
        {entries.map((entry) => (
          <TimeSlip timeSlipEntry={entry} key={entry.date.toISOString()} />
        ))}
      </div>
    </div>
  );
}

export default Task;
