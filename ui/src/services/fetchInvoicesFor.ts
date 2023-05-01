/* eslint-disable camelcase */
import { LoaderFunctionArgs, defer } from "react-router-dom";

import { getClient } from "apiClient";
import { Invoice } from "api";

export const getInvoices = async (): Promise<Invoice[]> => {
  const api = getClient();
  console.log("getInvoices");
  const response = await api.listInvoices({
    limit: 20,
    offset: 0,
  });
  return response.results || [];
};

export const fetchInvoicesFor = async ({ request }: LoaderFunctionArgs) => {
  return await getInvoices();
};
