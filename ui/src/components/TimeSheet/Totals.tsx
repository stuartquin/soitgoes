import React, { useContext } from "react";
import { groupBy } from "lodash";
import { format, endOfMonth, startOfMonth, addDays } from "date-fns";

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

  const timeSlips = Object.values(entries)
    .reduce(
      (acc, entry) => [...acc, ...Object.values(entry)],
      [] as TimeSlipEntry[]
    )
    .map((entry) => entry.timeSlip);

  const monthStartDate = startOfMonth(startDate);
  const monthEndDate = endOfMonth(startDate);
  const monthTimeSlips = timeSlips.filter(
    (ts) => ts.hours && ts.date >= monthStartDate && ts.date <= monthEndDate
  );

  const weekEndDate = addDays(startDate, 7);
  const weekTimeSlips = timeSlips.filter(
    (ts) => ts.hours && ts.date >= startDate && ts.date <= weekEndDate
  );

  const monthGrouped = Object.entries(groupBy(monthTimeSlips, "project"));
  const weekGrouped = Object.entries(groupBy(weekTimeSlips, "project"));

  return (
    <div className="text-left">
      <h5 className="text-md uppercase font-semibold leading-7 text-gray-900 sm:text-md sm:truncate mt-4">
        {format(monthStartDate, "MMMM yyyy")}
      </h5>
      <div>
        {monthGrouped.map(([projectId, timeSlips]) => (
          <div className="flex my-1 justify-between" key={projectId}>
            <div>{getProject(projects, parseInt(projectId, 10)).name}</div>
            <div className="mx-2">
              {getTotal(timeSlips, parseInt(projectId, 10))}
            </div>
          </div>
        ))}
      </div>
      <h5 className="text-md uppercase font-semibold leading-7 text-gray-900 sm:text-md sm:truncate mt-4">
        This Week
      </h5>
      <div>
        {weekGrouped.map(([projectId, timeSlips]) => (
          <div className="flex justify-between my-1" key={projectId}>
            <div>{getProject(projects, parseInt(projectId, 10)).name}</div>
            <div className="mx-2">
              {getTotal(timeSlips, parseInt(projectId, 10))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Totals;
