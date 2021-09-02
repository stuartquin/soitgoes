import React from "react";

import InvoiceDetailModifierItem from "components/Invoices/InvoiceDetailModifierItem";
import * as models from "api/models";
import { formatCurrency } from "currency";
import { ensure } from "typeHelpers";

interface Props {
  invoice: models.Invoice;
  modifiers: models.InvoiceModifier[];
}

function InvoiceDetailTotals({ invoice, modifiers }: Props) {
  const totalDue = invoice.totalDue || 0;
  const convertedTotal = totalDue * (invoice.exchangeRate || 1);
  return (
    <div className="uppercase text-sm text-gray-600 w-full sm:w-56 mt-3 sm:mt-0">
      <div className="grid grid-cols-2 gap-1">
        <div className="">Subtotal</div>
        <div className="text-right">
          {formatCurrency(invoice.subtotalDue || 0)}
        </div>
        {ensure(invoice.modifier).map((id) => (
          <InvoiceDetailModifierItem
            key={id}
            invoiceModifier={ensure(modifiers.find((m) => m.id === id))}
            subtotalDue={invoice.subtotalDue || 0}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t-2 border-solid border-gray-700">
        <div className="">Total</div>
        <div className="text-right">{formatCurrency(totalDue)}</div>
      </div>
      {invoice.currency !== "GBP" && (
        <div className="grid grid-cols-2 gap-1 uppercase">
          <div className="">Total ({invoice.currency})</div>
          <div className="text-right">
            {formatCurrency(convertedTotal || 0, invoice.currency)}
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceDetailTotals;
