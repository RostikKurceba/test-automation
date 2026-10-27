
import { describe, it, expect } from 'vitest';
import {
  calcSubtotal,
  calcDiscountRate,
  calcShipping,
  calcOrderTotal,
  type OrderItem,
} from '../src/order';

const item = (price: number, qty = 1): OrderItem => ({
  sku: 'SKU-1',
  price,
  qty,
});

describe('calcSubtotal', () => {
  it('обчислює суму позицій з урахуванням кількості', () => {
    expect(calcSubtotal([item(100, 2), item(50, 3)])).toBe(350);
  });

  it('відхиляє порожнє замовлення', () => {
    expect(() => calcSubtotal([])).toThrow('EMPTY_ORDER');
  });

  it('відхиляє від’ємну ціну', () => {
    expect(() => calcSubtotal([item(-0.01)])).toThrow('NEGATIVE_PRICE');
  });

  it.each([0, -1, 1.5])(
    'відхиляє некоректну кількість %s',
    (qty) => {
      expect(() => calcSubtotal([item(100, qty)])).toThrow('INVALID_QTY');
    },
  );

  it('приймає нульову ціну за коректної кількості', () => {
    expect(calcSubtotal([item(0, 1)])).toBe(0);
  });
});

describe('calcDiscountRate', () => {
  it.each([
    { tier: 'basic' as const, subtotal: 500, expected: 0 },
    { tier: 'silver' as const, subtotal: 500, expected: 0.05 },
    { tier: 'gold' as const, subtotal: 500, expected: 0.1 },
    { tier: 'basic' as const, subtotal: 2000, expected: 0.05 },
    { tier: 'gold' as const, subtotal: 2000, expected: 0.15 },
  ])(
    'визначає знижку $expected для рівня $tier і суми $subtotal',
    ({ tier, subtotal, expected }) => {
      expect(calcDiscountRate(tier, subtotal)).toBeCloseTo(expected, 4);
    },
  );

  it.each([
    { subtotal: 1999, expected: 0 },
    { subtotal: 2000, expected: 0.05 },
    { subtotal: 2001, expected: 0.05 },
  ])(
    'враховує межу великого замовлення $subtotal',
    ({ subtotal, expected }) => {
      expect(calcDiscountRate('basic', subtotal)).toBeCloseTo(expected, 4);
    },
  );

  it('обмежує сумарну знижку до 25 відсотків', () => {
    expect(calcDiscountRate('gold', 2000, 0.5)).toBe(0.25);
  });

  it('відхиляє від’ємну промоставку', () => {
    expect(() => calcDiscountRate('basic', 500, -0.1))
      .toThrow('INVALID_PROMO');
  });
});

describe('calcShipping', () => {
  it.each([
    [999, 60],
    [1000, 0],
    [1001, 0],
  ])('для суми %i повертає доставку %i', (amount, expected) => {
    expect(calcShipping(amount)).toBe(expected);
  });
});

describe('calcOrderTotal', () => {
  it('додає платну доставку до замовлення нижче порога', () => {
    expect(calcOrderTotal([item(500)], 'basic')).toBeCloseTo(560, 2);
  });

  it('надає безкоштовну доставку після знижки, якщо сума від 1000 грн', () => {
    expect(calcOrderTotal([item(1200)], 'gold')).toBeCloseTo(1080, 2);
  });

  it('додає доставку, якщо знижка знижує суму нижче 1000 грн', () => {
    expect(calcOrderTotal([item(1050)], 'gold')).toBeCloseTo(1005, 2);
  });

  it('передає помилку порожнього замовлення', () => {
    expect(() => calcOrderTotal([], 'gold')).toThrow('EMPTY_ORDER');
  });


  // Тимчасовий тест
//   it('викликає розрахунок без перевірки результату', () => {
//     calcOrderTotal([item(100)], 'silver');
//   });
});
