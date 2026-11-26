const {
  getSubtotal,
  getQuantityDiscount,
  getCategoryDiscount,
  getBulkDiscount,
  getTotal,
} = require('../src/pricing');

const makeItem = (overrides = {}) => ({
  id: 'item',
  title: 'Товар',
  price: 100,
  quantity: 1,
  category: 'other',
  ...overrides,
});

describe('getQuantityDiscount', () => {
  test('нет скидки за 1 и 2 штуки', () => {
    expect(getQuantityDiscount(makeItem({ quantity: 1 }))).toBe(0);
    expect(getQuantityDiscount(makeItem({ quantity: 2 }))).toBe(0);
  });

  test('5% за 3–4 штуки', () => {
    // 100 * 3 = 300; 5% = 15
    expect(getQuantityDiscount(makeItem({ quantity: 3 }))).toBe(15);
    // 100 * 4 = 400; 5% = 20
    expect(getQuantityDiscount(makeItem({ quantity: 4 }))).toBe(20);
  });

  test('10% за 5–9 штук', () => {
    // 100 * 5 = 500; 10% = 50
    expect(getQuantityDiscount(makeItem({ quantity: 5 }))).toBe(50);
    // 100 * 9 = 900; 10% = 90
    expect(getQuantityDiscount(makeItem({ quantity: 9 }))).toBe(90);
  });

  test('15% за 10 штук и больше', () => {
    // 100 * 10 = 1000; 15% = 150
    expect(getQuantityDiscount(makeItem({ quantity: 10 }))).toBe(150);
    // 100 * 12 = 1200; 15% = 180
    expect(getQuantityDiscount(makeItem({ quantity: 12 }))).toBe(180);
  });
});

describe('getCategoryDiscount', () => {
  test('даёт 5% на книги', () => {
    const cart = [makeItem({ category: 'books', price: 1000 })];

    expect(getSubtotal(cart)).toBe(1000);
    expect(getCategoryDiscount(cart)).toBeCloseTo(50, 2);
  });

  test('не даёт 7% на электронику, если подытог меньше 10000', () => {
    const cart = [
      makeItem({ id: 'book', category: 'books', price: 1000 }),
      makeItem({ id: 'tv', category: 'electronics', price: 5000 }),
    ];

    expect(getSubtotal(cart)).toBe(6000);
    // только книги: 1000 * 5% = 50
    expect(getCategoryDiscount(cart)).toBeCloseTo(50, 2);
  });

  test('даёт 5% на книги и 7% на электронику при подытоге >= 10000', () => {
    const cart = [
      makeItem({ id: 'book', category: 'books', price: 1000 }),
      makeItem({ id: 'tv', category: 'electronics', price: 10000 }),
      // одежда увеличивает подытог, но скидки на неё нет
      makeItem({ id: 'shirt', category: 'clothing', price: 5000 }),
    ];

    expect(getSubtotal(cart)).toBe(16000);
    // книги: 1000 * 5% = 50; электроника: 10000 * 7% = 700
    // 7% считаются только с электроники, а не со всего подытога
    expect(getCategoryDiscount(cart)).toBeCloseTo(750, 2);
  });

  test('граница: подытог ровно 10000 включает 7% на электронику', () => {
    const cart = [makeItem({ category: 'electronics', price: 10000 })];

    expect(getSubtotal(cart)).toBe(10000);
    expect(getCategoryDiscount(cart)).toBeCloseTo(700, 2);
  });

  test('граница: подытог 9999.99 не включает 7% на электронику', () => {
    const cart = [makeItem({ category: 'electronics', price: 9999.99 })];

    expect(getSubtotal(cart)).toBe(9999.99);
    expect(getCategoryDiscount(cart)).toBe(0);
  });
});

describe('getTotal', () => {
  test('обычная корзина: итог = подытог − сумма всех скидок', () => {
    const cart = [
      // 100 * 3 = 300; скидка за количество 5% = 15; книги 5% = 15
      makeItem({ id: 'book', category: 'books', price: 100, quantity: 3 }),
      // 1000 * 10 = 10000; скидка за количество 15% = 1500; электроника 7% = 700
      makeItem({ id: 'laptop', category: 'electronics', price: 1000, quantity: 10 }),
    ];

    const subtotal = getSubtotal(cart); // 10300
    const quantityDiscount = cart.reduce((s, i) => s + getQuantityDiscount(i), 0); // 1515
    const categoryDiscount = getCategoryDiscount(cart); // 715
    const bulkDiscount = getBulkDiscount(cart); // 13 шт → 3% от 10300 = 309

    expect(subtotal).toBe(10300);
    expect(getTotal(cart)).toBeCloseTo(subtotal - quantityDiscount - categoryDiscount - bulkDiscount, 2);
    // 10300 − 1515 − 715 − 309 = 7761
    expect(getTotal(cart)).toBe(7761);
  });

  test('не уходит в минус, когда скидки перевешивают подытог', () => {
    // При обычных ценах проценты скидок (максимум ~27%) не могут превысить подытог,
    // поэтому защиту Math.max проверяем на корзине с отрицательной ценой.
    const cart = [makeItem({ id: 'weird', category: 'books', price: -1000, quantity: 10 })];

    expect(getTotal(cart)).toBe(0);
  });
});
