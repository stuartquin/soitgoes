import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  format,
  startOfWeek,
  startOfMonth,
  addMonths,
  parse,
  endOfMonth,
} from "date-fns";
import { useHistory, useLocation } from "react-router-dom";

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
import TimeSheetLoading from "components/TimeSheet/TimeSheetLoading";
import Actions from "components/TimeSheet/Actions";
import SlideOver from "components/SlideOver";
import TaskDetail from "components/Tasks/TaskDetail";

const getStartDate = (dateStr: string): Date => {
  const date = dateStr ? parse(dateStr, "yyyy-MM-dd", new Date()) : new Date();

  return startOfWeek(date, { weekStartsOn: 1 });
};

interface Props {
  user: models.User;
  projects: models.Project[];
}

function TimeSheet({ user, projects }: Props) {
  const search = useLocation().search;
  const history = useHistory();
  const [tasks, setTasks] = useState<models.Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeSheet, setTimeSheet] = useState<TimeSheetType>({});
  const searchParams = new URLSearchParams(search);
  const dateStr = searchParams.get("date");
  const startDate = useMemo(() => {
    return getStartDate(dateStr || "");
  }, [dateStr]);

  const selectedTaskId = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return searchParams.get("task");
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

  const closeSlideOver = useCallback(() => {
    const url = `/time?date=${format(startDate, "yyyy-MM-dd")}`;
    history.push(url);
  }, [startDate, history]);

  const isOpen = Boolean(selectedTaskId);

  return (
    <TimeSlipContext.Provider value={{ updateHours }}>
      <div className="px-3 w-full">
        <Actions onSave={save} />
        {isLoading ? (
          <TimeSheetLoading />
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
      <SlideOver isOpen={isOpen} onClose={closeSlideOver}>
        <div>
          {selectedTaskId && (
            <TaskDetail taskId={selectedTaskId} projects={projects} />
          )}
        </div>
      </SlideOver>
    </TimeSlipContext.Provider>
  );
}

export default TimeSheet;
