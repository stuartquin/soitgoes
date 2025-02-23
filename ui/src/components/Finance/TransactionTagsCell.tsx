import { BankTransaction } from "api";

type Props = {
  transaction: BankTransaction;
};

export default function TransactionTagsCell({ transaction }: Props) {
  return (
    <div className="flex gap-1">
      {transaction.tags.map((tag) => (
        <div className="text-gray-600 bg-gray-50 ring-gray-500/10 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
          <span>{tag.tagType}: </span>
          <strong>{tag.displayValue}</strong>
        </div>
      ))}
    </div>
  );
}
