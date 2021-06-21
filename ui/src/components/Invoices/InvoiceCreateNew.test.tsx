import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, act, fireEvent } from "@testing-library/react";
import { addDays } from "date-fns";

import * as models from "api/models";
import InvoiceCreateNew from "./InvoiceCreateNew";
import * as api from "apiClient";
import * as Api from "api";

jest.mock("api");

const MOCK_HISTORY_PUSH = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: MOCK_HISTORY_PUSH,
  }),
}));

class MockApi extends Api.ApiApi {
  createInvoice = jest.fn(
    (args: any): Promise<any> =>
      Promise.resolve({
        id: 2,
        project: 1,
      })
  );

  async listTimeSlips(args: any): Promise<any> {
    return {
      results: [
        {
          id: 2018,
          user: 1,
          hours: 5.0,
          hourly_rate: 65.0,
          project: 1,
          task: 1,
          invoice: null,
          cost: 325.0,
          date: new Date("2021-06-07"),
        },
        {
          id: 2019,
          user: 1,
          hours: 5.0,
          hourly_rate: 65.0,
          project: 1,
          task: 1,
          invoice: null,
          cost: 325.0,
          date: new Date("2021-06-08"),
        },
        {
          id: 2023,
          user: 1,
          hours: 2.0,
          hourly_rate: 65.0,
          project: 1,
          task: 1,
          invoice: null,
          cost: 130.0,
          date: new Date("2021-06-15"),
        },
        {
          id: 2024,
          user: 1,
          hours: 2.0,
          hourly_rate: 65.0,
          project: 1,
          task: 2,
          invoice: null,
          cost: 130.0,
          date: new Date("2021-06-16"),
        },
      ],
    };
  }
  async listTasks(args: any): Promise<any> {
    return {
      results: [
        {
          id: 1,
          project: 1,
          name: "Test Task 1",
          cost: 0.0,
          created_at: new Date("2020-05-05T15:49:36.576987Z"),
          activity_at: new Date("2020-05-05T15:49:56.208097Z"),
          completed_at: new Date("2020-06-06T09:35:56.346884Z"),
          due_date: null,
          hours_spent: 0.0,
          hours_predicted: 0.0,
          billingType: models.TaskBillingTypeEnum.Time,
          state: "DONE",
          invoices: [317],
          notes: [],
        },
        {
          id: 2,
          project: 1,
          name: "Test Task 2",
          cost: 0.0,
          created_at: new Date("2020-05-05T15:49:36.576987Z"),
          activity_at: new Date("2020-05-05T15:49:56.208097Z"),
          completed_at: new Date("2020-06-06T09:35:56.346884Z"),
          due_date: null,
          hours_spent: 0.0,
          hours_predicted: 0.0,
          billingType: models.TaskBillingTypeEnum.Time,
          state: "DONE",
          invoices: [317],
          notes: [],
        },
        {
          id: 3,
          project: 1,
          name: "Test Task 3",
          cost: 300.0,
          created_at: new Date("2021-05-23T07:51:46.718809Z"),
          activity_at: new Date("2021-05-23T07:51:46.718866Z"),
          completed_at: null,
          due_date: null,
          hours_spent: 0.0,
          hours_predicted: 0.0,
          billingType: models.TaskBillingTypeEnum.Fixed,
          state: "OPEN",
          invoices: [],
          notes: [],
        },
      ],
    };
  }
  async listInvoiceModifiers(args: any): Promise<any> {
    return {
      results: [
        {
          id: 1,
          name: "VAT Added",
          percent: 20.0,
          created_at: new Date("2016-07-24T15:30:34.514984Z"),
        },
      ],
    };
  }
}

