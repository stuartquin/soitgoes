import React from "react";

import InvoiceDetailModifierItem from "components/Invoices/InvoiceDetailModifierItem";
import * as models from "api/models";
import { formatCurrency } from "currency";

interface Props {
  invoice: models.InvoiceDetail;
}

function InvoiceDetailTotals({ invoice }: Props) {
  return (
    <div className="uppercase text-sm text-gray-600 w-full sm:w-56 mt-3 sm:mt-0">
      <div className="grid grid-cols-2 gap-1">
        <div className="">Subtotal</div>
        <div className="text-right">
          {formatCurrency(invoice.subtotalDue || 0)}
        </div>
        {invoice.modifier.map((modifier) => (
          <InvoiceDetailModifierItem
            key={modifier.id}
            invoiceModifier={modifier}
            subtotalDue={invoice.subtotalDue || 0}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t-2 border-solid border-gray-700">
        <div className="">Total</div>
        <div className="text-right">
          {formatCurrency(invoice.totalDue || 0)}
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetailTotals;
