import { BankAccount, BankTransaction } from "api";
import TransactionTagsCell from "./TransactionTagsCell";
import { format } from "date-fns";
import TransactionCurrencyCell from "./TransactionCurrencyCell";

type Props = {
  transactions: BankTransaction[];
  accountsById: Record<number, BankAccount>;
};

export default function TransactionTable({
  transactions,
  accountsById,
}: Props) {
  return (
    <div className="flex-grow overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="sticky top-0 bg-white">
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
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 text-right"
            >
              Amount
            </th>
            <th
              scope="col"
              className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Tags
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactions.map((transaction) => (
            <tr key={transaction.transactionId} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                {accountsById[transaction.bankAccount]?.name}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                {transaction.description}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                {transaction.date
                  ? format(transaction.date, "dd/MM/yyyy")
                  : "-"}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                {transaction.amount !== undefined ? (
                  <TransactionCurrencyCell value={transaction.amount / 100} />
                ) : (
                  "-"
                )}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <TransactionTagsCell transaction={transaction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
