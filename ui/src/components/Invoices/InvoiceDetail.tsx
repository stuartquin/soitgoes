import React, { useMemo, useEffect, useState } from "react";
import { format, formatDistance } from "date-fns";

import * as models from "api/models";
import { getClient } from "apiClient";
import { InvoiceStatus, getInvoiceStatus, getStatusColor } from "invoices";
import InvoiceDateItem from "components/Invoices/InvoiceDateItem";
import InvoiceDetailTotals from "components/Invoices/InvoiceDetailTotals";

interface Props {
  invoiceId: string;
  project: models.Project;
}

interface GroupedTimeSlip {
  timeSlip: models.TimeSlip;
  task: models.Task;
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

function InvoiceDetail({ project, invoiceId }: Props) {
  const [invoice, setInvoice] = useState<models.InvoiceDetail>();
  const [groupedTimeSlips, setGroupedTimeSlips] = useState<GroupedTimeSlip[]>(
    []
  );
  const [tasks, setTasks] = useState<models.Task[]>([]);

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      setInvoice(await api.retrieveInvoice({ id: invoiceId }));

      const timeSlipResponse = await api.listTimeSlips({ invoice: invoiceId });

      const taskResponse = await api.listTasks({ invoices: invoiceId });
      const taskResults = taskResponse.results || [];
      setTasks(taskResults);

      setGroupedTimeSlips(
        (timeSlipResponse.results || []).map((timeSlip) => {
          return {
            timeSlip,
            task: taskResults.find((t) => t.id === timeSlip.task),
          } as GroupedTimeSlip;
        })
      );
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

  return invoice ? (
    <div>
      <div className="text-gray-800 text-sm md:text-lg">
        #{invoice.sequenceNum} {project.name}
      </div>
      <div className="flex justify-between my-3 flex-wrap">
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

      <div className="my-4">
        <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm md:text-base text-left px-4 justify-between items-center">
          <div className="text-sm">Date</div>
          <div className="flex w-1/4 justify-between">
            <div className="text-sm mx-1">Hours</div>
            <div className="text-sm mx-1">Total</div>
          </div>
        </div>
        {groupedTimeSlips.map(({ task, timeSlip }) => (
          <InvoiceDateItem
            key={timeSlip.id}
            timeSlip={timeSlip}
            task={task}
            project={project}
          />
        ))}
      </div>
    </div>
  ) : (
    <h2>Loading</h2>
  );
}

export default InvoiceDetail;
