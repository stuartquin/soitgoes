import * as models from "api/models";
import { format, isAfter } from "date-fns";
import { sumBy } from "lodash";
import { ensure } from "typeHelpers";

export enum InvoiceStatus {
  Draft = "Draft",
  Paid = "Paid",
  Due = "Due",
  Overdue = "Overdue",
}

export interface TimeSlipTask {
  timeSlips: models.TimeSlip[];
  task: models.Task;
  hours: number;
  cost: number;
  id: number;
  type: string;
  title: string;
  subTitle: string;
  isActive: boolean;
}

export const getGroupedByTime = (
  invoice: models.Invoice,
  tasks: models.Task[],
  timeSlips: models.TimeSlip[]
): TimeSlipTask[] => {
  return timeSlips.map((ts) => {
    const timeSlip = ensure(ts);
    const task = ensure(tasks.find((t) => t.id === timeSlip.task));
    const title = format(timeSlip.date, "yyyy-MM-dd");
    const subTitle = task.name;
    const isActive = invoice.timeslips.includes(ts.id || 0);

    return {
      task,
      timeSlips: [ensure(timeSlip)],
      hours: timeSlip.hours || 0,
      cost: timeSlip.cost || 0,
      id: ensure(timeSlip.id),
      type: "TimeSlip",
      isActive,
      title,
      subTitle,
    };
  });
};

export const getGroupedByTask = (
  invoice: models.Invoice,
  tasks: models.Task[],
  timeSlips: models.TimeSlip[]
): TimeSlipTask[] => {
  return tasks.map((task) => {
    const taskTimeSlips = timeSlips.filter(
      (t) => t.task === task.id && invoice.timeslips.includes(ensure(t.id))
    );
    const hours =
      task.billingType === models.TaskBillingTypeEnum.Fixed
        ? 0
        : sumBy(taskTimeSlips, "hours");

    const cost =
      task.billingType === models.TaskBillingTypeEnum.Fixed
        ? task.cost
        : sumBy(taskTimeSlips, "cost");

    const title = task.name;
    const subTitle = `${task.billingType}`;
    const isActive =
      invoice.tasks.includes(ensure(task.id)) || taskTimeSlips.length > 0;

    return {
      task,
      timeSlips: taskTimeSlips,
      hours: hours || 0,
      cost: cost || 0,
      type: "Task",
      id: ensure(task.id),
      isActive,
      title,
      subTitle,
    };
  });
};

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

export const calculateTotal = (
  subtotalDue: number,
  modifiers: models.InvoiceModifier[]
): number => {
  return (
    subtotalDue +
    modifiers.reduce(
      (acc, modifier) => acc + calculateModifierImpact(subtotalDue, modifier),
      0
    )
  );
};

export const getModifierLabel = (modifier: models.InvoiceModifier): string =>
  `${modifier.name} ${modifier.percent}%`;
