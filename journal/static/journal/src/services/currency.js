const CURRENCY_LOOKUP = {
  GBP: '£',
  USD: '$',
};

export const asCurrency = (amount, currency) => {
  const symbol = CURRENCY_LOOKUP[currency] || '$';

  return `${symbol}${amount.toFixed(2)}`;
};
