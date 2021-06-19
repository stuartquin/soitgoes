import React from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/outline";

import * as models from "api/models";
import { TimeSlipTask } from "invoices";
import { formatCurrency } from "currency";

const getFormattedHours = (hours: number): string => {
  return hours.toFixed(2).replace(".", ":");
};

interface Props {
  item: TimeSlipTask;
  project: models.Project;
  invoice: models.Invoice;
  onToggle: (item: TimeSlipTask) => void;
}

function InvoiceToggleableItem({ invoice, project, item, onToggle }: Props) {
  const hasItem =
    item.grouping === "TimeSlip"
      ? invoice.timeslips.includes(item.id || 0)
      : invoice.tasks.includes(item.id || 0);

  return (
    <div className={!hasItem ? "opacity-25" : ""} key={item.id}>
      <div className="flex my-3 px-2 sm:px-4 justify-between items-center hover:bg-blue-50">
        <div className="flex flex-wrap items-center flex-grow">
          <div className="text-gray-800 text-sm md:text-lg mr-2 w-full sm:w-auto">
            {item.title}
          </div>
          <div className="text-gray-500 text-sm">{item.subTitle}</div>
        </div>
        <div className="flex min-w-1/4 justify-between">
          <div className="text-sm mr-3">
            {getFormattedHours(item.hours || 0)}
          </div>
          <div className="text-sm">{formatCurrency(item.cost || 0)}</div>
        </div>
        <div
          className="p-2 cursor-pointer"
          onClick={() => onToggle(item)}
          title="Toggle Item"
        >
          {hasItem ? (
            <MinusCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          ) : (
            <PlusCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceToggleableItem;
