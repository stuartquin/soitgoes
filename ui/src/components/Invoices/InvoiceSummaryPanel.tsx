import { useMemo } from "react";
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
  const totals = useMemo(() => {
    return summary.invoices.reduce(
      (acc, entry) => ({
        invoiced: acc.invoiced + (entry.total_invoiced || 0),
        paid: acc.paid + (entry.total_paid || 0),
        unpaid: acc.unpaid + (entry.total_unpaid || 0),
        count: acc.count + (entry.invoice_count || 0),
        sixMonthInvoiced: acc.sixMonthInvoiced + (entry.six_month_total_invoiced || 0),
        sixMonthPaid: acc.sixMonthPaid + (entry.six_month_total_paid || 0),
        sixMonthUnpaid: acc.sixMonthUnpaid + (entry.six_month_total_unpaid || 0),
        sixMonthCount: acc.sixMonthCount + (entry.six_month_invoice_count || 0),
      }),
      {
        invoiced: 0, paid: 0, unpaid: 0, count: 0,
        sixMonthInvoiced: 0, sixMonthPaid: 0, sixMonthUnpaid: 0, sixMonthCount: 0,
      }
    );
  }, [summary.invoices]);

  const unpaidColor =
    totals.unpaid > 0 ? "text-red-600" : "text-green-600";
  const sixMonthUnpaidColor =
    totals.sixMonthUnpaid > 0 ? "text-red-600" : "text-green-600";

  return (
    <div className="border bg-gray-50 rounded p-4 space-y-5">
      <div>
        <h3 className="font-semibold text-gray-700 text-sm md:text-base mb-3">
          Last 6 Months
        </h3>
        <div>
          <SummaryRow
            label="Invoiced"
            value={formatCurrency(totals.sixMonthInvoiced)}
          />
          <SummaryRow
            label="Paid"
            value={formatCurrency(totals.sixMonthPaid)}
            className="text-green-600"
          />
          <SummaryRow
            label="Unpaid"
            value={formatCurrency(totals.sixMonthUnpaid)}
            className={sixMonthUnpaidColor}
          />
          <SummaryRow
            label="Invoices"
            value={totals.sixMonthCount}
          />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700 text-sm md:text-base mb-3">
          All Time
        </h3>
        <div>
          <SummaryRow
            label="Invoiced"
            value={formatCurrency(totals.invoiced)}
          />
          <SummaryRow
            label="Paid"
            value={formatCurrency(totals.paid)}
            className="text-green-600"
          />
          <SummaryRow
            label="Unpaid"
            value={formatCurrency(totals.unpaid)}
            className={unpaidColor}
          />
          <SummaryRow
            label="Invoices"
            value={totals.count}
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceSummaryPanel;
