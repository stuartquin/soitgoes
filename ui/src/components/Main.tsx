import React, { useCallback, useState, useEffect } from "react";
import {
  startOfWeek,
  endOfMonth,
  startOfMonth,
  addMonths,
  format,
  parse,
} from "date-fns";

import * as models from "api/models";
import { getClient } from "apiClient";

import TimeSheet from "components/TimeSheet";
import {
  TimeSlipContext,
  getTimeSheet,
  getUpdatedTimeSheetHours,
  saveTimeSheet,
  TimeSheetType,
  TimeSlipEntry,
} from "components/TimeSheet/TimeSlipContext";

interface Props {
  user: models.User;
}

const getStartDate = (search: string): Date => {
  const searchParams = new URLSearchParams(search);
  const dateStr = searchParams.get("date");
  const date = dateStr ? parse(dateStr, "yyyy-MM-dd", new Date()) : new Date();

  return startOfWeek(date, { weekStartsOn: 1 });
};

function Main({ user }: Props) {
  const [projects, setProjects] = useState<models.Project[]>([]);
  const [timeSheet, setTimeSheet] = useState<TimeSheetType>({
    entries: {},
    dateRange: [],
    tasks: [],
  });

  const search = window.location.search;

  useEffect(() => {
    const load = async () => {
      const startDate = getStartDate(search);
      const api = getClient();
      const response = await api.listProjects({});
      setProjects(response.results || []);

      const taskResponse = await api.listTasks({});
      const timeSlipResponse = await api.listTimeSlips({
        start: format(startOfMonth(addMonths(startDate, -1)), "yyyy-MM-dd"),
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
  }, [search]);

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
    <TimeSlipContext.Provider value={{ timeSheet, updateHours }}>
      <div className="Main">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={save}
        >
          Save
        </button>

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
