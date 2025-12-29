import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "@heroicons/react/outline";

import { formatCurrency } from "currency";
import { ensure } from "typeHelpers";
import { Project, ProjectSummary } from "apiv3";

interface Props {
  projects: Project[];
  summaries: ProjectSummary[];
}

function InvoiceSelectProject({ projects, summaries }: Props) {
  const projectsWithSummary = summaries
    .map((s) => {
      return {
        project: ensure(projects.find((p) => p.id === s.project)),
        s,
      };
    })
    .filter(({ project }) => !project.archived);

  return (
    <div>
      {projectsWithSummary.map(({ project, s }) => (
        <Link
          to={"/invoices/$projectId"}
          params={{ projectId: String(project.id) }}
          className={`cursor-pointer flex justify-between hover:bg-blue-50 shadow overflow-hidden border-b border-gray-200 bg-white sm:rounded-lg my-4`}
          key={s.project}
        >
          <div className="flex justify-between flex-grow items-center">
            <div className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-800">{project.name}</div>
              <div className="text-sm text-gray-500">{s.hours} Hours</div>
            </div>
            <div className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm md:text-lg text-gray-800">
                {formatCurrency(s.total || 0)}
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
