import React from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";

import * as models from "api/models";
import Button from "components/Button";

interface Props {
  invoice: models.Invoice;
  project: models.Project;
  onIssue: () => void;
}

function InvoiceActions({ project, invoice, onIssue }: Props) {
  return (
    <div className="flex justify-between">
      <div className="text-gray-700">
        {project.name} #{project.nextSequenceNum}
      </div>
      <div className="flex">
        <Button
          title="Issue Invoice"
          variant="success"
          className="mx-1"
          onClick={onIssue}
        >
          Issue
        </Button>
      </div>
    </div>
  );
}

export default InvoiceActions;
