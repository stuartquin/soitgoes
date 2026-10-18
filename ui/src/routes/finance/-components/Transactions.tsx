import { useMemo } from "react";

import { BankAccount, BankTransaction, TagType } from "apiv3";

import TransactionQuery from "./TransactionQuery";
import TransactionTable from "./TransactionTable";

type Props = {
  tagTypes: TagType[];
  bankAccounts: BankAccount[];
  transactions: BankTransaction[];
};

export default function Transactions({
  tagTypes,
  bankAccounts,
  transactions,
}: Props) {
  const accountsById = useMemo(() => {
    return Object.fromEntries(
      bankAccounts.map((bankAccount) => [bankAccount.id, bankAccount])
    ) as Record<number, BankAccount>;
  }, [bankAccounts]);

  return (
    <div className="flex flex-col flex-grow p-6">
      <TransactionQuery tagTypes={tagTypes} bankAccounts={bankAccounts} />
      <TransactionTable
        transactions={transactions}
        accountsById={accountsById}
      />
    </div>
  );
}
