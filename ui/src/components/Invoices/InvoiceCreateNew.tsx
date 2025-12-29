import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import InvoiceActions from "components/Invoices/InvoiceActions";
import InvoiceForm from "components/Invoices/InvoiceForm";
import InvoiceEditableItems from "components/Invoices/InvoiceEditableItems";
import InvoiceEditableTotals from "components/Invoices/InvoiceEditableTotals";
import Alert from "components/Alert";
import {
  InvoiceToggleItem,
  calculateTotal,
  getCalculatedInvoice,
} from "invoices";
import { ensure } from "typeHelpers";
import {
  createInvoice,
  Invoice,
  InvoiceModifier,
  Project,
  ProjectSummary,
  Task,
  TimeSlip,
} from "apiv3";
import { useQueryClient } from "@tanstack/react-query";
import {
  listInvoicesOptions,
  listProjectSummariesOptions,
  listTimeSlipsOptions,
} from "apiv3/@tanstack/react-query.gen";

interface Props {
  projects: Project[];
  timeSlips: TimeSlip[];
  tasks: Task[];
  modifiers: InvoiceModifier[];
  exchangeRates: Record<string, unknown>;
  summaries: ProjectSummary[];
  projectId?: string;
}

function InvoiceCreateNew({
  projects,
  summaries,
  timeSlips,
  projectId,
  tasks,
  modifiers,
  exchangeRates,
}: Props) {
  const queryClient = useQueryClient();
  const [invoice, setInvoice] = useState<Invoice>();
  const [exchangeRateError, setExchangeRateError] = useState<String>();
  const navigate = useNavigate();

  const project = ensure(
    projects.find((p) => p.id === parseInt(projectId || "", 10))
  );

  const timeTasks = useMemo(() => {
    return tasks.filter((t) => t.billing_type === "TIME");
  }, [tasks]);

  const fixedTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.billing_type === "FIXED" && t.state !== "DONE"
    );
  }, [tasks]);

  const previousInvoice = useMemo(() => {
    const projectSummary = (summaries || []).find(
      (s) => s.project === parseInt(projectId || "", 10)
    );
    return projectSummary?.previous_invoice;
  }, [projectId, summaries]);

  useEffect(() => {
    const currency = project.currency || "GBP";

    if (exchangeRates["GBP"] && !exchangeRates[currency]) {
      setExchangeRateError(`Unable to load exchange rate for ${currency}`);
    }

    const initialInvoice = {
      currency,
      billing_unit: previousInvoice?.billing_unit || project.billing_unit,
      exchange_rate: exchangeRates[currency] || 1,
      project: project.id,
      show_hours: previousInvoice?.show_hours || false,
      group_by: previousInvoice?.group_by,
    } as Invoice;

    setInvoice(
      getCalculatedInvoice(initialInvoice, fixedTasks, timeSlips, modifiers)
    );
  }, [
    project,
    exchangeRates,
    fixedTasks,
    previousInvoice,
    timeSlips,
    modifiers,
  ]);

  const toggleTimeSlip = useCallback(
    (item: InvoiceToggleItem) => {
      if (invoice) {
        const invoiceTimeSlips = item.isActive
          ? invoice.timeslips.filter((id) => item.id !== id)
          : invoice.timeslips.concat([item.id]);
        const updatedTimeSlips = timeSlips.filter((t) =>
          invoiceTimeSlips.includes(t.id || 0)
        );

        setInvoice(
          getCalculatedInvoice(invoice, fixedTasks, updatedTimeSlips, modifiers)
        );
      }
    },
    [invoice, timeSlips, fixedTasks, modifiers]
  );

  const toggleTask = useCallback(
    (item: InvoiceToggleItem) => {
      if (invoice) {
        const changedTimeSlipIds = item.timeSlips.map((t) => t.id || 0);
        const invoiceTimeSlips = item.isActive
          ? invoice.timeslips.filter((id) => !changedTimeSlipIds.includes(id))
          : invoice.timeslips.concat(changedTimeSlipIds);

        const invoiceTasks = item.isActive
          ? invoice.tasks.filter((id) => id !== item.id)
          : invoice.tasks.concat([item.id]);
        const updatedTasks = fixedTasks.filter((t) =>
          invoiceTasks.includes(t.id || 0)
        );
        const updatedTimeSlips = timeSlips.filter((t) =>
          invoiceTimeSlips.includes(t.id || 0)
        );

        setInvoice(
          getCalculatedInvoice(
            invoice,
            updatedTasks,
            updatedTimeSlips,
            modifiers
          )
        );
      }
    },
    [invoice, timeSlips, fixedTasks, modifiers]
  );

  const toggleModifier = useCallback(
    (modifier: InvoiceModifier) => {
      if (invoice && invoice.modifier) {
        const updatedModifiers = invoice.modifier.includes(modifier.id!)
          ? invoice.modifier.filter((id) => id !== modifier.id)
          : invoice.modifier.concat([modifier.id!]);

        const invoiceModifiers = modifiers.filter((m) =>
          updatedModifiers.includes(ensure(m.id))
        );

        setInvoice({
          ...invoice,
          modifier: updatedModifiers,
          totalDue: calculateTotal(invoice.subtotal_due || 0, invoiceModifiers),
        } as Invoice);
      }
    },
    [invoice, modifiers]
  );

  const updateInvoice = useCallback((invoice: Invoice) => {
    setInvoice(invoice);
  }, []);

  const issueInvoice = useCallback(async () => {
    const response = await createInvoice({
      body: {
        ...invoice,
        status: "ISSUED",
      } as Invoice,
    });
    const createdInvoice = response.data;
    if (createdInvoice) {
      queryClient.invalidateQueries(listProjectSummariesOptions());
      queryClient.invalidateQueries(listInvoicesOptions());
      queryClient.invalidateQueries(listTimeSlipsOptions());
      navigate({
        to: "/invoices",
      });
    }
  }, [invoice, navigate]);

  const allTasks = timeTasks.concat(fixedTasks);

  return (
    <div>
      {invoice && (
        <React.Fragment>
          <InvoiceActions
            invoice={invoice}
            project={project}
            onIssue={issueInvoice}
          />
          {exchangeRateError && (
            <Alert variant="error" className="my-4">
              {exchangeRateError}
            </Alert>
          )}
          <div className="flex flex-wrap items-end justify-between mx-4 sm:mx-0">
            <InvoiceForm invoice={invoice} onUpdate={updateInvoice} />
            <InvoiceEditableTotals
              modifiers={modifiers}
              invoice={invoice}
              onToggleModifier={toggleModifier}
            />
          </div>
          {allTasks.length > 0 && (
            <InvoiceEditableItems
              project={project}
              invoice={invoice}
              tasks={allTasks}
              timeSlips={timeSlips}
              onToggleTimeSlip={toggleTimeSlip}
              onToggleTask={toggleTask}
            />
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default InvoiceCreateNew;
