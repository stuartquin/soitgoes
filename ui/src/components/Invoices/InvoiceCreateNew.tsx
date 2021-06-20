import React, { useCallback, useEffect, useState } from "react";

import * as models from "api/models";
import { getClient } from "apiClient";
import InvoiceActions from "components/Invoices/InvoiceActions";
import InvoiceForm from "components/Invoices/InvoiceForm";
import InvoiceEditableItems from "components/Invoices/InvoiceEditableItems";
import InvoiceEditableTotals from "components/Invoices/InvoiceEditableTotals";
import { TimeSlipTask, calculateTotal, calculateSubTotal } from "invoices";
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

      const [
        timeSlipResponse,
        modifierResponse,
        taskResponse,
      ] = await Promise.all([
        api.listTimeSlips({
          project: `${project.id}`,
          noInvoice: "true",
        }),
        api.listInvoiceModifiers({}),
        api.listTasks({
          project: `${project.id}`,
        }),
      ]);

      setTimeSlips(timeSlipResponse.results || []);
      setModifiers(modifierResponse.results || []);
      setTasks(taskResponse.results || []);
      setIsLoading(false);
    };

    load();
  }, [project]);

  useEffect(() => {
    const subtotalDue = calculateSubTotal(tasks, timeSlips);

    setInvoice({
      groupBy: models.InvoiceGroupByEnum.Timeslips,
      subtotalDue,
      project: project.id || 0,
      tasks: tasks
        .filter((t) => t.billingType === models.TaskBillingTypeEnum.Fixed)
        .map((t) => t.id || 0),
      timeslips: timeSlips.map((t) => ensure(t.id)),
      modifier: modifiers.map((m) => ensure(m.id)),
      totalDue: calculateTotal(subtotalDue, modifiers),
    });
  }, [project, tasks, timeSlips, modifiers]);

  const toggleInvoiceItem = useCallback(
    (item: TimeSlipTask) => {
      if (invoice) {
        const changedTimeSlipIds =
          item.type === "Task"
            ? item.timeSlips.map((t) => t.id || 0)
            : [item.id || 0];

        const updatedTimeSlips = item.isActive
          ? invoice.timeslips.filter((id) => !changedTimeSlipIds.includes(id))
          : invoice.timeslips.concat(changedTimeSlipIds);

        const updatedTasks =
          item.type === "Task"
            ? invoice.tasks.filter((id) => id !== item.id)
            : invoice.tasks;

        const subtotalDue = calculateSubTotal(
          tasks,
          timeSlips.filter((t) => updatedTimeSlips.includes(t.id || 0))
        );

        const invoiceModifiers = modifiers.filter((m) =>
          ensure(invoice.modifier).includes(ensure(m.id))
        );
        setInvoice({
          ...invoice,
          subtotalDue,
          totalDue: calculateTotal(subtotalDue, invoiceModifiers),
          timeslips: updatedTimeSlips,
          tasks: updatedTasks,
        } as models.Invoice);
      }
    },
    [invoice, timeSlips, tasks, modifiers]
  );

  const toggleModifier = useCallback(
    (modifier) => {
      if (invoice && invoice.modifier) {
        const updatedModifiers = invoice.modifier.includes(modifier.id)
          ? invoice.modifier.filter((id) => id !== modifier.id)
          : invoice.modifier.concat([modifier.id]);

        const invoiceModifiers = modifiers.filter((m) =>
          updatedModifiers.includes(ensure(m.id))
        );

        setInvoice({
          ...invoice,
          modifier: updatedModifiers,
          totalDue: calculateTotal(invoice.subtotalDue || 0, invoiceModifiers),
        } as models.Invoice);
      }
    },
    [invoice, modifiers]
  );

  const changeGroupBy = useCallback(
    (groupBy: models.InvoiceGroupByEnum) => {
      if (invoice) {
        setInvoice({
          ...invoice,
          groupBy,
        });
      }
    },
    [invoice]
  );

  const issueInvoice = useCallback(async () => {
    const api = getClient();
    setInvoice(await api.createInvoice({ invoice }));
  }, [invoice]);

  return (
    <div>
      {invoice && (
        <React.Fragment>
          <InvoiceActions
            invoice={invoice}
            project={project}
            onIssue={issueInvoice}
          />
          <div className="flex flex-wrap items-end justify-between mx-4 sm:mx-0">
            <InvoiceForm invoice={invoice} onChangeGroupBy={changeGroupBy} />
            <InvoiceEditableTotals
              modifiers={modifiers}
              invoice={invoice}
              onToggleModifier={toggleModifier}
            />
          </div>
          {tasks.length > 0 && (
            <InvoiceEditableItems
              project={project}
              invoice={invoice}
              tasks={tasks}
              timeSlips={timeSlips}
              onToggle={toggleInvoiceItem}
            />
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default InvoiceCreateNew;
