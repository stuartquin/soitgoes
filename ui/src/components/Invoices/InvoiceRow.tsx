import React, { useMemo } from "react";
import { format } from "date-fns";

import * as models from "api/models";
import { formatCurrency, InvoiceStatus, getInvoiceStatus } from "invoices";

const STATUS_COLORS = {
  Draft: "gray-400",
  Paid: "green-600",
  Overdue: "red-400",
  Due: "blue-700",
};

interface Props {
  invoice: models.Invoice;
  project: models.Project;
}

function InvoiceRow({ invoice, project }: Props) {
  const status = getInvoiceStatus(invoice);
  const borderClass = `border-${STATUS_COLORS[status]}`;
  const textClass = `text-${STATUS_COLORS[status]}`;

  const date = status === InvoiceStatus.Paid ? invoice.paidAt : invoice.dueDate;

  return (
    <div
      className={`cursor-pointer border-l-4 flex hover:bg-blue-50 justify-between my-2 py-3 px-4 ${borderClass}`}
    >
      <div className="flex-grow">
        <div className="text-gray-800 text-sm md:text-lg">
          #{invoice.sequenceNum} {project.name}
        </div>
        <div className="text-gray-500 text-sm">
          {format(invoice.issuedAt || new Date(), "yyyy-MM-dd")}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm md:text-lg text-gray-800">
          {formatCurrency(invoice.totalDue || 0)}
        </div>
        <div className={`capitalize text-sm ${textClass}`}>
          {status}
          <span className="pl-1">
            {format(date || new Date(), "yyyy-MM-dd")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default InvoiceRow;
