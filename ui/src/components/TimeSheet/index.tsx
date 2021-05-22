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
import Totals from "components/TimeSheet/Totals";

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
    <React.Fragment>
      <TimeSlipContext.Provider value={{ timeSheet, updateHours }}>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={save}
          >
            Save
          </button>
          <div className="flex">
            <TimeSheetGrid
              user={user}
              startDate={startDate}
              projects={projects.filter((p) => !p.archived)}
            />
            <Totals startDate={startDate} projects={projects} />
          </div>
        </div>
      </TimeSlipContext.Provider>
    </React.Fragment>
  );
}

export default TimeSheet;
