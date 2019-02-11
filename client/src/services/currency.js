const CURRENCY_LOOKUP = {
  GBP: '£',
  USD: '$',
};

export const asCurrency = (amount, currency) => {
  const symbol = CURRENCY_LOOKUP[currency] || '$';
  const formatted = `${amount}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  return amount ? `${symbol}${formatted}` : '';
};
