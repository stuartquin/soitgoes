import { createContext } from "react";
import { groupBy, range } from "lodash";
import { format, addDays, addHours, startOfMonth, endOfMonth } from "date-fns";

import { getClient } from "apiClient";
import * as models from "api/models";
import { ensure } from "typeHelpers";

const getDateRange = (date: Date): Date[] => {
  const startDate = addDays(startOfMonth(date), -7);
  return range(56).map((day) => addHours(addDays(startDate, day - 1), 2));
};

export type TimeSlipEntry = {
  timeSlip: models.TimeSlip;
  updated: boolean;
  date: Date;
};

export type TimeSheetType = {
  [taskId: number]: {
    [dateStr: string]: TimeSlipEntry;
  };
};

export type TimeSlipContextType = {
  updateHours: (entry: TimeSlipEntry, hours: number) => void;
};

export const TimeSlipContext = createContext<TimeSlipContextType>({
  updateHours: (entry: TimeSlipEntry, hours: number) => null,
});

export const getUpdatedTimeSheet = (
  timeSheet: TimeSheetType,
  timeSlips: models.TimeSlip[]
): TimeSheetType => {
  const updated = { ...timeSheet };

  timeSlips.forEach((timeSlip) => {
    const taskId = ensure(timeSlip.task);
    const dateStr = format(timeSlip.date, "yyyy-MM-dd");
    updated[taskId] = {
      ...updated[taskId],
      [dateStr]: {
        timeSlip,
        updated: false,
        date: timeSlip.date,
      },
    };
  });
  return updated;
};

export const getTimeSheet = (
  start: Date,
  tasks: models.Task[],
  timeSlips: models.TimeSlip[]
): TimeSheetType => {
  const dateRange = getDateRange(start);
  const groupedByTask = groupBy(timeSlips, "task");

  return tasks.reduce((acc, task: models.Task) => {
    const groupedByDate = groupBy(groupedByTask[task.id || ""] || [], (ts) =>
      format(ts.date, "yyyy-MM-dd")
    );

    return {
      ...acc,
      [task.id || ""]: dateRange.reduce((dateEntries, date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const existing = groupedByDate[dateStr] && groupedByDate[dateStr][0];
        const ts = existing || {
          project: task.project,
          task: task.id,
          date,
        };

        return {
          ...dateEntries,
          [dateStr]: {
            timeSlip: ts,
            updated: false,
            date,
          },
        };
      }, {}),
    };
  }, {});
};

export const getUpdatedTimeSheetHours = (
  user: models.User,
  timeSheet: TimeSheetType,
  entry: TimeSlipEntry,
  hours: number
): TimeSheetType => {
  const { timeSlip, date } = entry;
  const dateStr = format(date, "yyyy-MM-dd");
  const taskId = timeSlip.task || -1;

  timeSheet[taskId][dateStr] = {
    ...entry,
    updated: true,
    timeSlip: {
      ...timeSlip,
      user: user.id || -1,
      hours,
    },
  };

  return {
    ...timeSheet,
    [taskId]: { ...timeSheet[taskId] },
  };
};

export const getUpdatedTimeSlips = (
  timeSheet: TimeSheetType
): models.TimeSlip[] => {
  return Object.values(timeSheet)
    .reduce(
      (acc, val) => [...acc, ...Object.values(val)],
      [] as TimeSlipEntry[]
    )
    .filter((entry) => entry.updated)
    .map((entry) => entry.timeSlip);
};

export const saveTimeSheet = async (
  timeSheet: TimeSheetType
): Promise<models.TimeSlip[]> => {
  const updated = getUpdatedTimeSlips(timeSheet);
  const api = getClient();

  await Promise.all(
    updated
      .filter((timeSlip) => timeSlip.id && !timeSlip.hours)
      .map((timeSlip) => api.destroyTimeSlip({ id: String(timeSlip.id) }))
  );

  return Promise.all(
    updated
      .filter((timeSlip) => timeSlip.hours)
      .map((timeSlip) => {
        return timeSlip.id
          ? api.updateTimeSlip({
              id: String(timeSlip.id),
              timeSlip: { ...timeSlip, hours: timeSlip.hours || 0 },
            })
          : api.createTimeSlip({ timeSlip });
      })
  );
};

export type WeekMonthTotals = {
  week: number;
  month: number;
};

export const getTotalsByProject = (
  startDate: Date,
  projects: models.Project[],
  timeSlips: models.TimeSlip[]
) => {
  const monthStartDate = startOfMonth(startDate);
  const monthEndDate = endOfMonth(startDate);
  const weekEndDate = addDays(startDate, 7);

  const byProject: { [project: number]: WeekMonthTotals } = projects.reduce(
    (acc, project) => ({
      ...acc,
      [project.id || -1]: {
        week: 0,
        month: 0,
      },
    }),
    {}
  );

  timeSlips.forEach((ts) => {
    const group = byProject[ts.project];

    if (group) {
      if (ts.hours && ts.date >= startDate && ts.date <= weekEndDate) {
        group.week += ts.hours || 0;
      }

      if (ts.hours && ts.date >= monthStartDate && ts.date <= monthEndDate) {
        group.month += ts.hours || 0;
      }
    }
  });

  return byProject;
};
