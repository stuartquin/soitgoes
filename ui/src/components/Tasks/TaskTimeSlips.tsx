import React from "react";

import * as models from "api/models";
import TaskTimeSlipItem from "components/Tasks/TaskTimeSlipItem";

interface Props {
  task: models.Task;
  timeSlips: models.TimeSlip[];
}

function TaskTimeSlips({ task, timeSlips }: Props) {
  return (
    <div className="my-4">
      <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm text-left px-2 sm:px-4 justify-between items-center">
        Time
      </div>
      {timeSlips.map((timeSlip) => (
        <TaskTimeSlipItem timeSlip={timeSlip} />
      ))}
    </div>
  );
}

export default TaskTimeSlips;
