const SYMBOL_LOOKUP: any = {
  GBP: "£",
  USD: "$",
  SGD: "S$",
};

export const formatCurrency = (
  total: number,
  currency: string = "GBP",
  locale: string = "en-GB"
): string => {
  const value = parseInt(`${total}`);

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });
  return formatter.format(value);
};

export interface ExchangeRate {
  [currency: string]: number;
}
