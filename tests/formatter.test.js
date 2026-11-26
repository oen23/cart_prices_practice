const { formatPrice, pluralizeItems } = require('../src/formatter');

describe('formatPrice', () => {
  test('форматирует число с копейками', () => {
    expect(formatPrice(1234.5)).toBe('1 234,50 ₽');
  });

  test('добавляет два знака после запятой к целому числу', () => {
    expect(formatPrice(100)).toBe('100,00 ₽');
  });

  test('бросает ошибку для строки', () => {
    expect(() => formatPrice('100')).toThrow('Amount must be a number');
  });

  test('бросает ошибку для NaN', () => {
    expect(() => formatPrice(NaN)).toThrow('Amount must be a number');
  });
});

describe('pluralizeItems', () => {
  test.each([
    [1, '1 товар'],
    [3, '3 товара'],
    [11, '11 товаров'],
    [21, '21 товар'],
    [22, '22 товара'],
    [25, '25 товаров'],
  ])('склоняет %i как «%s»', (count, expected) => {
    expect(pluralizeItems(count)).toBe(expected);
  });
});
