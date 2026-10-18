import { createFileRoute } from "@tanstack/react-router";

import {
  listBankAccountsOptions,
  listBankTransactionsOptions,
  listTagTypesOptions,
} from "apiv3/@tanstack/react-query.gen";
import Finance from "./-components/Finance";

type FinanceSearchParams = {
  query?: string;
};

export const Route = createFileRoute("/finance")({
  component: FinanceRoute,
  validateSearch: (search: Record<string, unknown>): FinanceSearchParams => {
    return {
      query: typeof search.query === "string" ? search.query : undefined,
    };
  },
  loaderDeps: ({ search: { query } }) => ({ query }),
  loader: async ({ deps: { query }, context: { queryClient } }) => {
    const [tagTypes, bankAccounts, transactions] = await Promise.all([
      queryClient.fetchQuery(listTagTypesOptions()),
      queryClient.fetchQuery(listBankAccountsOptions()),
      queryClient.fetchQuery(
        listBankTransactionsOptions({
          query: query ? { query } : {},
        })
      ),
    ]);

    return {
      tagTypes: tagTypes.results,
      bankAccounts: bankAccounts.results,
      transactions: transactions.results,
    };
  },
});

function FinanceRoute() {
  const { tagTypes, bankAccounts, transactions } = Route.useLoaderData();

  return (
    <Finance
      tagTypes={tagTypes}
      bankAccounts={bankAccounts}
      transactions={transactions}
    />
  );
}
