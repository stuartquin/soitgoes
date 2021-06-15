import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as models from "api/models";
import { getClient } from "apiClient";
import InvoiceForm from "components/Invoices/InvoiceForm";
import InvoiceEditableItems from "components/Invoices/InvoiceEditableItems";
import InvoiceEditableTotals from "components/Invoices/InvoiceEditableTotals";
import { formatCurrency } from "currency";
import { ensure } from "typeHelpers";
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
      subtotalDue: calculateSubTotal(tasks, timeSlips),
      modifier: modifiers,
    });
  }, [project, tasks, timeSlips, modifiers]);

  const removeTimeSlip = useCallback(
    (timeSlip) => {
      setTimeSlips(timeSlips.filter((t) => t.id !== timeSlip.id));
    },
    [timeSlips]
  );

  return (
    <div>
      <div className="py-4">{project.name} Invoice #X</div>
      {invoice && <InvoiceEditableTotals invoice={invoice} />}
      {tasks.length && (
        <InvoiceEditableItems
          project={project}
          tasks={tasks}
          timeSlips={timeSlips}
          onRemoveTimeSlip={removeTimeSlip}
        />
      )}
    </div>
  );
}

export default InvoiceCreateNew;
