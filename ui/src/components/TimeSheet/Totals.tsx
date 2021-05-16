import React, { useContext } from "react";
import { groupBy } from "lodash";
import { endOfMonth, startOfMonth } from "date-fns";

import * as models from "api/models";

import {
  TimeSlipEntry,
  TimeSlipContext,
} from "components/TimeSheet/TimeSlipContext";

const getProject = (
  projects: models.Project[],
  projectId: number
): models.Project => {
  return projects.find((p) => p.id === projectId) || ({} as models.Project);
};

const getTotal = (timeSlips: models.TimeSlip[], projectId: number): number => {
  return timeSlips.reduce(
    (acc, ts) => acc + parseFloat(ts.hours || "") || 0,
    0.0
  );
};

interface Props {
  projects: models.Project[];
  startDate: Date;
}

function Totals({ projects, startDate }: Props) {
  const { timeSheet } = useContext(TimeSlipContext);
  const { entries } = timeSheet;
  const monthStartDate = startOfMonth(startDate);
  const monthEndDate = endOfMonth(startDate);
  const monthTimeSlips = Object.values(entries)
    .reduce(
      (acc, entry) => [...acc, ...Object.values(entry)],
      [] as TimeSlipEntry[]
    )
    .map((entry) => entry.timeSlip)
    .filter(
      (ts) => ts.hours && ts.date >= monthStartDate && ts.date <= monthEndDate
    );

  const grouped = Object.entries(groupBy(monthTimeSlips, "project"));

  return (
    <div className="border-1 border-grey-400 border-radius-sm my-1">
      {grouped.map(([projectId, timeSlips]) => (
        <div className="flex my-1">
          <div>{getProject(projects, parseInt(projectId, 10)).name}</div>
          <div className="mx-2">
            {getTotal(timeSlips, parseInt(projectId, 10))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Totals;
