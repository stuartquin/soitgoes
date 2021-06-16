import React, { useMemo } from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/outline";

import InvoiceDateItem from "components/Invoices/InvoiceDateItem";
import * as models from "api/models";

interface Props {
  task: models.Task;
  project: models.Project;
  timeSlip: models.TimeSlip;
  invoice: models.Invoice;
  onToggleTimeSlip: (timeSlip: models.TimeSlip) => void;
}

function InvoiceToggleableItem({
  invoice,
  project,
  task,
  timeSlip,
  onToggleTimeSlip,
}: Props) {
  const hasTimeSlip = invoice.timeslips.includes(timeSlip.id || 0);

  return (
    <div className={!hasTimeSlip ? "opacity-25" : ""} key={timeSlip.id}>
      <InvoiceDateItem timeSlip={timeSlip} task={task} project={project}>
        <div
          className="p-2 cursor-pointer"
          onClick={() => onToggleTimeSlip(timeSlip)}
        >
          {hasTimeSlip ? (
            <MinusCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          ) : (
            <PlusCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          )}
        </div>
      </InvoiceDateItem>
    </div>
  );
}

export default InvoiceToggleableItem;
