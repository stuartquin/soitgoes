import { useCallback, useMemo } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";

import { ensure } from "typeHelpers";
import InvoiceRow from "components/Invoices/InvoiceRow";
import Button from "components/Button";
import SlideOver from "components/SlideOver";
import { Invoice, Project, ProjectSummary } from "apiv3";

interface Props {
  projects: Project[];
  invoices: Invoice[];
  summaries: ProjectSummary[];
}

function Invoices({ projects, summaries, invoices }: Props) {
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

  const closeSlideOver = useCallback(() => {
    navigate({ to: "/invoices" });
  }, [navigate]);

  const createNewInvoice = useCallback(() => {
    navigate({ to: "/invoices/new" });
  }, [navigate]);

  const isOpen = pathname.startsWith("/invoices/");

  const projectsWithSummary = useMemo(
    () =>
      summaries
        .filter((s) => s.total)
        .map((s) => {
          return {
            project: ensure(projects.find((p) => p.id === s.project)),
            s,
          };
        })
        .filter(({ project }) => !project.archived),
    [summaries]
  );

  return (
    <div className="w-full">
      <div className="flex justify-end my-4 w-full px-2 sm:px-0">
        <Button variant="success" onClick={createNewInvoice}>
          Create Invoice
        </Button>
      </div>
      <div className="px-2 sm:px-0">
        <div className="border-1 bg-gray-50 border-radius-sm my-4">
          <div className="bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-700 text-sm md:text-base text-left p-4 justify-between items-center">
            <div className="font-semibold w-full md:w-auto">Invoice</div>
          </div>
          {invoiceList.map(({ invoice, project }) => (
            <InvoiceRow key={invoice.id} invoice={invoice} project={project} />
          ))}
        </div>
      </div>
      <SlideOver isOpen={isOpen} onClose={closeSlideOver}>
        <Outlet />
      </SlideOver>
    </div>
  );
}

export default Invoices;
