import React, { useState, useEffect } from "react";
import { format, parse } from "date-fns";

import * as models from "api/models";
import { getClient } from "apiClient";

import TimeSheet from "components/TimeSheet";
import {
  TimeSlipContext,
  getTimeSheet,
  TimeSheetType,
  TimeSlipEntry,
} from "components/TimeSheet/TimeSlipContext";

interface Props {
  user: models.User;
}

function Main({ user }: Props) {
  const [projects, setProjects] = useState<models.Project[]>([]);
  const [timeSheet, setTimeSheet] = useState<TimeSheetType>({
    entries: {},
    dateRange: [],
    tasks: [],
  });

  useEffect(() => {
    const load = async () => {
      const startDate = parse("2021-05-01", "yyyy-MM-dd", new Date());
      const api = getClient();
      const response = await api.listProjects({});
      setProjects(response.results || []);

      const taskResponse = await api.listTasks({});
      const timeSlipResponse = await api.listTimeSlips({
        start: format(startDate, "yyyy-MM-dd"),
      });

      setTimeSheet(
        getTimeSheet(
          startDate,
          taskResponse.results || [],
          timeSlipResponse.results || []
        )
      );
    };

    load();
  }, []);

  const updateHours = (entry: TimeSlipEntry, hours: string) => {
    const { timeSlip, dateStr } = entry;
    const taskId = timeSlip.task || -1;
    const { entries } = timeSheet;
    const index = entries[taskId].findIndex((e) => e.dateStr === dateStr);

    entries[taskId][index] = {
      ...entry,
      updated: true,
      timeSlip: {
        ...timeSlip,
        hours,
      },
    };

    setTimeSheet({
      ...timeSheet,
      entries: {
        ...entries,
        [taskId]: [...entries[taskId]],
      },
    });
  };

  return (
    <TimeSlipContext.Provider value={{ timeSheet, updateHours }}>
      <div className="Main">
        {projects.length && (
          <TimeSheet
            user={user}
            projects={projects.filter((p) => !p.archived)}
          />
        )}
      </div>
    </TimeSlipContext.Provider>
  );
}

export default Main;
