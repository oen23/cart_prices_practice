/**
 * Форматирует число как цену в рублях.
 * @param {number} amount - сумма в рублях
 * @returns {string} строка вида "1 234,50 ₽"
 */
function formatPrice(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new Error('Amount must be a number');
  }
  const fixed = Math.abs(amount).toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const sign = amount < 0 ? '-' : '';
  return `${sign}${withSpaces},${decPart} ₽`;
}

/**
 * Склоняет слово "товар" по числу.
 * @param {number} count - количество товаров
 * @returns {string} например, "1 товар", "2 товара", "5 товаров"
 */
function pluralizeItems(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} товар`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} товара`;
  }
  return `${count} товаров`;
}

module.exports = { formatPrice, pluralizeItems };