const CURRENCY_LOOKUP = {
  GBP: '£',
  USD: '$',
};

export const asCurrency = (amount, currency) => {
  const symbol = CURRENCY_LOOKUP[currency] || '$';
  const fixed = parseFloat(amount).toFixed(2);
  const formatted = `${fixed}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  return amount ? `${symbol}${formatted}` : '';
};
