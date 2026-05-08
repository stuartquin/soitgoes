import { useCallback, useEffect, useMemo, useState } from "react";

import * as models from "api/models";

import {
  TimeSlipContext,
  getTimeSheet,
  getUpdatedTimeSheetHours,
  saveTimeSheet,
  TimeSheetType,
  TimeSlipEntry,
  getUpdatedTimeSheet,
} from "components/TimeSheet/TimeSlipContext";
import TimeSheetGrid from "components/TimeSheet/TimeSheetGrid";
import Actions from "components/TimeSheet/Actions";
import SlideOver from "components/SlideOver";
import TaskDetail from "components/Tasks/TaskDetail";
import { Task, TimeSlip } from "apiv3";
import { useSearch } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  listProjectSummariesOptions,
  listTimeSlipsOptions,
} from "apiv3/@tanstack/react-query.gen";

interface Props {
  user: models.User;
  projects: models.Project[];
  startDate: Date;
  timeSlips: TimeSlip[];
  tasks: Task[];
  onClose: (startDate: Date) => void;
}

function TimeSheet({
  user,
  projects,
  startDate,
  timeSlips,
  tasks,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const search = useSearch({ from: "/time" });
  const [timeSheet, setTimeSheet] = useState<TimeSheetType>(
    getTimeSheet(startDate, tasks, timeSlips)
  );

  const updateHours = useCallback(
    (entry: TimeSlipEntry, hours: number) => {
      setTimeSheet(getUpdatedTimeSheetHours(user, timeSheet, entry, hours));
    },
    [user, timeSheet]
  );

  const save = useCallback(async () => {
    const results = await saveTimeSheet(timeSheet);
    queryClient.invalidateQueries(listTimeSlipsOptions());
    queryClient.invalidateQueries(listProjectSummariesOptions());
    setTimeSheet(getUpdatedTimeSheet(timeSheet, results));
  }, [timeSheet]);

  const closeSlideOver = useCallback(() => {
    onClose(startDate);
  }, [onClose, startDate]);

  const activeTasks = useMemo(() => {
    return tasks.filter(
      (task) => (task.hours_spent || 0) > 0 || task.state === "OPEN"
    );
  }, [tasks]);

  useEffect(() => {
    setTimeSheet((timeSheet) => {
      return getUpdatedTimeSheet(timeSheet, timeSlips);
    });
  }, [timeSlips]);

  const activeProjects = projects.filter((p) => !p.archived);

  return (
    <TimeSlipContext.Provider value={{ updateHours }}>
      <div className="px-3 w-full">
        <Actions onSave={save} />
        <TimeSheetGrid
          user={user}
          startDate={startDate}
          timeSheet={timeSheet}
          projects={activeProjects}
          tasks={activeTasks}
        />
      </div>
      <SlideOver isOpen={Boolean(search.task)} onClose={closeSlideOver}>
        <div>
          {search.task && (
            <TaskDetail taskId={search.task} projects={activeProjects} />
          )}
        </div>
      </SlideOver>
    </TimeSlipContext.Provider>
  );
}

export default TimeSheet;
