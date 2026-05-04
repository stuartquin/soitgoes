const SYMBOL_LOOKUP: any = {
  GBP: "£",
  USD: "$",
  SGD: "S$",
};

export const formatCurrency = (
  total: number,
  currency: string = "GBP"
): string => {
  const symbol = SYMBOL_LOOKUP[currency] || "£";

  return `${symbol}${total.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export interface ExchangeRate {
  [currency: string]: number;
}
