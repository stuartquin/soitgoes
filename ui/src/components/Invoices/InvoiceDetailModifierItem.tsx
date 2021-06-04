import React from "react";

import * as models from "api/models";
import { formatCurrency } from "currency";

interface Props {
  invoiceModifier: models.InvoiceModifier;
  subtotalDue: number;
}

function InvoiceDetailModifierItem({ subtotalDue, invoiceModifier }: Props) {
  const name = `${invoiceModifier.name} ${invoiceModifier.percent}%`;
  const impact = (subtotalDue / 100.0) * (invoiceModifier.percent || 0);

  return (
    <React.Fragment>
      <div>{name}</div>
      <div className="text-right">{formatCurrency(impact)}</div>
    </React.Fragment>
  );
}

export default InvoiceDetailModifierItem;
