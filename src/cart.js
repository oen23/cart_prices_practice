/**
 * @typedef {Object} CartItem
 * @property {string} id - уникальный идентификатор
 * @property {string} title - название товара
 * @property {number} price - цена за единицу
 * @property {number} quantity - количество
 * @property {string} category - категория ('electronics' | 'books' | 'clothing' | ...)
 */

/**
 * Создаёт пустую корзину.
 * @returns {CartItem[]}
 */
function createCart() {
  return [];
}

/**
 * Добавляет товар в корзину. Если товар с таким id уже есть — увеличивает quantity.
 * @param {CartItem[]} cart - текущая корзина
 * @param {CartItem} item - добавляемый товар
 * @returns {CartItem[]} новая корзина (иммутабельно)
 */
function addItem(cart, item) {
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    return cart.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
    );
  }
  return [...cart, { ...item }];
}

/**
 * Удаляет товар по id.
 * @param {CartItem[]} cart
 * @param {string} id
 * @returns {CartItem[]} новая корзина без товара (если не найден — та же по содержимому)
 */
function removeItem(cart, id) {
  return cart.filter((i) => i.id !== id);
}

/**
 * Изменяет количество товара. Если quantity <= 0 — товар удаляется.
 * @param {CartItem[]} cart
 * @param {string} id
 * @param {number} quantity - новое количество
 * @returns {CartItem[]}
 */
function updateQuantity(cart, id, quantity) {
  if (quantity <= 0) {
    return removeItem(cart, id);
  }
  return cart.map((i) => (i.id === id ? { ...i, quantity } : i));
}

/**
 * Считает общее количество единиц товара в корзине.
 * @param {CartItem[]} cart
 * @returns {number}
 */
function countItems(cart) {
  return cart.reduce((sum, i) => sum + i.quantity, 0);
}

module.exports = { createCart, addItem, removeItem, updateQuantity, countItems };