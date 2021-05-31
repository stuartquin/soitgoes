import React, { useEffect, useState } from "react";
import { format } from "date-fns";

import * as models from "api/models";
import { getClient } from "apiClient";
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

  return invoice ? (
    <div>
      <div className="flex justify-between">
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

        <InvoiceDetailTotals invoice={invoice} />
      </div>

      <div className="my-4">
        <div className="bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-700 text-sm md:text-base text-left px-4 justify-between items-center">
          <div className="font-semibold">Date</div>
          <div className="flex w-1/4 justify-between">
            <div className="font-semibold mx-1">Hours</div>
            <div className="font-semibold mx-1">Total</div>
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
