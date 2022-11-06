export function formatCurrency(value, unit = '') {
  const iranLocale = Intl.NumberFormat('fa-IR');
  return iranLocale.format(Number(value)) + ' ' + unit;
}
