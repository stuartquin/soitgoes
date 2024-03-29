import React from "react";

import * as models from "api/models";
import { formatCurrency } from "currency";
import ActionLink from "components/ActionLink";
import InvoiceTotalsModifierItem from "components/Invoices/InvoiceTotalsModifierItem";

interface Props {
  invoice: models.Invoice;
  modifiers: models.InvoiceModifier[];
  onToggleModifier: (modifier: models.InvoiceModifier) => void;
}

function InvoiceEditableTotals({
  invoice,
  modifiers,
  onToggleModifier,
}: Props) {
  const totalDue = invoice.totalDue || 0;
  const convertedTotal = totalDue * (invoice.exchangeRate || 1);

  return (
    <div className="text-sm text-gray-600 w-full sm:w-56 mt-3 sm:mt-0">
      <div className="flex justify-between uppercase">
        <div className="">Subtotal</div>
        <div className="text-right">
          {formatCurrency(invoice.subtotalDue || 0)}
        </div>
      </div>
      {modifiers.map((modifier) => (
        <InvoiceTotalsModifierItem
          key={modifier.id}
          invoice={invoice}
          modifier={modifier}
          onToggleModifier={onToggleModifier}
        />
      ))}
      <div className="text-right">
        <ActionLink variant="primary">Add Discount/Tax</ActionLink>
      </div>
      <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t-2 border-solid border-gray-700 uppercase">
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

export default InvoiceEditableTotals;
