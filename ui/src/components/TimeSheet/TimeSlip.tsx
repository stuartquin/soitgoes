import React, { useCallback, useContext } from "react";

import {
  TimeSlipContext,
  TimeSlipEntry,
} from "components/TimeSheet/TimeSlipContext";

interface Props {
  timeSlipEntry: TimeSlipEntry;
}

function TimeSlip({ timeSlipEntry }: Props) {
  const { updateHours } = useContext(TimeSlipContext);
  const { timeSlip } = timeSlipEntry;
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateHours(timeSlipEntry, event.target.value);
    },
    [timeSlipEntry, updateHours]
  );

  const hours = parseInt(timeSlip.hours || "", 10) || "";

  return (
    <div>
      <input
        className="shadow appearance-none border border-grey-400 rounded w-16 p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-1 text-center"
        value={hours}
        onChange={handleChange}
      />
    </div>
  );
}

export default TimeSlip;
