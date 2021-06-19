import React from "react";

import * as models from "api/models";

interface Props {
  invoice: models.Invoice;
  onChangeGroupBy: (groupBy: models.InvoiceGroupByEnum) => void;
}

function InvoiceForm({ invoice, onChangeGroupBy }: Props) {
  return (
    <form action="#" method="POST" className="w-full sm:w-auto">
      <div className="my-4">
        <label
          htmlFor="reference"
          className="block text-sm font-medium text-gray-700"
        >
          Reference
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            name="reference"
            id="reference"
            className="flex-1 block w-full rounded-none sm:text-sm border border-gray-300 rounded p-2"
          />
        </div>
      </div>

      <div className="my-4">
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <div className="mt-1">
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            className="flex-1 block w-full sm:text-sm border border-gray-300 rounded p-2"
          />
        </div>
      </div>

      <div className="my-4">
        <label
          htmlFor="groupBy"
          className="block text-sm font-medium text-gray-700"
        >
          Group By
        </label>
        <div className="mt-1">
          <select
            name="groupBy"
            id="groupBy"
            className="flex-1 block w-full sm:text-sm border border-gray-300 rounded p-2"
            value={invoice.groupBy}
            onChange={(event) =>
              onChangeGroupBy(event.target.value as models.InvoiceGroupByEnum)
            }
          >
            <option value={models.InvoiceGroupByEnum.Timeslips}>
              {models.InvoiceGroupByEnum.Timeslips}
            </option>
            <option value={models.InvoiceGroupByEnum.Tasks}>
              {models.InvoiceGroupByEnum.Tasks}
            </option>
          </select>
        </div>
      </div>
    </form>
  );
}

export default InvoiceForm;
