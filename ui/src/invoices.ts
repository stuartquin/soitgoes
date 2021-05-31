import { isAfter } from "date-fns";
import * as models from "api/models";

export enum InvoiceStatus {
  Draft = "Draft",
  Paid = "Paid",
  Due = "Due",
  Overdue = "Overdue",
}

export const getInvoiceStatus = (invoice: models.Invoice): InvoiceStatus => {
  if (!invoice.issuedAt) {
    return InvoiceStatus.Draft;
  }

  if (invoice.paidAt) {
    return InvoiceStatus.Paid;
  }

  if (isAfter(new Date(), invoice.dueDate || new Date())) {
    return InvoiceStatus.Overdue;
  }
  return InvoiceStatus.Due;
};
