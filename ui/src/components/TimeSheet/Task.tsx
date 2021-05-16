import React, { useContext } from "react";

import * as models from "api/models";

import TimeSlip from "components/TimeSheet/TimeSlip";
import { TimeSlipContext } from "components/TimeSheet/TimeSlipContext";

interface Props {
  task: models.Task;
  dateRange: Date[];
}

function Task({ task, dateRange }: Props) {
  const { timeSheet } = useContext(TimeSlipContext);
  const entries = timeSheet.entries[task.id || -1] || [];

  return (
    <div className="border-2 border-grey-600 border-radius-sm flex">
      <div className="p-3 text-left flex-grow">
        {task.name}: {task.id}
      </div>

      {entries.map((entry) => (
        <TimeSlip timeSlipEntry={entry} key={entry.dateStr} />
      ))}
    </div>
  );
}

export default Task;
