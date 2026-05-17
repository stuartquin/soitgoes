import { formatCurrency } from "currency";
import { ProjectSummary } from "apiv3";

interface Props {
  summary: ProjectSummary;
}

function SummaryRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className={`text-sm font-medium ${className || "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}

function InvoiceSummaryPanel({ summary }: Props) {
  const { invoices } = summary;

  const unPaid = (invoices.total_invoiced || 0) - (invoices.total_paid || 0);
  const sixMonthUnpaidColor = unPaid > 0 ? "text-red-600" : "text-green-600";
  const sixMonthInvoiced = invoices?.subtotal_invoiced || 0;

  return (
    <div className="border bg-gray-50 rounded p-4 space-y-5">
      <div>
        <div className="mb-3 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700 text-sm md:text-base">
            Last 6 Months
          </h3>
          <div className="text-sm text-gray-500">
            ({invoices.invoice_count} invoices)
          </div>
        </div>
        <div>
          <SummaryRow
            label="Invoiced"
            value={formatCurrency(sixMonthInvoiced)}
          />
          <SummaryRow
            label="Average weekly"
            value={formatCurrency(sixMonthInvoiced / 26)}
            className="text-gray-500"
          />
          <SummaryRow
            label="Average monthly"
            value={formatCurrency(sixMonthInvoiced / 6)}
            className="text-gray-500"
          />
          <SummaryRow
            label="Paid (inc VAT)"
            value={formatCurrency(invoices.total_paid || 0)}
            className="text-green-600"
          />
          <SummaryRow
            label="Unpaid (inc VAT)"
            value={formatCurrency(unPaid || 0)}
            className={sixMonthUnpaidColor}
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceSummaryPanel;
