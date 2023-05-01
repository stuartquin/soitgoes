import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, act, fireEvent } from "@testing-library/react";

import * as models from "api/models";
import InvoiceCreateNew from "./InvoiceCreateNew";
import { ApiApi } from "api/apis/ApiApi";

const MOCK_HISTORY_PUSH = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: MOCK_HISTORY_PUSH,
  }),
}));

class MockApi extends ApiApi {
  createInvoice = jest.fn(
    (args: any): Promise<any> =>
      Promise.resolve({
        id: 2,
        project: 1,
      })
  );

  async retrieveExchangeRate(): Promise<any> {
    return {
      rates: {
        GBP: 1,
        USD: 1.38,
        SGD: 1.88,
      },
    };
  }

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

jest.mock("apiClient", () => {
  const originalModule = jest.requireActual("apiClient");
  return {
    ...originalModule,
    getClient: () => {
      return new MockApi();
    },
  };
});

describe("InvoiceCreateNew", () => {
  const project = {
    id: 1,
    name: "Test Project 1",
  } as models.Project;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Displays totals summary", async () => {
    await act(async () => {
      const { findByText } = render(
        <BrowserRouter>
          <InvoiceCreateNew projects={[project]} />
        </BrowserRouter>
      );
      await findByText("£1210");
      await findByText("£242");
      await findByText("£1452");
    });
  });
});
