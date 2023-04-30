import React, { useCallback, useMemo, useEffect, useState } from "react";
import { format, formatDistance } from "date-fns";

import * as models from "api/models";
import { getClient } from "apiClient";
import { InvoiceStatus, getInvoiceStatus, getStatusColor } from "invoices";
import InvoiceDateItems from "components/Invoices/InvoiceDateItems";
import InvoiceTaskItems from "components/Invoices/InvoiceTaskItems";
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
  const [invoice, setInvoice] = useState<models.Invoice>();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<models.Task[]>([]);
  const [timeSlips, setTimeSlips] = useState<models.TimeSlip[]>([]);
  const [modifiers, setModifiers] = useState<models.InvoiceModifier[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const api = getClient();
      setInvoice(await api.retrieveInvoice({ id: invoiceId }));

      const timeSlipResponse = await api.listTimeSlips({ invoice: invoiceId });
      setTimeSlips(timeSlipResponse.results || []);

      const taskResponse = await api.listTasks({ invoices: invoiceId });
      setTasks(taskResponse.results || []);

      const modifierResponse = await api.listInvoiceModifiers({});
      setModifiers(modifierResponse.results || []);

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
          invoice: {
            ...invoice,
            status: models.InvoiceStatusEnum.Paid,
            totalPaid: invoice.totalDue,
          },
        })
      );
      onStatusUpdate();
    }
  }, [invoice, onStatusUpdate]);

  const displayTasks = useMemo(() => {
    if (invoice) {
      return invoice.groupBy === models.InvoiceGroupByEnum.Tasks
        ? tasks
        : tasks.filter(
            (t) => t.billingType === models.TaskBillingTypeEnum.Fixed
          );
    }
    return [];
  }, [tasks, invoice]);

  console.log(displayTasks, timeSlips);

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

        <InvoiceDetailTotals modifiers={modifiers} invoice={invoice} />
      </div>

      {invoice.groupBy === models.InvoiceGroupByEnum.Timeslips &&
        timeSlips.length > 0 && (
          <InvoiceDateItems
            project={project}
            tasks={tasks}
            timeSlips={timeSlips}
          />
        )}

      {displayTasks.length > 0 && (
        <InvoiceTaskItems
          project={project}
          tasks={displayTasks}
          timeSlips={timeSlips}
        />
      )}
    </div>
  ) : (
    <InvoiceDetailLoading />
  );
}

export default InvoiceDetail;
