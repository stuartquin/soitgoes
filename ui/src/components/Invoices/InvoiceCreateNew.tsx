import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";
import InvoiceActions from "components/Invoices/InvoiceActions";
import InvoiceForm from "components/Invoices/InvoiceForm";
import InvoiceEditableItems from "components/Invoices/InvoiceEditableItems";
import InvoiceEditableTotals from "components/Invoices/InvoiceEditableTotals";
import { calculateSubTotal } from "invoices";

interface Props {
  project: models.Project;
}

function InvoiceCreateNew({ project }: Props) {
  const [invoice, setInvoice] = useState<models.Invoice>();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<models.Task[]>([]);
  const [modifiers, setModifiers] = useState<models.InvoiceModifier[]>([]);
  const [timeSlips, setTimeSlips] = useState<models.TimeSlip[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const api = getClient();

      const timeSlipResponse = await api.listTimeSlips({
        project: `${project.id}`,
        noInvoice: "true",
      });
      setTimeSlips(timeSlipResponse.results || []);

      const modifierResponse = await api.listInvoiceModifiers({});
      setModifiers(modifierResponse.results || []);

      const taskResponse = await api.listTasks({
        project: `${project.id}`,
      });
      setTasks(taskResponse.results || []);

      setIsLoading(false);
    };

    load();
  }, [project]);

  useEffect(() => {
    setInvoice({
      project: project.id || 0,
      tasks: tasks.map((t) => t.id || 0),
      timeslips: timeSlips.map((t) => t.id || 0),
      modifier: modifiers,
      subtotalDue: calculateSubTotal(tasks, timeSlips),
    });
  }, [project, tasks, timeSlips, modifiers]);

  const toggleTimeSlip = useCallback(
    (timeSlip) => {
      const invoiceTimeSlips = invoice ? invoice.timeslips : [];
      const updatedTimeSlips = invoiceTimeSlips.includes(timeSlip.id)
        ? invoiceTimeSlips.filter((id) => id !== timeSlip.id)
        : invoiceTimeSlips.concat([timeSlip.id]);

      const subtotalDue = calculateSubTotal(
        tasks,
        timeSlips.filter((t) => updatedTimeSlips.includes(t.id || 0))
      );
      setInvoice({
        ...invoice,
        subtotalDue,
        timeslips: updatedTimeSlips,
      } as models.Invoice);
    },
    [invoice, timeSlips, tasks]
  );

  const removeModifier = useCallback(
    (modifier) => {
      setInvoice({
        ...invoice,
        modifier: modifiers.filter((m) => m.id !== modifier.id),
      } as models.Invoice);
    },
    [invoice, modifiers]
  );

  return (
    <div>
      {invoice && (
        <React.Fragment>
          <InvoiceActions invoice={invoice} project={project} />
          <div className="flex flex-wrap items-end justify-between mx-4 sm:mx-0">
            <InvoiceForm invoice={invoice} />
            <InvoiceEditableTotals
              invoice={invoice}
              onRemoveModifier={removeModifier}
            />
          </div>
        </React.Fragment>
      )}
      {tasks.length && invoice && (
        <InvoiceEditableItems
          project={project}
          invoice={invoice}
          tasks={tasks}
          timeSlips={timeSlips}
          onToggleTimeSlip={toggleTimeSlip}
        />
      )}
    </div>
  );
}

export default InvoiceCreateNew;
