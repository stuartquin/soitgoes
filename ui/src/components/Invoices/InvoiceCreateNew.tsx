import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";
import { ExchangeRate } from "currency";
import InvoiceActions from "components/Invoices/InvoiceActions";
import InvoiceForm from "components/Invoices/InvoiceForm";
import InvoiceEditableItems from "components/Invoices/InvoiceEditableItems";
import InvoiceEditableTotals from "components/Invoices/InvoiceEditableTotals";
import InvoiceWeeklyTaskSettings from "components/Invoices/InvoiceWeeklyTaskSettings";
import Alert from "components/Alert";
import {
  InvoiceToggleItem,
  calculateTotal,
  getCalculatedInvoice,
} from "invoices";
import { ensure } from "typeHelpers";

interface Props {
  projects: models.Project[];
}

function InvoiceCreateNew({ projects }: Props) {
  const { projectId } = useParams();
  const [invoice, setInvoice] = useState<models.Invoice>();
  const [previousInvoice, setPreviousInvoice] = useState<models.Invoice>();
  const [timeTasks, setTimeTasks] = useState<models.Task[]>([]);
  const [fixedTasks, setFixedTasks] = useState<models.Task[]>([]);
  const [modifiers, setModifiers] = useState<models.InvoiceModifier[]>([]);
  const [timeSlips, setTimeSlips] = useState<models.TimeSlip[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate>({});
  const [exchangeRateError, setExchangeRateError] = useState<String>();
  const navigate = useNavigate();

  const project = ensure(
    projects.find((p) => p.id === parseInt(projectId || "", 10))
  );

  useEffect(() => {
    const load = async () => {
      const api = getClient();

      const [
        timeSlipResponse,
        modifierResponse,
        taskResponse,
        exchangeRateResponse,
        summaryResponse,
      ] = await Promise.all([
        api.listTimeSlips({
          project: `${project.id}`,
          noInvoice: "true",
        }),
        api.listInvoiceModifiers({}),
        api.listTasks({
          project: `${project.id}`,
        }),
        api.retrieveExchangeRate(),
        api.listProjectSummarys(),
      ]);
      const tasks = taskResponse.results || [];

      const projectSummary = (summaryResponse.results || []).find(
        (s) => s.project === parseInt(projectId || "", 10)
      );
      setPreviousInvoice(projectSummary?.previousInvoice);

      setTimeSlips(timeSlipResponse.results || []);
      setModifiers(modifierResponse.results || []);
      setTimeTasks(
        tasks.filter((t) => t.billingType === models.TaskBillingTypeEnum.Time)
      );
      setFixedTasks(
        tasks.filter(
          (t) =>
            t.billingType === models.TaskBillingTypeEnum.Fixed &&
            t.state !== models.TaskStateEnum.Done
        )
      );
      setExchangeRates((exchangeRateResponse.rates as ExchangeRate) || {});
    };

    load();
  }, [project]);

  useEffect(() => {
    const currency = project.currency || "GBP";

    if (exchangeRates["GBP"] && !exchangeRates[currency]) {
      setExchangeRateError(`Unable to load exchange rate for ${currency}`);
    }

    const initialInvoice = {
      currency,
      billingUnit: previousInvoice?.billingUnit || project.billingUnit,
      exchangeRate: exchangeRates[currency] || 1,
      project: project.id,
      showHours: previousInvoice?.showHours || false,
      groupBy: previousInvoice?.groupBy,
    } as models.Invoice;
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
    (modifier: models.InvoiceModifier) => {
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
          totalDue: calculateTotal(invoice.subtotalDue || 0, invoiceModifiers),
        } as models.Invoice);
      }
    },
    [invoice, modifiers]
  );

  const updateInvoice = useCallback((invoice: models.Invoice) => {
    setInvoice(invoice);
  }, []);

  const issueInvoice = useCallback(async () => {
    const api = getClient();
    const issuedInvoice = {
      ...invoice,
      status: models.InvoiceStatusEnum.Issued,
    } as models.Invoice;

    const createdInvoice = await api.createInvoice({
      invoice: issuedInvoice,
    });
    navigate(`/invoices/${createdInvoice.project}/${createdInvoice.id}`);
  }, [invoice, navigate]);

  const addWeeklyTasks = useCallback(
    async (tasks: models.Task[]) => {
      const api = getClient();
      const newTasks = await Promise.all(
        tasks.map((task) => api.createTask({ task }))
      );

      setFixedTasks(fixedTasks.concat(newTasks));
    },
    [fixedTasks]
  );

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
          {project.weeklyRate && (
            <InvoiceWeeklyTaskSettings
              project={project}
              onAddTasks={addWeeklyTasks}
            />
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
