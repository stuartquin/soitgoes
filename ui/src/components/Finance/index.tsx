import { LoaderFunctionArgs, useLoaderData } from "react-router";
import * as models from "api/models";
import { ApiApi } from "api";
import { getClient } from "apiClient";
import SideNav from "./SideNav";
import React from "react";
import TransactionTable from "./TransactionTable";

interface Props {
  projects: models.Project[];
  user: models.User;
}

export const financeLoader = async ({ request }: LoaderFunctionArgs) => {
  const api = getClient();

  return {
    bankDataPromise: Promise.all([
      api.listTagTypes(),
      api.listBankTransactions(),
      api.listBankAccounts(),
    ]).then(([tagTypeResponse, transactionResponse, bankAccountResponse]) => ({
      tagTypeResponse,
      transactionResponse,
      bankAccountResponse,
    })),
  };
};

export default function Finance({ projects, user }: Props) {
  const { bankDataPromise } = useLoaderData() as {
    bankDataPromise: Promise<{
      tagTypeResponse: models.ListTagTypes200Response;
      transactionResponse: models.ListBankTransactions200Response;
      bankAccountResponse: models.ListBankAccounts200Response;
    }>;
  };

  return (
    <div className="w-full h-full flex">
      <React.Suspense fallback={<div>Loading</div>}>
        <SideNav bankDataPromise={bankDataPromise} />
      </React.Suspense>

      <React.Suspense fallback={<div>Loading</div>}>
        <TransactionTable bankDataPromise={bankDataPromise} />
      </React.Suspense>
    </div>
  );
}
