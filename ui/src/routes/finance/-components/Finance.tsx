import { BankAccount, BankTransaction, TagType } from "apiv3";

import SideNav from "./SideNav";
import Transactions from "./Transactions";

type Props = {
  tagTypes: TagType[];
  bankAccounts: BankAccount[];
  transactions: BankTransaction[];
};

export default function Finance({
  tagTypes,
  bankAccounts,
  transactions,
}: Props) {
  return (
    <div className="w-full h-full flex">
      <SideNav tagTypes={tagTypes} bankAccounts={bankAccounts} />
      <Transactions
        tagTypes={tagTypes}
        bankAccounts={bankAccounts}
        transactions={transactions}
      />
    </div>
  );
}
