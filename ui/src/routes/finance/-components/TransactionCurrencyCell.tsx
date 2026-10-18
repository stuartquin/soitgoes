import { formatCurrency } from "currency";

type Props = {
  value: number;
};

export default function TransactionCurrencyCell({ value }: Props) {
  return (
    <div
      className={`w-full text-right ${
        value < 0 ? "text-red-500" : "text-green-500"
      }`}
    >
      {formatCurrency(value)}
    </div>
  );
}
