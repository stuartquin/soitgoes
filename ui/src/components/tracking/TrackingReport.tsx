import { useMemo } from "react";
import { format } from "date-fns";

import { TrackedTime, Project, Task } from "apiv3";
import {
  formatAbbreviated,
  getDate,
  getStartOfWeek,
  getEndOfWeek,
} from "lib/date";

interface Props {
  trackedTimes: TrackedTime[];
  projects: Project[];
  tasks: Task[];
  filters: {
    projectName: string;
    dateRange: string;
  };
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

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const mm = String(minutes).padStart(2, "0");
  return `${hours}h ${mm}m`;
}

function TrackingReport({ trackedTimes, projects, tasks, filters }: Props) {
  // Group by day ascending, compute per-day totals.
  // Group days ascending, then bucket days by calendar week
  // (Monday-start) with per-week totals.
  const groupedWeeks = useMemo(() => {
    const byDay = new Map<string, TrackedTime[]>();
    trackedTimes.forEach((tt) => {
      const dayKey = format(getDate(tt.started_at), "yyyy-MM-dd");
      const bucket = byDay.get(dayKey);
      if (bucket) bucket.push(tt);
      else byDay.set(dayKey, [tt]);
    });

    const days = [...byDay.entries()]
      .sort(([dayA], [dayB]) => dayA.localeCompare(dayB))
      .map(([dayKey, entries]) => {
        const sorted = [...entries].sort(
          (a, b) =>
            getDate(a.started_at).getTime() - getDate(b.started_at).getTime()
        );
        const dayTotal = sorted.reduce(
          (sum, tt) => sum + durationSeconds(tt),
          0
        );
        return { dayKey, entries: sorted, dayTotal };
      });

    const byWeek = new Map<string, { days: typeof days; weekTotal: number }>();
    days.forEach((day) => {
      const weekKey = format(getStartOfWeek(day.dayKey), "yyyy-MM-dd");
      const bucket = byWeek.get(weekKey);
      if (bucket) {
        bucket.days.push(day);
        bucket.weekTotal += day.dayTotal;
      } else {
        byWeek.set(weekKey, {
          days: [day],
          weekTotal: day.dayTotal,
        });
      }
    });

    return [...byWeek.entries()]
      .sort(([weekA], [weekB]) => weekA.localeCompare(weekB))
      .map(([weekKey, { days: weekDays, weekTotal }]) => ({
        weekKey,
        days: weekDays,
        weekTotal,
      }));
  }, [trackedTimes]);

  const grandTotal = useMemo(
    () => groupedWeeks.reduce((sum, w) => sum + w.weekTotal, 0),
    [groupedWeeks]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center mb-6 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="h-8 px-3 flex items-center justify-center rounded bg-blue-500 text-white text-sm font-medium transition-colors hover:bg-blue-600"
        >
          Print
        </button>
      </div>

      <div className="report-content">
        <div className="flex justify-between items-center">
          <div className="mb-2">
            <h1 className="text-lg font-semibold text-gray-800">
              Time report for {filters.projectName}
            </h1>
            <p className="text-sm text-gray-500">{filters.dateRange}</p>
          </div>
          <div>
            <div className="text-lg font-medium text-gray-800 tabular-nums">
              {formatDuration(grandTotal)}
            </div>
          </div>
        </div>

        {groupedWeeks.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            No tracked time for the selected filters.
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-gray-200 px-2 py-1 text-left bg-gray-100 font-semibold">
                  Date
                </th>
                <th className="border border-gray-200 px-2 py-1 text-right bg-gray-100 font-semibold">
                  Duration
                </th>
              </tr>
            </thead>
            {groupedWeeks.map(({ weekKey, days, weekTotal }) =>
              days.map(({ dayKey, dayTotal }, dayIndex) => {
                const isLastInWeek = dayIndex === days.length - 1;
                return (
                  <tbody key={dayKey}>
                    <tr>
                      <td className="px-2 py-2 text-sm">
                        {formatAbbreviated(dayKey)}
                      </td>
                      <td className="px-2 py-2 text-sm text-right tabular-nums">
                        {formatDuration(dayTotal)}
                      </td>
                    </tr>
                    {isLastInWeek && (
                      <tr
                        className="print:hidden"
                        style={{
                          background: "#F7F7F7",
                          color: "#7a7a7a",
                        }}
                      >
                        <td className="px-2 py-2 text-sm">Week total</td>
                        <td className="px-2 py-2 text-sm text-right tabular-nums">
                          {formatDuration(weekTotal)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })
            )}
            <tfoot>
              <tr>
                <td className="border border-gray-200 px-2 py-1 bg-gray-100 font-bold">
                  Total
                </td>
                <td className="border border-gray-200 px-2 py-1 bg-gray-100 font-bold text-right tabular-nums">
                  {formatDuration(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export default TrackingReport;
