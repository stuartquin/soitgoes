import { BankTransaction } from "apiv3";

type Props = {
  transaction: BankTransaction;
};

export default function TransactionTagsCell({ transaction }: Props) {
  return (
    <div className="flex gap-1">
      {transaction.tags.map((tag) => (
        <div
          key={`${tag.tag_type}:${tag.value}`}
          className="text-gray-600 bg-gray-50 ring-gray-500/10 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
        >
          <span>{tag.tag_type}: </span>
          <strong>{tag.display_value}</strong>
        </div>
      ))}
    </div>
  );
}
