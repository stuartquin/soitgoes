import React from "react";

import * as models from "api/models";

interface Props {
  invoice: models.Invoice;
}

function InvoiceForm({ invoice }: Props) {
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
          htmlFor="due_date"
          className="block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <div className="mt-1">
          <input
            type="date"
            name="due_date"
            id="due_date"
            className="flex-1 block w-full sm:text-sm border border-gray-300 rounded p-2"
          />
        </div>
      </div>
    </form>
  );
}

export default InvoiceForm;
