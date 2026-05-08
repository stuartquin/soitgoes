import React from "react";
import Button from "components/Button";

import * as models from "api/models";
import DownloadButton from "components/Invoices/DownloadButton";

interface Props {
  invoice: models.Invoice;
  project: models.Project;
  onSetPaid: () => void;
}

function InvoiceDateItems({ project, invoice, onSetPaid }: Props) {
  return (
    <div className="flex justify-between">
      <div className="text-gray-800 text-md sm:text-lg">
        #{invoice.sequenceNum} {project.name}
      </div>
      <div className="flex items-center">
        <DownloadButton invoiceId={invoice.id} pdfName={invoice.pdfName}>
          Download
        </DownloadButton>
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
