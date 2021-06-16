import React from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/outline";

import * as models from "api/models";
import { formatCurrency } from "currency";
import { getModifierLabel, calculateModifierImpact } from "invoices";
import { ensure } from "typeHelpers";

interface Props {
  invoice: models.Invoice;
  modifier: models.InvoiceModifier;
  onToggleModifier: (modifier: models.InvoiceModifier) => void;
}

function InvoiceTotalsModifierItem({
  invoice,
  modifier,
  onToggleModifier,
}: Props) {
  const hasModifier = ensure(invoice.modifier).find(
    (m) => m.id === modifier.id
  );
  return (
    <div className={!hasModifier ? "opacity-25" : ""}>
      <div className="flex justify-between uppercase">
        <div>{getModifierLabel(modifier)}</div>
        <div className="flex items-center relative">
          {formatCurrency(
            calculateModifierImpact(invoice.subtotalDue || 0, modifier)
          )}
          <div
            className="p-2 cursor-pointer absolute -right-7"
            onClick={() => onToggleModifier(modifier)}
          >
            {hasModifier ? (
              <MinusCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            ) : (
              <PlusCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceTotalsModifierItem;
