import React from "react";

import * as models from "api/models";
import { format } from "date-fns";
import { formatCurrency } from "currency";
import { getInvoiceStatus, getStatusColor, InvoiceStatus } from "invoices";

interface Props {
  invoice: models.Invoice;
}

function TaskInvoiceItem({ invoice }: Props) {
  const status = getInvoiceStatus(
    invoice.issuedAt,
    invoice.paidAt,
    invoice.dueDate
  );

  const date = status === InvoiceStatus.Paid ? invoice.paidAt : invoice.dueDate;

  return (
    <div className="flex my-3 px-2 sm:px-4 justify-between items-center">
      <div className="flex flex-wrap items-center flex-grow">
        <div className="text-gray-800 text-sm md:text-lg mr-2 w-full sm:w-auto">
          <div className="text-gray-800 text-sm md:text-lg truncate w-3/4">
            #{invoice.sequenceNum}
          </div>
          <div className="text-gray-500 text-sm">
            {format(invoice.issuedAt || new Date(), "yyyy-MM-dd")}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm md:text-lg text-gray-800">
          {formatCurrency(invoice.totalDue || 0)}
        </div>
        <div className={`capitalize text-sm text-${getStatusColor(status)}`}>
          {status}
          <span className="pl-1">
            {format(date || new Date(), "yyyy-MM-dd")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskInvoiceItem;
