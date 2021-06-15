import React from "react";

import * as models from "api/models";
import { formatCurrency } from "currency";
import { getModifierLabel, calculateModifierImpact } from "invoices";

interface Props {
  invoiceModifier: models.InvoiceModifier;
  subtotalDue: number;
}

function InvoiceDetailModifierItem({ subtotalDue, invoiceModifier }: Props) {
  const name = getModifierLabel(invoiceModifier);
  const impact = calculateModifierImpact(subtotalDue, invoiceModifier);

  return (
    <React.Fragment>
      <div>{name}</div>
      <div className="text-right">{formatCurrency(impact)}</div>
    </React.Fragment>
  );
}

export default InvoiceDetailModifierItem;
