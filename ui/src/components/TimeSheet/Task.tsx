import React, { useMemo } from "react";
import { groupBy } from "lodash";
import { format } from "date-fns";

import * as models from "api/models";

interface Props {
  task: models.Task;
  timeSlips: models.TimeSlip[];
  dateRange: Date[];
}

function Task({ task, timeSlips, dateRange }: Props) {
  const dateStrs = useMemo(
    () => dateRange.map((d) => format(d, "yyyy-MM-dd")),
    [dateRange]
  );

  const dateTimeSlips = useMemo(() => {
    const grouped = groupBy(timeSlips, (ts) => format(ts.date, "yyyy-MM-dd"));
    return dateStrs.map((dateStr) =>
      grouped[dateStr] ? grouped[dateStr][0] : ({} as models.TimeSlip)
    );
  }, [timeSlips, dateStrs]);

  console.log(dateTimeSlips);
  return (
    <div className="border-2 border-grey-600 border-radius-sm flex">
      <div className="p-3 text-left flex-grow">{task.name}</div>

      {dateStrs.map((dateStr, index) => (
        <div className="p-3 w-16" key={dateStr}>
          {dateTimeSlips[index].hours || 0}
        </div>
      ))}
    </div>
  );
}

export default Task;
