import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";
import InvoiceRow from "components/Invoices/InvoiceRow";
import InvoiceDetail from "components/Invoices/InvoiceDetail";
import SlideOver from "components/SlideOver";

interface RouterProps {
  invoiceId: string;
  projectId: string;
}

interface Props {
  user: models.User;
  projects: models.Project[];
}

function ensure<T>(
  argument: T | undefined | null,
  message: string = "This value was promised to be there."
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}

function Invoices({ user, projects }: Props) {
  const [invoices, setInvoices] = useState<models.Invoice[]>([]);
  const { projectId, invoiceId } = useParams<RouterProps>();
  const history = useHistory();

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      const response = await api.listInvoices({
        limit: 20,
        offset: 0,
      });

      setInvoices(response.results || []);
    };

    load();
  }, []);

  const invoiceList = useMemo(() => {
    return invoices.map((invoice) => {
      return {
        project: ensure(projects.find((p) => p.id === invoice.project)),
        invoice,
      };
    });
  }, [invoices, projects]);

  const closeInvoiceDetail = useCallback(() => {
    history.push("/invoices");
  }, [history]);

  const project = useMemo(() => {
    return projectId
      ? ensure(projects.find((p) => p.id === parseInt(projectId, 10)))
      : ({} as models.Project);
  }, [projects, projectId]);

  return (
    <React.Fragment>
      <div className="px-4">
        <div className="border-1 bg-gray-50 border-radius-sm my-4">
          <div className="bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-700 text-sm md:text-base text-left p-4 justify-between items-center">
            <div className="font-semibold w-full md:w-auto">Invoice</div>
          </div>
          {invoiceList.map(({ invoice, project }) => (
            <InvoiceRow key={invoice.id} invoice={invoice} project={project} />
          ))}
        </div>
      </div>
      <SlideOver isOpen={Boolean(invoiceId)} onClose={closeInvoiceDetail}>
        {Boolean(invoiceId) ? (
          <InvoiceDetail project={project} invoiceId={invoiceId} />
        ) : (
          <div />
        )}
      </SlideOver>
    </React.Fragment>
  );
}

export default Invoices;
