import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";
import InvoiceRow from "components/Invoices/InvoiceRow";

interface Props {
  user: models.User;
  projects: models.Project[];
  tasks: models.Task[];
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

function Invoices({ user, projects, tasks }: Props) {
  const search = useLocation().search;
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<models.Invoice[]>([]);

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      const response = await api.listInvoices({
        limit: 20,
        offset: 0,
      });

      setInvoices(response.results || []);
      setIsLoading(false);
    };

    load();
  }, [tasks]);

  const invoiceList = useMemo(() => {
    return invoices.map((invoice) => {
      return {
        project: ensure(projects.find((p) => p.id === invoice.project)),
        invoice,
      };
    });
  }, [invoices, projects]);

  return (
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
  );
}

export default Invoices;
