import { LoaderFunctionArgs, useLoaderData } from "react-router";
import * as models from "api/models";
import { getClient } from "apiClient";
import SideNav from "./SideNav";
import React from "react";
import Transactions from "./Transactions";

export const financeLoader = async ({ request }: LoaderFunctionArgs) => {
  const api = getClient();
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query") || undefined;

  if (query && query !== "null") {
    return api.listBankTransactions({ query });
  }

  return {
    bankDataPromise: Promise.all([
      api.listTagTypes(),
      api.listBankTransactions({ query }),
      api.listBankAccounts(),
    ]).then(([tagTypeResponse, transactionResponse, bankAccountResponse]) => ({
      tagTypeResponse,
      transactionResponse,
      bankAccountResponse,
    })),
  };
};

export default function Finance() {
  const loaderData = useLoaderData() as {
    bankDataPromise: Promise<{
      tagTypeResponse: models.ListTagTypes200Response;
      transactionResponse: models.ListBankTransactions200Response;
      bankAccountResponse: models.ListBankAccounts200Response;
    }>;
  };

  const bankDataPromise = loaderData.bankDataPromise;
  return (
    <div className="w-full h-full flex">
      <React.Suspense fallback={<div>Loading</div>}>
        <SideNav bankDataPromise={bankDataPromise} />
      </React.Suspense>

      <React.Suspense fallback={<div>Loading</div>}>
        <Transactions bankDataPromise={bankDataPromise} />
      </React.Suspense>
    </div>
  );
}
