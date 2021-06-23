import React from "react";

import * as models from "api/models";
import TaskInvoiceItem from "components/Tasks/TaskInvoiceItem";

interface Props {
  task: models.Task;
  invoices: models.Invoice[];
}

function TaskInvoices({ task, invoices }: Props) {
  return  (
    <div className="my-4">
      <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm text-left px-2 sm:px-4 justify-between items-center">
        Invoice
      </div>
      {invoices.map((invoice) => (
        <TaskInvoiceItem invoice={invoice} />
      ))}
    </div>
  );
}

export default TaskInvoices;
