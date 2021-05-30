import React, { useEffect, useState, useMemo } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { format } from "date-fns";

import * as models from "api/models";
import { getClient } from "apiClient";
import { formatCurrency, InvoiceStatus, getInvoiceStatus } from "invoices";

interface Props {
  invoiceId: string;
}

function InvoiceDetail({ invoiceId }: Props) {
  const [invoice, setInvoice] = useState<models.InvoiceDetail>();

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      setInvoice(await api.retrieveInvoice({ id: invoiceId }));
    };

    load();
  }, [invoiceId]);

  return invoice ? <h2>{invoice.sequenceNum}</h2> : <h2>Loading</h2>;
}

export default InvoiceDetail;
