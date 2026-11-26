const { createCart, addItem, removeItem, countItems } = require('../src/cart');

const milk = { id: 'milk', title: 'Молоко', price: 80, quantity: 1, category: 'food' };
const bread = { id: 'bread', title: 'Хлеб', price: 40, quantity: 2, category: 'food' };

describe('createCart', () => {
  test('возвращает пустой массив', () => {
    const cart = createCart();
    expect(Array.isArray(cart)).toBe(true);
    expect(cart).toHaveLength(0);
  });
});

describe('addItem', () => {
  test('добавляет новый товар в пустую корзину', () => {
    const cart = addItem(createCart(), milk);

    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual(milk);
  });

  test('увеличивает количество существующего товара', () => {
    let cart = addItem(createCart(), milk);
    cart = addItem(cart, milk);

    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual({ ...milk, quantity: 2 });
  });
});

describe('removeItem', () => {
  test('удаляет товар по id', () => {
    const cart = addItem(addItem(createCart(), milk), bread);

    const result = removeItem(cart, 'milk');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(bread);
  });
});

describe('countItems', () => {
  test('считает общее количество единиц', () => {
    const cart = [milk, bread];

    // 1 + 2 = 3
    expect(countItems(cart)).toBe(3);
  });

  test('возвращает 0 для пустой корзины', () => {
    expect(countItems(createCart())).toBe(0);
  });
});
