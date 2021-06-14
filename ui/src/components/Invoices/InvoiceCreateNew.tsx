import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";
import InvoiceForm from "components/Invoices/InvoiceForm";
import InvoiceDetailTotals from "components/Invoices/InvoiceDetailTotals";
import { formatCurrency } from "currency";
import { ensure } from "typeHelpers";

interface Props {
  project: models.Project;
}

function InvoiceCreateNew({ project }: Props) {
  const [invoice, setInvoice] = useState<models.Invoice>();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<models.Task[]>([]);
  const [timeSlips, setTimeSlips] = useState<models.TimeSlip[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const api = getClient();

      setInvoice(await api.retrieveNewInvoice({ project: `${project.id}` }));

      setIsLoading(false);
    };

    load();
  }, []);

  console.log(invoice);

  return (
    <div>
      <div className="py-4">{project.name} Invoice #X</div>
      {invoice && <InvoiceForm project={project} />}
    </div>
  );
}

export default InvoiceCreateNew;
