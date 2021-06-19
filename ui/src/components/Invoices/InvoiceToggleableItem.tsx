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
  onToggle: (item: TimeSlipTask) => void;
}

function InvoiceToggleableItem({ project, item, onToggle }: Props) {
  return (
    <div className={!item.isActive ? "opacity-25" : ""} key={item.id}>
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
          title={item.isActive ? "Remove Item" : "Add Item"}
        >
          {item.isActive ? (
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
