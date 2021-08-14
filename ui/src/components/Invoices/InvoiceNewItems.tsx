import React from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/outline";

import { InvoiceNewItem } from "invoices";
import { formatCurrency } from "currency";

interface Props {
  items: InvoiceNewItem[];
  onToggleItem: (item: InvoiceNewItem) => void;
}

function InvoiceNewItems({ items, onToggleItem }: Props) {
  return (
    <div className="my-4">
      <div className="uppercase bg-gray-100 flex flex-grow flex-wrap py-2 text-gray-600 text-sm md:text-base text-left px-2 sm:px-4 justify-between items-center">
        <div className="text-sm">Item</div>
        <div className="flex sm:w-1/4 justify-between mr-8">
          <div className="text-sm">Total</div>
        </div>
      </div>
      {items.map((item) => (
        <div className={!item.isActive ? "opacity-25" : ""}>
          <div className="flex my-3 px-2 sm:px-4 justify-between items-center hover:bg-blue-50">
            <div className="flex flex-wrap items-center flex-grow">
              <div className="text-gray-800 text-sm md:text-lg mr-2 w-full sm:w-auto">
                {item.title}
              </div>
              <div className="text-gray-500 text-sm">{item.subTitle}</div>
            </div>
            <div className="flex min-w-1/4 justify-between">
              <div className="text-sm">{formatCurrency(item.cost || 0)}</div>
            </div>
            <div
              className="p-2 cursor-pointer"
              onClick={() => onToggleItem(item)}
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
      ))}
    </div>
  );
}

export default InvoiceNewItems;
