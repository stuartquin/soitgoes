import React from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";

import * as models from "api/models";
import Button from "components/Button";

interface Props {
  invoice: models.Invoice;
  project: models.Project;
}

function InvoiceActions({ project, invoice }: Props) {
  return (
    <div className="flex justify-between">
      <div className="text-gray-700">
        {project.name} #{project.nextSequenceNum}
      </div>
      <div className="flex">
        <Button variant="light" className="mx-1 flex">
          Payment Details <ChevronDownIcon className="w-4 ml-2" />
        </Button>
        <Button variant="success" className="mx-1">
          Issue
        </Button>
      </div>
    </div>
  );
}

export default InvoiceActions;
