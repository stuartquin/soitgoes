import {
  BankAccount,
  ListBankAccounts200Response,
  ListBankTransactions200Response,
  ListTagTypes200Response,
} from "api";
import React, { useMemo } from "react";
import TransactionTable from "./TransactionTable";
import TransactionQuery from "./TransactionQuery";
import { useFetcher } from "react-router";

type Props = {
  bankDataPromise: Promise<{
    tagTypeResponse: ListTagTypes200Response;
    transactionResponse: ListBankTransactions200Response;
    bankAccountResponse: ListBankAccounts200Response;
  }>;
};

export default function Transactions({ bankDataPromise }: Props) {
  const {
    tagTypeResponse,
    transactionResponse,
    bankAccountResponse,
  } = React.use(bankDataPromise);
  const fetcher = useFetcher<ListBankTransactions200Response>();
  const transactions = fetcher.data?.results || transactionResponse.results;

  const accountsById = useMemo(() => {
    return Object.fromEntries(
      bankAccountResponse.results.map((bankAccount) => [
        bankAccount.id,
        bankAccount,
      ])
    ) as Record<number, BankAccount>;
  }, [bankAccountResponse.results]);

  return (
    <div className="flex flex-col flex-grow p-6">
      <TransactionQuery
        tagTypes={tagTypeResponse.results}
        bankAccounts={bankAccountResponse.results}
        fetcher={fetcher}
      />
      <TransactionTable
        transactions={transactions}
        accountsById={accountsById}
      />
    </div>
  );
}
