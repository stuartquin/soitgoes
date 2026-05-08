import { DownloadIcon as ArrowDownTrayIcon } from "@heroicons/react/outline";
import { getClient } from "apiClient";
import ActionLink from "components/ActionLink";
import { getDownloadUrl } from "lib/invoice";
import React, { useCallback, useState } from "react";
import Spinner from "components/Spinner";

interface Props {
  invoiceId?: number;
  pdfName?: string;
  children?: React.ReactNode;
}

export default function DownloadButton({
  invoiceId,
  pdfName,
  children,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDownloading(true);
      try {
        const api = getClient();
        const token = await api.retrieveOneTimeToken();
        const url = getDownloadUrl(invoiceId, token);

        const link = document.createElement("a");
        link.href = url;
        link.download = pdfName || `invoice-${invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Failed to download invoice", error);
      } finally {
        setIsDownloading(false);
      }
    },
    [invoiceId, pdfName]
  );

  return (
    <ActionLink
      variant="primary"
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center justify-center"
    >
      {isDownloading ? (
        <Spinner />
      ) : children ? (
        children
      ) : (
        <ArrowDownTrayIcon className="h-6 w-6" />
      )}
    </ActionLink>
  );
}
