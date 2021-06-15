import * as models from "api/models";
import { isAfter } from "date-fns";
import { sumBy } from "lodash";

export enum InvoiceStatus {
  Draft = "Draft",
  Paid = "Paid",
  Due = "Due",
  Overdue = "Overdue",
}

//  Trick tailwind optimiser
//  text-gray-400   border-gray-400
//  text-green-600  border-green-600
//  text-red-400    border-red-400
//  text-yellow-600 border-yellow-600

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

export const calculateSubTotal = (
  tasks: models.Task[],
  timeSlips: models.TimeSlip[]
): number => {
  return (
    sumBy(timeSlips, (t) => t.cost || 0) +
    sumBy(
      tasks.filter((t) => t.billingType === models.TaskBillingTypeEnum.Fixed),
      (t) => t.cost || 0
    )
  );
};

export const calculateModifierImpact = (
  subtotalDue: number,
  modifier: models.InvoiceModifier
): number => {
  return (subtotalDue / 100.0) * (modifier.percent || 0);
};

export const getModifierLabel = (modifier: models.InvoiceModifier): string =>
  `${modifier.name} ${modifier.percent}%`;
