import { useMemo } from "react";
import { isWithinInterval } from "date-fns";

import { TrackedTime } from "apiv3";
import {
  getDate,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
} from "lib/date";

interface Props {
  trackedTimes: TrackedTime[];
}

function durationSeconds(tt: TrackedTime): number {
  if (tt.ended_at) {
    const start = getDate(tt.started_at).getTime();
    const end = getDate(tt.ended_at).getTime();
    return Math.max(0, (end - start) / 1000);
  }
  // Still in progress: count up to now.
  const start = getDate(tt.started_at).getTime();
  return Math.max(0, (Date.now() - start) / 1000);
}

function formatHours(seconds: number): string {
  const hours = seconds / 3600;
  return `${hours.toFixed(2)}h`;
}

function TrackingSummaryPanel({ trackedTimes }: Props) {
  const { weekHours, monthHours } = useMemo(() => {
    const now = new Date();
    const weekInterval = {
      start: getStartOfWeek(now),
      end: getEndOfWeek(now),
    };
    const monthInterval = {
      start: getStartOfMonth(now),
      end: getEndOfMonth(now),
    };

    let weekSeconds = 0;
    let monthSeconds = 0;

    trackedTimes.forEach((tt) => {
      const startedAt = getDate(tt.started_at);
      if (isWithinInterval(startedAt, weekInterval)) {
        weekSeconds += durationSeconds(tt);
      }
      if (isWithinInterval(startedAt, monthInterval)) {
        monthSeconds += durationSeconds(tt);
      }
    });

    return {
      weekHours: formatHours(weekSeconds),
      monthHours: formatHours(monthSeconds),
    };
  }, [trackedTimes]);

  return (
    <div className="border bg-gray-50 rounded p-4 space-y-5">
      <h3 className="font-semibold text-gray-700 text-sm md:text-base">
        Time Tracking
      </h3>
      <div>
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span className="text-gray-600 text-sm">This week</span>
          <span className="text-sm font-medium text-gray-800">{weekHours}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
          <span className="text-gray-600 text-sm">This month</span>
          <span className="text-sm font-medium text-gray-800">{monthHours}</span>
        </div>
      </div>
    </div>
  );
}

export default TrackingSummaryPanel;
