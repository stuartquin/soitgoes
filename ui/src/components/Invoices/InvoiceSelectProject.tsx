import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/outline";

import * as models from "api/models";
import { formatCurrency } from "currency";
import { ensure } from "typeHelpers";

interface Props {
  projects: models.Project[];
  projectSummaries: models.ProjectSummary[];
}

function InvoiceSelectProject({ projects, projectSummaries }: Props) {
  const projectsWithSummary = projectSummaries
    .map((summary) => {
      return {
        project: ensure(projects.find((p) => p.id === summary.project)),
        summary,
      };
    })
    .filter(({ project }) => !project.archived);

  return (
    <div>
      {projectsWithSummary.map(({ project, summary }) => (
        <Link
          to={`/invoices/${summary.project}`}
          className={`cursor-pointer flex justify-between hover:bg-blue-50 shadow overflow-hidden border-b border-gray-200 bg-white sm:rounded-lg my-4`}
          key={summary.project}
        >
          <div className="flex justify-between flex-grow items-center">
            <div className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-800">{project.name}</div>
              <div className="text-sm text-gray-500">{summary.hours} Hours</div>
            </div>
            <div className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm md:text-lg text-gray-800">
                {formatCurrency(summary.total || 0)}
              </div>
            </div>
          </div>
          <ChevronRightIcon className="w-4 mr-2" />
        </Link>
      ))}
    </div>
  );
}

export default InvoiceSelectProject;
