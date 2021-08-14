import * as models from "api/models";
import { getGroupedByTime, getGroupedByTask } from "./invoices";

describe("getGroupedByTask", () => {
  const timeSlips = [
    {
      id: 1,
      hourlyRate: 50,
      cost: 150,
      hours: 3,
      task: 1,
      date: new Date("2020-05-08"),
    },
    {
      id: 2,
      hourlyRate: 50,
      cost: 150,
      hours: 3,
      task: 1,
      date: new Date("2020-05-12"),
    },
    {
      id: 3,
      hourlyRate: 50,
      cost: 150,
      hours: 3,
      task: 2,
      date: new Date("2020-05-12"),
    },
  ] as models.TimeSlip[];

  const tasks = [
    {
      id: 1,
      name: "Task 1",
      billingType: models.TaskBillingTypeEnum.Time,
    },
    {
      id: 2,
      name: "Task 2",
      billingType: models.TaskBillingTypeEnum.Time,
    },
  ] as models.Task[];

  test("Sets TIME based task isActive", async () => {
    const invoice = {
      project: 1,
      id: 1,
      timeslips: [1, 2],
      tasks: [],
    } as models.Invoice;
    const timeSlipItems = getGroupedByTime(invoice, tasks, timeSlips);

    const results = getGroupedByTask(invoice, tasks, timeSlipItems);
    expect(results[0].title).toBe("Task 1");
    expect(results[0].isActive).toBeTruthy();

    expect(results[1].title).toBe("Task 2");
    expect(results[1].isActive).toBeFalsy();
  });

  test("Calculates time based totals", async () => {
    const invoice = {
      project: 1,
      id: 1,
      timeslips: [1, 2, 3],
      tasks: [],
    } as models.Invoice;
    const timeSlipItems = getGroupedByTime(invoice, tasks, timeSlips);

    const results = getGroupedByTask(invoice, tasks, timeSlipItems);
    expect(results[0].title).toBe("Task 1");
    expect(results[0].hours).toBe(6);
    expect(results[0].cost).toBe(300);

    expect(results[1].title).toBe("Task 2");
    expect(results[1].hours).toBe(3);
    expect(results[1].cost).toBe(150);

    timeSlipItems[1].isActive = false;
    const updated = getGroupedByTask(invoice, tasks, timeSlipItems);
    expect(updated[0].title).toBe("Task 1");
    expect(updated[0].hours).toBe(3);
    expect(updated[0].cost).toBe(150);

    expect(updated[1].title).toBe("Task 2");
    expect(updated[1].hours).toBe(3);
    expect(updated[1].cost).toBe(150);
  });
});

describe("getCalculatedInvoice", () => {});

describe("getWeeklyInvoiceTasks", () => {});
