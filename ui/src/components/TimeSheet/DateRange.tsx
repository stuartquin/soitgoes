import React from "react";
import { format } from "date-fns";

interface Props {
  dateRange: Date[];
}

function DateRange({ dateRange }: Props) {
  return (
    <div className="flex text-gray-500">
      {dateRange.map((date) => (
        <div className="text-center" key={date.toISOString()}>
          <div className="font-bold">{format(date, "EEEEE")}</div>
          <div className="text-sm mx-1 w-16">{format(date, "d LLL")}</div>
        </div>
      ))}
    </div>
  );
}

export default DateRange;
