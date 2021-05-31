import React from "react";
import { format } from "date-fns";

import * as models from "api/models";

interface Props {
  invoice: models.InvoiceDetail;
  project: models.Project;
  timeSlips: models.TimeSlip[];
  tasks: models.Task[];
}

function InvoiceDateItems({ timeSlips, tasks, project, invoice }: Props) {
  return (
    <div>
      <div className="flex my-3">
        <div className="text-gray-800 text-sm md:text-lg"></div>
        <div className="text-gray-500 text-sm pt-1"></div>
        <div className="text-gray-500 text-sm pt-1">
          Due: {format(invoice.dueDate || new Date(), "yyyy-MM-dd")}
        </div>
      </div>
    </div>
  );
}

export default InvoiceDateItems;
