import { isAfter } from "date-fns";
import * as models from "api/models";

export enum InvoiceStatus {
  Draft = "Draft",
  Paid = "Paid",
  Due = "Due",
  Overdue = "Overdue",
}

const STATUS_COLORS = {
  Draft: "gray-400",
  Paid: "green-600",
  Overdue: "red-400",
  Due: "yellow-600",
};

export const getInvoiceStatus = (
  issuedAt?: Date,
  paidAt?: Date | null,
  dueDate?: Date | null
): InvoiceStatus => {
  if (!issuedAt) {
    return InvoiceStatus.Draft;
  }

  if (paidAt) {
    return InvoiceStatus.Paid;
  }

  if (isAfter(new Date(), dueDate || new Date())) {
    return InvoiceStatus.Overdue;
  }
  return InvoiceStatus.Due;
};

export const getStatusColor = (status: InvoiceStatus): string => {
  return STATUS_COLORS[status];
};
