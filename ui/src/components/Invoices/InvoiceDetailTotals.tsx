import React from "react";

import * as models from "api/models";
import { formatCurrency } from "currency";

interface Props {
  invoice: models.InvoiceDetail;
}

function InvoiceDetailTotals({ invoice }: Props) {
  return (
    <div className="bg-blue-50 my-3 px-4">
      <div className="flex justify-between items-center">
        <div className="font-semibold">Subtotal</div>
        <div>{formatCurrency(invoice.subtotalDue || 0)}</div>
      </div>
    </div>
  );
}

export default InvoiceDetailTotals;
