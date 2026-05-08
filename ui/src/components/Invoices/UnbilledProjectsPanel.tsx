import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "@heroicons/react/outline";

import { formatCurrency } from "currency";
import { ProjectSummary } from "apiv3";

interface Props {
  summary: ProjectSummary;
}

function UnbilledProjectsPanel({ summary }: Props) {
  const unbilledProjects = useMemo(() => {
    return summary.unbilled.filter(
      (entry) => (entry.total ?? 0) > 0 || (entry.hours ?? 0) > 0
    );
  }, [summary.unbilled]);

  if (unbilledProjects.length === 0) return null;

  return (
    <div className="border bg-gray-50 rounded p-4">
      <h3 className="font-semibold text-gray-700 text-sm md:text-base mb-3">
        Unbilled Projects
      </h3>
      <div className="space-y-1">
        {unbilledProjects.map((entry) => (
          <Link
            key={entry.project?.id ?? "unknown"}
            to="/invoices/$projectId"
            params={{ projectId: String(entry.project?.id) }}
            className="flex items-center justify-between rounded px-0 py-2 hover:bg-blue-50 cursor-pointer"
          >
            <div>
              <div className="text-sm text-gray-800">
                {entry.project?.name || "--"}
              </div>
              <div className="text-xs text-gray-500">
                {entry.hours ?? 0} hours
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">
                {formatCurrency(entry.total ?? 0)}
              </span>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default UnbilledProjectsPanel;
