import React, { useCallback, useEffect, useState } from "react";

import * as models from "api/models";
import { getClient } from "apiClient";
import InvoiceActions from "components/Invoices/InvoiceActions";
import InvoiceForm from "components/Invoices/InvoiceForm";
import InvoiceEditableItems from "components/Invoices/InvoiceEditableItems";
import InvoiceEditableTotals from "components/Invoices/InvoiceEditableTotals";
import { calculateTotal, calculateSubTotal } from "invoices";
import { ensure } from "typeHelpers";

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
    const subtotalDue = calculateSubTotal(tasks, timeSlips);
    setInvoice({
      subtotalDue,
      project: project.id || 0,
      tasks: tasks.map((t) => t.id || 0),
      timeslips: timeSlips.map((t) => t.id || 0),
      modifier: modifiers,
      totalDue: calculateTotal(subtotalDue, modifiers),
    });
  }, [project, tasks, timeSlips, modifiers]);

  const toggleTimeSlip = useCallback(
    (timeSlip) => {
      if (invoice) {
        const updatedTimeSlips = invoice.timeslips.includes(timeSlip.id)
          ? invoice.timeslips.filter((id) => id !== timeSlip.id)
          : invoice.timeslips.concat([timeSlip.id]);

        const subtotalDue = calculateSubTotal(
          tasks,
          timeSlips.filter((t) => updatedTimeSlips.includes(t.id || 0))
        );
        setInvoice({
          ...invoice,
          subtotalDue,
          totalDue: calculateTotal(subtotalDue, ensure(invoice.modifier)),
          timeslips: updatedTimeSlips,
        } as models.Invoice);
      }
    },
    [invoice, timeSlips, tasks]
  );

  const toggleModifier = useCallback(
    (modifier) => {
      if (invoice) {
        const invoiceModifiers = invoice ? ensure(invoice.modifier) : [];
        const updatedModifiers = invoiceModifiers.find(
          (m) => m.id === modifier.id
        )
          ? invoiceModifiers.filter((m) => m.id !== modifier.id)
          : invoiceModifiers.concat([modifier]);
        setInvoice({
          ...invoice,
          modifier: updatedModifiers,
          totalDue: calculateTotal(
            invoice.subtotalDue || 0,
            ensure(updatedModifiers)
          ),
        } as models.Invoice);
      }
    },
    [invoice]
  );

  return (
    <div>
      {invoice && (
        <React.Fragment>
          <InvoiceActions invoice={invoice} project={project} />
          <div className="flex flex-wrap items-end justify-between mx-4 sm:mx-0">
            <InvoiceForm invoice={invoice} />
            <InvoiceEditableTotals
              modifiers={modifiers}
              invoice={invoice}
              onToggleModifier={toggleModifier}
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
