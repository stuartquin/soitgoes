const CURRENCY_LOOKUP = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

export const asCurrency = (amount, currency, precision = 2) => {
  const symbol = CURRENCY_LOOKUP[currency] || '$';
  const fixed = precision > 0 ?
    parseFloat(amount).toFixed(precision):
    parseInt(amount, 10);
  const formatted = `${fixed}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  return amount ? `${symbol}${formatted}` : '';
};
