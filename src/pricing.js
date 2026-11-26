const { formatPrice, pluralizeItems } = require('./formatter');

/**
 * Считает подытог (без скидок) — сумму price * quantity по всем товарам.
 * @param {CartItem[]} cart
 * @returns {number}
 */
function getSubtotal(cart) {
  return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/**
 * Скидка за количество одного товара: от 3 шт — 5%, от 5 шт — 10%, от 10 шт — 15%.
 * Скидка применяется к строке (price * quantity) каждого товара.
 * @param {CartItem} item
 * @returns {number} сумма скидки в рублях (положительное число)
 */
function getQuantityDiscount(item) {
  const lineTotal = item.price * item.quantity;
  if (item.quantity >= 10) return lineTotal * 0.15;
  if (item.quantity >= 5) return lineTotal * 0.10;
  if (item.quantity >= 3) return lineTotal * 0.05;
  return 0;
}

/**
 * Скидка по категории: книги — 5%, электроника при подытоге >= 10000 — 7%, иначе 0.
 * @param {CartItem[]} cart
 * @returns {number} сумма скидки в рублях
 */
function getCategoryDiscount(cart) {
  const subtotal = getSubtotal(cart);
  let discount = 0;

  const booksTotal = cart
    .filter((i) => i.category === 'books')
    .reduce((s, i) => s + i.price * i.quantity, 0);
  discount += booksTotal * 0.05;

  if (subtotal >= 10000) {
    const electronicsTotal = cart
      .filter((i) => i.category === 'electronics')
      .reduce((s, i) => s + i.price * i.quantity, 0);
    discount += electronicsTotal * 0.07;
  }

  return discount;
}

/**
 * Скидка за количество единиц во всей корзине: от 10 шт — 3%, от 20 шт — 5%.
 * Применяется к подытогу целиком.
 * @param {CartItem[]} cart
 * @returns {number} сумма скидки в рублях
 */
function getBulkDiscount(cart) {
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = getSubtotal(cart);
  if (totalItems >= 20) return subtotal * 0.05;
  if (totalItems >= 10) return subtotal * 0.03;
  return 0;
}

/**
 * Итоговая сумма с учётом всех скидок. Не может быть меньше 0.
 * @param {CartItem[]} cart
 * @returns {number}
 */
function getTotal(cart) {
  const subtotal = getSubtotal(cart);
  const quantityDiscount = cart.reduce((s, i) => s + getQuantityDiscount(i), 0);
  const categoryDiscount = getCategoryDiscount(cart);
  const bulkDiscount = getBulkDiscount(cart);
  const total = subtotal - quantityDiscount - categoryDiscount - bulkDiscount;
  return Math.max(0, Number(total.toFixed(2)));
}

/**
 * Формирует человекочитаемую сводку корзины.
 * @param {CartItem[]} cart
 * @returns {{subtotal: string, total: string, itemsLabel: string, savings: string}}
 */
function buildSummary(cart) {
  const subtotal = getSubtotal(cart);
  const total = getTotal(cart);
  return {
    subtotal: formatPrice(subtotal),
    total: formatPrice(total),
    itemsLabel: pluralizeItems(cart.reduce((s, i) => s + i.quantity, 0)),
    savings: formatPrice(subtotal - total),
  };
}

module.exports = {
  getSubtotal,
  getQuantityDiscount,
  getCategoryDiscount,
  getBulkDiscount,
  getTotal,
  buildSummary,
};