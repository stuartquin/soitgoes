import React, { useMemo } from "react";
import Button from "components/Button";

import * as models from "api/models";
import ActionLink from "components/ActionLink";

interface Props {
  invoice: models.Invoice;
  project: models.Project;
  onSetPaid: () => void;
  token?: models.OneTimeToken;
}

const getDownloadUrl = (
  token?: models.OneTimeToken,
  invoice?: models.Invoice
): string => {
  return token && invoice
    ? `/api/invoices/${invoice.id}/pdf?token=${token.key}`
    : "";
};

function InvoiceDateItems({ project, invoice, token, onSetPaid }: Props) {
  const downloadURL = getDownloadUrl(token, invoice);

  return (
    <div className="flex justify-between">
      <div className="text-gray-800 text-md sm:text-lg">
        #{invoice.sequenceNum} {project.name}
      </div>
      <div className="flex items-center">
        <ActionLink
          href={downloadURL}
          variant="primary"
          download={invoice.pdfName}
        >
          Download
        </ActionLink>
        {invoice.status === models.InvoiceStatusEnum.Issued && (
          <Button onClick={onSetPaid} variant="success" className="ml-2">
            Set Paid
          </Button>
        )}
      </div>
    </div>
  );
}

export default InvoiceDateItems;
