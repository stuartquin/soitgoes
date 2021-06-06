import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import * as models from "api/models";
import { InvoiceStatus, getInvoiceStatus, getStatusColor } from "invoices";
import { formatCurrency } from "currency";

interface Props {
  invoice: models.Invoice;
  project: models.Project;
}

function InvoiceRow({ invoice, project }: Props) {
  const status = getInvoiceStatus(
    invoice.issuedAt,
    invoice.paidAt,
    invoice.dueDate
  );
  const borderClass = `border-${getStatusColor(status)}`;
  const textClass = `text-${getStatusColor(status)}`;

  console.log("STATUS", status, borderClass);

  const date = status === InvoiceStatus.Paid ? invoice.paidAt : invoice.dueDate;

  return (
    <Link
      to={`/invoices/${invoice.project}/${invoice.id}`}
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
    </Link>
  );
}

export default InvoiceRow;
