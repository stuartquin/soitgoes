import React, { useCallback, useMemo, useEffect, useState } from "react";
import { format, formatDistance } from "date-fns";

import * as models from "api/models";
import { getClient } from "apiClient";
import { InvoiceStatus, getInvoiceStatus, getStatusColor } from "invoices";
import InvoiceDateItems from "components/Invoices/InvoiceDateItems";
import InvoiceDetailTotals from "components/Invoices/InvoiceDetailTotals";
import InvoiceDetailLoading from "components/Invoices/InvoiceDetailLoading";
import InvoiceSummary from "components/Invoices/InvoiceSummary";

interface Props {
  invoiceId: string;
  project: models.Project;
  onStatusUpdate: () => void;
}

const getStatusDate = (
  status: InvoiceStatus,
  dueDate?: Date | null
): string => {
  if (status === InvoiceStatus.Overdue && dueDate) {
    return formatDistance(new Date(), dueDate);
  }
  return format(dueDate || new Date(), "yyyy-MM-dd");
};

function InvoiceDetail({ project, invoiceId, onStatusUpdate }: Props) {
  const [token, setToken] = useState<models.OneTimeToken>();
  const [invoice, setInvoice] = useState<models.InvoiceDetail>();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<models.Task[]>([]);
  const [timeSlips, setTimeSlips] = useState<models.TimeSlip[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const api = getClient();
      setInvoice(await api.retrieveInvoice({ id: invoiceId }));

      const timeSlipResponse = await api.listTimeSlips({ invoice: invoiceId });
      setTimeSlips(timeSlipResponse.results || []);

      const taskResponse = await api.listTasks({ invoices: invoiceId });
      setTasks(taskResponse.results || []);

      setToken(await api.retrieveOneTimeToken());

      setIsLoading(false);
    };

    load();
  }, [invoiceId]);

  const status = useMemo(() => {
    if (invoice) {
      return getInvoiceStatus(
        invoice.issuedAt,
        invoice.paidAt,
        invoice.dueDate
      );
    }
    return InvoiceStatus.Draft;
  }, [invoice]);

  const statusColor = getStatusColor(status);

  const handleSetPaid = useCallback(async () => {
    if (invoice && invoice.id) {
      const api = getClient();
      setInvoice(
        await api.updateInvoice({
          id: `${invoice.id}`,
          invoiceDetail: {
            ...invoice,
            status: models.InvoiceDetailStatusEnum.Paid,
            totalPaid: invoice.totalDue,
          },
        })
      );
      onStatusUpdate();
    }
  }, [invoice, onStatusUpdate]);

  return !isLoading && invoice ? (
    <div>
      <InvoiceSummary
        token={token}
        invoice={invoice}
        project={project}
        onSetPaid={handleSetPaid}
      />

      <div className="flex justify-between my-5 flex-wrap">
        <div className="uppercase text-sm text-gray-600">
          <div className="grid grid-cols-2 gap-1">
            <div>Issued</div>
            <div>{format(invoice.issuedAt || new Date(), "yyyy-MM-dd")}</div>
            {status !== InvoiceStatus.Due && (
              <React.Fragment>
                <div>Due</div>
                <div>{format(invoice.dueDate || new Date(), "yyyy-MM-dd")}</div>
              </React.Fragment>
            )}
            <div className={`text-${statusColor}`}>{status}</div>
            <div className={`text-${statusColor}`}>
              {getStatusDate(status, invoice.dueDate)}
            </div>
          </div>
        </div>

        <InvoiceDetailTotals invoice={invoice} />
      </div>

      <InvoiceDateItems project={project} tasks={tasks} timeSlips={timeSlips} />
    </div>
  ) : (
    <InvoiceDetailLoading />
  );
}

export default InvoiceDetail;
