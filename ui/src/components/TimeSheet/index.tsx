import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  format,
  startOfWeek,
  startOfMonth,
  addMonths,
  parse,
  endOfMonth,
} from "date-fns";
import { useLocation } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";

import {
  TimeSlipContext,
  getTimeSheet,
  getUpdatedTimeSheetHours,
  saveTimeSheet,
  TimeSheetType,
  TimeSlipEntry,
} from "components/TimeSheet/TimeSlipContext";
import TimeSheetGrid from "components/TimeSheet/TimeSheetGrid";
import Actions from "components/TimeSheet/Actions";

const getStartDate = (search: string): Date => {
  const searchParams = new URLSearchParams(search);
  const dateStr = searchParams.get("date");
  const date = dateStr ? parse(dateStr, "yyyy-MM-dd", new Date()) : new Date();

  return startOfWeek(date, { weekStartsOn: 1 });
};

interface Props {
  user: models.User;
  projects: models.Project[];
  tasks: models.Task[];
}

function TimeSheet({ user, projects, tasks }: Props) {
  const search = useLocation().search;
  const [isLoading, setIsLoading] = useState(true);
  const [timeSheet, setTimeSheet] = useState<TimeSheetType>({});
  const startDate = useMemo(() => {
    return getStartDate(search);
  }, [search]);

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      const timeSlipResponse = await api.listTimeSlips({
        start: format(startOfMonth(addMonths(startDate, -1)), "yyyy-MM-dd"),
        end: format(endOfMonth(addMonths(startDate, 1)), "yyyy-MM-dd"),
      });

      setTimeSheet(
        getTimeSheet(startDate, tasks, timeSlipResponse.results || [])
      );
      setIsLoading(false);
    };

    load();
  }, [startDate, tasks]);

  const updateHours = useCallback(
    (entry: TimeSlipEntry, hours: string) => {
      setTimeSheet(getUpdatedTimeSheetHours(user, timeSheet, entry, hours));
    },
    [user, timeSheet]
  );

  const save = useCallback(() => {
    saveTimeSheet(timeSheet);
  }, [timeSheet]);

  return (
    <TimeSlipContext.Provider value={{ updateHours }}>
      <div style={{ minWidth: "720px" }} className="px-3">
        <Actions onSave={save} />
        {isLoading ? (
          <p>Loading</p>
        ) : (
          <TimeSheetGrid
            user={user}
            startDate={startDate}
            timeSheet={timeSheet}
            projects={projects}
            tasks={tasks}
          />
        )}
      </div>
    </TimeSlipContext.Provider>
  );
}

export default TimeSheet;
