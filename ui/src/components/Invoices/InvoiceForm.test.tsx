import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";

import InvoiceForm from "./InvoiceForm";

jest.mock("api");

describe("InvoiceForm", () => {
  test("Displays initial values", async () => {
    const invoice = {
      project: 1,
      dueDate: new Date("2021-05-09"),
      reference: "Test Reference",
      timeslips: [],
      tasks: [],
    };

    const { findByLabelText } = render(
      <BrowserRouter>
        <InvoiceForm invoice={invoice} onUpdate={jest.fn()} />
      </BrowserRouter>
    );
    const reference = await findByLabelText("Reference");
    expect(reference).toHaveValue("Test Reference");

    const dueDate = await findByLabelText("Due Date");
    expect(dueDate).toHaveValue("2021-05-09");
  });

  test("Update Due Date", async () => {
    const invoice = {
      project: 1,
      dueDate: new Date("2021-05-09"),
      reference: "Test Reference",
      timeslips: [],
      tasks: [],
    };
    const onUpdate = jest.fn();
    const { findByLabelText } = render(
      <BrowserRouter>
        <InvoiceForm invoice={invoice} onUpdate={onUpdate} />
      </BrowserRouter>
    );

    await fireEvent.change(await findByLabelText("Due Date"), {
      target: { value: "2021-06-01" },
    });
    expect(onUpdate).toHaveBeenCalledWith({
      ...invoice,
      dueDate: new Date("2021-06-01"),
    });
  });
});
