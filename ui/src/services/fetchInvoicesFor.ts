/* eslint-disable camelcase */

import { getClient } from "apiClient";
import { Invoice } from "api";

export const getInvoices = async (): Promise<Invoice[]> => {
  const api = getClient();
  const response = await api.listInvoices({
    limit: 20,
    offset: 0,
  });
  return response.results || [];
};

export const fetchInvoicesFor = async () => {
  return await getInvoices();
};
