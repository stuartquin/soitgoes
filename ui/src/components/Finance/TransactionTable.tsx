import {
  BankAccount,
  ListBankAccounts200Response,
  ListBankTransactions200Response,
} from "api";
import React, { useMemo } from "react";

type Props = {
  bankDataPromise: Promise<{
    transactionResponse: ListBankTransactions200Response;
    bankAccountResponse: ListBankAccounts200Response;
  }>;
};

export default function TransactionTable({ bankDataPromise }: Props) {
  const { transactionResponse, bankAccountResponse } = React.use(
    bankDataPromise
  );
  const transactions = transactionResponse.results;

  const accountsById = useMemo(() => {
    return Object.fromEntries(
      bankAccountResponse.results.map((bankAccount) => [
        bankAccount.id,
        bankAccount,
      ])
    ) as Record<number, BankAccount>;
  }, [bankAccountResponse.results]);

  return (
    <div className="flex-grow p-6 overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Account
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Description
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Date
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactions.map((transaction) => (
            <tr key={transaction.transactionId}>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                {accountsById[transaction.bankAccount]?.name}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                {transaction.description}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                {transaction.date?.toISOString()}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                {transaction.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
