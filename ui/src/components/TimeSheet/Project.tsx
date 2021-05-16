import React from "react";

import * as models from "api/models";

interface Props {
  project: models.Project;
  tasks: models.Task[];
  dateRange: Date[];
}

function Project({ project, tasks, dateRange }: Props) {
  return (
    <div>
      <div className="border-2 border-blue-600 border-radius-sm flex">
        <div className="p-3 text-left flex-grow">{project.name}</div>
      </div>
    </div>
  );
}

export default Project;
