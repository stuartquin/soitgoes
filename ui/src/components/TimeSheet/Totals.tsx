import React, { useContext } from "react";
import { groupBy } from "lodash";

import * as models from "api/models";

import { TimeSlipContext } from "components/TimeSheet/TimeSlipContext";

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
}

function Totals({ projects }: Props) {
  const { timeSheet } = useContext(TimeSlipContext);
  const { entries } = timeSheet;
  const timeSlips = Object.values(entries)
    .reduce((acc, values) => [...acc, ...values], [])
    .map((entry) => entry.timeSlip);

  const grouped = Object.entries(
    groupBy(
      timeSlips.filter((ts) => ts.hours),
      "project"
    )
  );

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
