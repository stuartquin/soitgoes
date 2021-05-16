import { createContext } from "react";
import { groupBy } from "lodash";
import { format, addDays, addHours } from "date-fns";

import { getClient } from "apiClient";
import * as models from "api/models";

const getDateRange = (start: Date): Date[] => {
  return [0, 1, 2, 3, 4, 5, 6].map((day) => addHours(addDays(start, day), 12));
};

export type TimeSlipEntry = {
  timeSlip: models.TimeSlip;
  updated: boolean;
  dateStr: string;
};

export type TimeSheetType = {
  entries: {
    [taskId: number]: TimeSlipEntry[];
  };
  dateRange: Date[];
  tasks: models.Task[];
};

export type TimeSlipContextType = {
  timeSheet: TimeSheetType;
  updateHours: (entry: TimeSlipEntry, hours: string) => void;
};

export const TimeSlipContext = createContext<TimeSlipContextType>({
  timeSheet: { entries: {}, dateRange: [], tasks: [] },
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

    const dateEntries = dateRange.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const existing = groupedByDate[dateStr] && groupedByDate[dateStr][0];
      const ts = existing || {
        project: task.project,
        task: task.id,
        date,
      };

      return {
        timeSlip: ts,
        updated: false,
        dateStr,
      };
    });

    return {
      ...acc,
      [task.id || ""]: dateEntries,
    };
  }, {});

  return {
    entries,
    tasks,
    dateRange,
  };
};

export const getUpdatedTimeSheetHours = (
  user: models.User,
  timeSheet: TimeSheetType,
  entry: TimeSlipEntry,
  hours: string
): TimeSheetType => {
  const { timeSlip, dateStr } = entry;
  const taskId = timeSlip.task || -1;
  const { entries } = timeSheet;
  const index = entries[taskId].findIndex((e) => e.dateStr === dateStr);

  entries[taskId][index] = {
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
      [taskId]: [...entries[taskId]],
    },
  };
};

export const getUpdatedTimeSlips = (
  timeSheet: TimeSheetType
): models.TimeSlip[] => {
  const { entries } = timeSheet;
  return Object.values(entries)
    .reduce((acc, values) => [...acc, ...values], [])
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
