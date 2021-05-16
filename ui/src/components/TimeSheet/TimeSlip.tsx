import React, { useContext } from "react";

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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateHours(timeSlipEntry, event.target.value);
  };

  return (
    <div>
      <input
        className="p-2 w-16"
        value={timeSlip.hours || ""}
        onChange={handleChange}
      />
    </div>
  );
}

export default TimeSlip;
