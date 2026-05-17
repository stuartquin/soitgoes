import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

import { InvoiceStatus, getInvoiceStatus, getStatusColor } from "invoices";
import { formatCurrency } from "currency";
import { Invoice, Project } from "apiv3";
import { getDate } from "lib/date";
import DownloadButton from "components/Invoices/DownloadButton";

interface Props {
  invoice: Invoice;
  project: Project;
}

function InvoiceRow({ invoice, project }: Props) {
  const issuedAt = invoice.issued_at ? getDate(invoice.issued_at) : null;
  const paidAt = invoice.paid_at ? getDate(invoice.paid_at) : null;
  const dueDate = invoice.due_date ? getDate(invoice.due_date) : null;
  const status = getInvoiceStatus(issuedAt, paidAt, dueDate);
  const borderClass = `border-${getStatusColor(status)}`;
  const textClass = `text-${getStatusColor(status)}`;
  const date = status === InvoiceStatus.Paid ? paidAt : dueDate;

  return (
    <div
      className={`cursor-pointer border-l-4 flex hover:bg-blue-50 justify-between my-2 py-3 px-4 ${borderClass}`}
    >
      <Link
        to={`/invoices/${invoice.project}/${invoice.id}`}
        className="flex-grow"
      >
        <div className="flex-grow">
          <div className="text-gray-800 text-sm md:text-lg">
            #{invoice.sequence_num} {project.name}
          </div>
          <div className="text-gray-500 text-sm">
            {format(issuedAt || new Date(), "yyyy-MM-dd")}
          </div>
        </div>
      </Link>
      <div className="flex items-center">
        <div className="text-right mr-4">
          <div className="text-sm md:text-lg text-gray-800">
            {formatCurrency(invoice.total_due || 0)}
          </div>
          <div className={`capitalize text-sm ${textClass}`}>
            {status}
            <span className="pl-1">
              {format(date || new Date(), "yyyy-MM-dd")}
            </span>
          </div>
        </div>
      </div>
      <DownloadButton invoiceId={invoice.id} pdfName={invoice.pdf_name} />
    </div>
  );
}

export default InvoiceRow;
