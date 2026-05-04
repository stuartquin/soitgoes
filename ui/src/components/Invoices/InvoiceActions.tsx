import React, { useCallback, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";

import * as models from "api/models";
import Button from "components/Button";
import Spinner from "components/Spinner";

interface Props {
  invoice: models.Invoice;
  project: models.Project;
  onIssue: () => Promise<void>;
}

function InvoiceActions({ project, invoice, onIssue }: Props) {
  const [issuing, setIssuing] = useState(false);

  const handleIssue = useCallback(async () => {
    setIssuing(true);
    try {
      await onIssue();
    } finally {
      setIssuing(false);
    }
  }, [onIssue]);

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
          onClick={handleIssue}
          disabled={issuing}
        >
          <span className="flex items-center">
            {issuing && <Spinner />}
            {issuing ? "Issuing..." : "Issue"}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default InvoiceActions;
