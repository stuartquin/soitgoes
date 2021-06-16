import React from "react";
import { MinusCircleIcon } from "@heroicons/react/outline";

import * as models from "api/models";
import { formatCurrency } from "currency";
import { getModifierLabel, calculateModifierImpact } from "invoices";
import ActionLink from "components/ActionLink";

interface Props {
  invoice: models.Invoice;
}

function InvoiceEditableTotals({ invoice }: Props) {
  const modifiers = invoice.modifier || [];
  return (
    <div className="text-sm text-gray-600 w-full sm:w-56 mt-3 sm:mt-0">
      <div className="flex justify-between uppercase">
        <div className="">Subtotal</div>
        <div className="text-right">
          {formatCurrency(invoice.subtotalDue || 0)}
        </div>
      </div>
      {modifiers.map((modifier) => (
        <div className="flex justify-between uppercase" key={modifier.id}>
          <div>{getModifierLabel(modifier)}</div>
          <div className="flex items-center relative">
            {formatCurrency(
              calculateModifierImpact(invoice.subtotalDue || 0, modifier)
            )}
            <div
              className="p-2 cursor-pointer absolute -right-7"
              onClick={() => console.log(modifier)}
            >
              <MinusCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </div>
          </div>
        </div>
      ))}
      <div className="text-right">
        <ActionLink variant="primary">Add Discount/Tax</ActionLink>
      </div>
      <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t-2 border-solid border-gray-700 uppercase">
        <div className="">Total</div>
        <div className="text-right">
          {formatCurrency(invoice.totalDue || 0)}
        </div>
      </div>
    </div>
  );
}

export default InvoiceEditableTotals;
