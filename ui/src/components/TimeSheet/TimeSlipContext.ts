import { createContext } from "react";
import { groupBy, range } from "lodash";
import { format, addDays, addHours } from "date-fns";
import { startOfDay, startOfMonth } from "date-fns";

import { getClient } from "apiClient";
import * as models from "api/models";

const getDateRange = (date: Date): Date[] => {
  const startDate = startOfMonth(date);
  console.log(startDate);
  return range(64).map((day) => addHours(addDays(startDate, day - 1), 2));
};

export type TimeSlipEntry = {
  timeSlip: models.TimeSlip;
  updated: boolean;
  date: Date;
};

export type TimeSheetType = {
  entries: {
    [taskId: number]: {
      [dateStr: string]: TimeSlipEntry;
    };
  };
  tasks: models.Task[];
};

export type TimeSlipContextType = {
  timeSheet: TimeSheetType;
  updateHours: (entry: TimeSlipEntry, hours: string) => void;
};

export const TimeSlipContext = createContext<TimeSlipContextType>({
  timeSheet: { entries: {}, tasks: [] },
  updateHours: (entry: TimeSlipEntry, hours: string) => null,
});

export const getTimeSheet = (
  start: Date,
  tasks: models.Task[],
  timeSlips: models.TimeSlip[]
): TimeSheetType => {
  const dateRange = getDateRange(start);
  const groupedByTask = groupBy(timeSlips, "task");

  const entries = tasks.reduce((acc, task: models.Task) => {
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
      }),
    };
  }, {});

  return {
    entries,
    tasks,
  };
};

export const getUpdatedTimeSheetHours = (
  user: models.User,
  timeSheet: TimeSheetType,
  entry: TimeSlipEntry,
  hours: string
): TimeSheetType => {
  const { timeSlip, date } = entry;
  const dateStr = format(date, "yyyy-MM-dd");
  const taskId = timeSlip.task || -1;
  const { entries } = timeSheet;

  entries[taskId][dateStr] = {
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
    entries: {
      ...entries,
      [taskId]: { ...entries[taskId] },
    },
  };
};

export const getUpdatedTimeSlips = (
  timeSheet: TimeSheetType
): models.TimeSlip[] => {
  const { entries } = timeSheet;
  return Object.values(entries)
    .reduce(
      (acc, val) => [...acc, ...Object.values(val)],
      [] as TimeSlipEntry[]
    )
    .filter((entry) => entry.updated)
    .map((entry) => entry.timeSlip);
};

export const saveTimeSheet = (
  timeSheet: TimeSheetType
): Promise<models.TimeSlip[]> => {
  const updated = getUpdatedTimeSlips(timeSheet);
  const api = getClient();

  const requests = updated.map((timeSlip) => {
    return timeSlip.id
      ? api.updateTimeSlip({
          id: String(timeSlip.id),
          timeSlip,
        })
      : api.createTimeSlip({ timeSlip });
  });

  return Promise.all(requests);
};