describe("InvoiceCreateNew", () => {
  let mockGetClient: any;
  let mockAPIInstance: any;

  const project = {
    id: 1,
    name: "Test Project 1",
  } as models.Project;

  beforeEach(() => {
    mockAPIInstance = new MockApi();

    mockGetClient = jest
      .spyOn(api, "getClient")
      .mockImplementation(() => mockAPIInstance);
  });

  afterEach(() => {
    mockGetClient.mockRestore();
    MOCK_HISTORY_PUSH.mockClear();
  });

  test("Displays totals summary", async () => {
    await act(async () => {
      const { findByText } = render(
        <BrowserRouter>
          <InvoiceCreateNew project={project} />
        </BrowserRouter>
      );
      await findByText("£1210");
      await findByText("£242");
      await findByText("£1452");
    });
  });

  test("Toggling timeslip updates totals", async () => {
    await act(async () => {
      const { findByText, findAllByTitle } = render(
        <BrowserRouter>
          <InvoiceCreateNew project={project} />
        </BrowserRouter>
      );
      const toggles = await findAllByTitle("Remove Item");
      await fireEvent.click(toggles[0]);

      await findByText("£885");
      await findByText("£177");
      await findByText("£1062");

      await fireEvent.click(toggles[0]);
      await findByText("£1210");
      await findByText("£242");
      await findByText("£1452");
    });
  });

  test("Change Group By Display", async () => {
    await act(async () => {
      const { findByText, findByLabelText } = render(
        <BrowserRouter>
          <InvoiceCreateNew project={project} />
        </BrowserRouter>
      );
      const groupBy = await findByLabelText("Group By");
      await findByText("Date");
      await findByText("2021-06-07");

      await fireEvent.change(groupBy, { target: { value: "tasks" } });

      await findByText("Task");
      await findByText("Test Task 1");
      await findByText("Test Task 2");
    });
  });

  test("Toggle TIME based task", async () => {
    await act(async () => {
      const { findByText, findAllByTitle, findByLabelText } = render(
        <BrowserRouter>
          <InvoiceCreateNew project={project} />
        </BrowserRouter>
      );
      const groupBy = await findByLabelText("Group By");
      await fireEvent.change(groupBy, { target: { value: "tasks" } });

      const toggles = await findAllByTitle("Remove Item");
      await fireEvent.click(toggles[0]);

      await findByText("£430");

      await fireEvent.click(toggles[0]);
      await findByText("£1210");
    });
  });

  test("Toggle FIXED task", async () => {
    await act(async () => {
      const { findByText, findAllByTitle, findByLabelText } = render(
        <BrowserRouter>
          <InvoiceCreateNew project={project} />
        </BrowserRouter>
      );
      const groupBy = await findByLabelText("Group By");
      await fireEvent.change(groupBy, { target: { value: "tasks" } });

      const toggles = await findAllByTitle("Remove Item");
      await fireEvent.click(toggles[2]);
      await findByText("£910");

      await fireEvent.click(toggles[2]);
      await findByText("£1210");
    });
  });

  test("Toggle Modifier", async () => {
    await act(async () => {
      const { findAllByText, findByText, findByTitle } = render(
        <BrowserRouter>
          <InvoiceCreateNew project={project} />
        </BrowserRouter>
      );
      const toggle = await findByTitle("Remove");
      await fireEvent.click(toggle);
      const totals = await findAllByText("£1210");
      expect(totals.length).toBe(2);
      await findByText("£242");

      await fireEvent.click(toggle);
      await findByText("£1210");
      await findByText("£242");
      await findByText("£1452");
    });
  });

  test("Issue Invoice", async () => {
    await act(async () => {
      const { findByTitle } = render(
        <BrowserRouter>
          <InvoiceCreateNew project={project} />
        </BrowserRouter>
      );
      await fireEvent.click(await findByTitle("Issue Invoice"));

      expect(MOCK_HISTORY_PUSH).toHaveBeenCalledWith("/invoices/1/2");

      const arg = mockAPIInstance.createInvoice.mock.calls[0][0];
      expect(arg["invoice"]["subtotalDue"]).toBe(1210);
      expect(arg["invoice"]["timeslips"]).toEqual([2018, 2019, 2023, 2024]);
    });
  });
});
