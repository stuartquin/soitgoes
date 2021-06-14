import React, { useMemo } from "react";
import Button from "components/Button";

import * as models from "api/models";

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
      <div className="text-gray-800 text-lg sm:text-xl">
        #{invoice.sequenceNum} {project.name}
      </div>
      <div className="flex items-center">
        <a
          href={downloadURL}
          download={invoice.pdfName}
          className="text-blue-800 mr-2"
        >
          Download
        </a>
        {invoice.status === models.InvoiceStatusEnum.Issued && (
          <Button onClick={onSetPaid} variant="success">
            Set Paid
          </Button>
        )}
      </div>
    </div>
  );
}

export default InvoiceDateItems;
