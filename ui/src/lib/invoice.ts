export const getDownloadUrl = (
  invoiceId?: number,
  token?: { key: string }
): string => {
  return token && invoiceId
    ? `/api/invoices/${invoiceId}/pdf?token=${token.key}`
    : invoiceId
    ? `/api/invoices/${invoiceId}/pdf`
    : "";
};
