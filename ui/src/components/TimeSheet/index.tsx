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
}

function TimeSheet({ user, projects }: Props) {
  const search = useLocation().search;
  const [tasks, setTasks] = useState<models.Task[]>([]);
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

      const taskResponse = await api.listTasks({});
      const activeTasks = (taskResponse.results || []).filter(
        (task) => (task.hoursSpent || 0) > 0 || task.state === "OPEN"
      );
      setTasks(activeTasks);

      setTimeSheet(
        getTimeSheet(startDate, activeTasks, timeSlipResponse.results || [])
      );
      setIsLoading(false);
    };

    load();
  }, [startDate]);

  const updateHours = useCallback(
    (entry: TimeSlipEntry, hours: number) => {
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
