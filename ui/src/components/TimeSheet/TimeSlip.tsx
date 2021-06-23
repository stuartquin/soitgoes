import React, { useCallback, useContext } from "react";

import Input from "components/Form/Input";

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
      <Input
        className="block mx-1 w-16 text-center"
        value={hours || ""}
        onChange={handleChange}
        disabled={disabled}
        type="tel"
      />
    </div>
  );
}

export default TimeSlip;
