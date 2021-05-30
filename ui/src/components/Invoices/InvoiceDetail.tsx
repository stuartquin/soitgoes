import React, { useEffect, useState, useMemo } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { format } from "date-fns";

import * as models from "api/models";
import { getClient } from "apiClient";
import { formatCurrency, InvoiceStatus, getInvoiceStatus } from "invoices";

interface Props {
  invoiceId: string;
  project: models.Project;
}

function InvoiceDetail({ project, invoiceId }: Props) {
  const [invoice, setInvoice] = useState<models.InvoiceDetail>();
  const [timeSlips, setTimeSlips] = useState<models.TimeSlip[]>();
  const [tasks, setTasks] = useState<models.Task[]>();

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      setInvoice(await api.retrieveInvoice({ id: invoiceId }));

      const timeSlipResponse = await api.listTimeSlips({ invoice: invoiceId });
      setTimeSlips(timeSlipResponse.results || []);

      const taskResponse = await api.listTasks({ invoices: invoiceId });
      setTasks(taskResponse.results || []);
    };

    load();
  }, [invoiceId]);

  return invoice ? (
    <div>
      <div className="text-gray-800 text-sm md:text-lg">
        #{invoice.sequenceNum} {project.name}
      </div>
      <div className="text-gray-500 text-sm pt-1">
        Issued: {format(invoice.issuedAt || new Date(), "yyyy-MM-dd")}
      </div>
      <div className="text-gray-500 text-sm pt-1">
        Due: {format(invoice.dueDate || new Date(), "yyyy-MM-dd")}
      </div>
    </div>
  ) : (
    <h2>Loading</h2>
  );
}

export default InvoiceDetail;
