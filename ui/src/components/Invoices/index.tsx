import { useCallback, useMemo } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";

import { ensure } from "typeHelpers";
import InvoiceRow from "components/Invoices/InvoiceRow";
import InvoiceSummaryPanel from "components/Invoices/InvoiceSummaryPanel";
import UnbilledProjectsPanel from "components/Invoices/UnbilledProjectsPanel";
import Button from "components/Button";
import SlideOver from "components/SlideOver";
import { Invoice, Project, ProjectSummary } from "apiv3";

interface Filters {
  status?: Invoice["status"];
  project?: number;
}

interface Props {
  projects: Project[];
  invoices: Invoice[];
  summary: ProjectSummary;
  filters: Filters;
}

const STATUS_OPTIONS: { label: string; value: Invoice["status"] | "" }[] = [
  { label: "All statuses", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Issued", value: "ISSUED" },
  { label: "Paid", value: "PAID" },
];

function Invoices({ projects, summary, invoices, filters }: Props) {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const invoiceList = useMemo(() => {
    return projects.length
      ? invoices.map((invoice) => {
          return {
            project: ensure(projects.find((p) => p.id === invoice.project)),
            invoice,
          };
        })
      : [];
  }, [invoices, projects]);

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value || undefined;
      navigate({
        to: "/invoices",
        search: (prev) => ({
          ...prev,
          status: value as Invoice["status"] | undefined,
        }),
      });
    },
    [navigate]
  );

  const handleProjectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value ? Number(e.target.value) : undefined;
      navigate({
        to: "/invoices",
        search: (prev) => ({ ...prev, project: value }),
      });
    },
    [navigate]
  );

  const closeSlideOver = useCallback(() => {
    navigate({ to: "/invoices" });
  }, [navigate]);

  const createNewInvoice = useCallback(() => {
    navigate({ to: "/invoices/new" });
  }, [navigate]);

  const isOpen = pathname.startsWith("/invoices/");

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 my-4 w-full px-2 sm:px-0">
        <div className="flex gap-2">
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={filters.status ?? ""}
            onChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={filters.project ?? ""}
            onChange={handleProjectChange}
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <Button variant="success" onClick={createNewInvoice}>
          Create Invoice
        </Button>
      </div>
      <div className="px-2 sm:px-0">
        <div className="lg:hidden my-4">
          <UnbilledProjectsPanel summary={summary} />
        </div>
      </div>
      <div className="px-2 sm:px-0 flex flex-col lg:flex-row lg:gap-4">
        <div className="border-1 bg-gray-50 border-radius-sm my-4 lg:w-2/3">
          <div className="bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-700 text-sm md:text-base text-left p-4 justify-between items-center">
            <div className="font-semibold w-full md:w-auto">Invoice</div>
          </div>
          {invoiceList.map(({ invoice, project }) => (
            <InvoiceRow key={invoice.id} invoice={invoice} project={project} />
          ))}
        </div>
        <div className="my-4 lg:w-1/3 space-y-4 hidden lg:block">
          <UnbilledProjectsPanel summary={summary} />
          <InvoiceSummaryPanel summary={summary} />
        </div>
      </div>
      <SlideOver isOpen={isOpen} onClose={closeSlideOver}>
        <Outlet />
      </SlideOver>
    </div>
  );
}

export default Invoices;
