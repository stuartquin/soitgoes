import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "@heroicons/react/outline";

import { formatCurrency } from "currency";
import { Project, ProjectSummary } from "apiv3";

interface Props {
  projects: Project[];
  summary: ProjectSummary;
}

function InvoiceSelectProject({ projects, summary }: Props) {
  const projectsWithSummary = summary.unbilled.filter(
    ({ project }) => !project?.archived
  );

  return (
    <div>
      {projectsWithSummary.map((summary) => (
        <Link
          to={"/invoices/$projectId"}
          params={{ projectId: String(summary.project?.id) }}
          className={`cursor-pointer flex justify-between hover:bg-blue-50 shadow overflow-hidden border-b border-gray-200 bg-white sm:rounded-lg my-4`}
          key={summary.project?.id || "1"}
        >
          <div className="flex justify-between flex-grow items-center">
            <div className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-800">
                {summary.project?.name || "--"}
              </div>
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
