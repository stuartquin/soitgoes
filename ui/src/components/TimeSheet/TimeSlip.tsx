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
      updateHours(timeSlipEntry, parseFloat(event.target.value));
    },
    [timeSlipEntry, updateHours]
  );

  const disabled = Boolean(timeSlip.invoice);

  const hours = timeSlip.hours || 0;
  return (
    <div>
      <input
        className="shadow appearance-none border border-grey-300 rounded w-16 p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mx-1 text-center"
        value={hours || ""}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}

export default TimeSlip;
