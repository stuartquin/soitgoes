import React from "react";
import { Link, Switch, Route } from "react-router-dom";

import * as models from "api/models";
import { formatCurrency } from "currency";
import { ensure } from "typeHelpers";

interface Props {
  projects: models.Project[];
  projectSummaries: models.ProjectSummary[];
}

function InvoiceCreateNew({ projects, projectSummaries }: Props) {
  const projectsWithSummary = projectSummaries.map((summary) => {
    return {
      project: ensure(projects.find((p) => p.id === summary.project)),
      summary,
    };
  });

  return (
    <Switch>
      <Route path="/invoices/new">
        <div>
          {projectsWithSummary.map(({ project, summary }) => (
            <Link
              to={`/invoices/${summary.project}`}
              className={`cursor-pointer block hover:bg-blue-50 shadow overflow-hidden border-b border-gray-200 bg-white sm:rounded-lg my-4`}
              key={summary.project}
            >
              <div className="flex justify-between">
                <div className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800">{project.name}</div>
                  <div className="text-sm text-gray-500">
                    {summary.hours} Hours
                  </div>
                </div>
                <div className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm md:text-lg text-gray-800">
                    {formatCurrency(summary.total || 0)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Route>
      <Route path="/invoices/:projectId">
        <h2>CREATING A NEW INVOICE...</h2>
      </Route>
    </Switch>
  );
}

export default InvoiceCreateNew;
