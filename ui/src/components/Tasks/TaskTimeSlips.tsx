import React from "react";
import { sumBy } from "lodash";

import * as models from "api/models";
import TaskTimeSlipItem from "components/Tasks/TaskTimeSlipItem";
import { formatHours } from "timeSlips";

interface Props {
  task: models.Task;
  timeSlips: models.TimeSlip[];
}

function TaskTimeSlips({ task, timeSlips }: Props) {
  const hours = sumBy(timeSlips, "hours");

  return (
    <div className="my-4">
      <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm text-left px-2 sm:px-4 justify-between items-center">
        <div>Time</div>
        <div>{formatHours(hours)} Hours</div>
      </div>
      {timeSlips.map((timeSlip) => (
        <TaskTimeSlipItem key={timeSlip.id} timeSlip={timeSlip} />
      ))}
    </div>
  );
}

export default TaskTimeSlips;
