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
  const [timeSheet, setTimeSheet] = useState<TimeSheetType>({
    entries: {},
    tasks: [],
  });
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
    <TimeSlipContext.Provider value={{ timeSheet, updateHours }}>
      <div style={{ minWidth: "720px" }} className="px-4">
        <Actions onSave={save} />
        <TimeSheetGrid
          user={user}
          startDate={startDate}
          projects={projects.filter((p) => !p.archived)}
        />
      </div>
    </TimeSlipContext.Provider>
  );
}

export default TimeSheet;
