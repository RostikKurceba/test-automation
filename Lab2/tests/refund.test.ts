
import { describe, it, expect } from 'vitest';
import { calcRefund } from '../src/refund';

describe('calcRefund', () => {
  it.each([
    { days: 0, expected: 100 },
    { days: 13, expected: 100 },
    { days: 14, expected: 100 },
    { days: 15, expected: 70 },
    { days: 29, expected: 70 },
    { days: 30, expected: 70 },
  ])(
    'повертає $expected грн за $days днів після покупки',
    ({ days, expected }) => {
      expect(calcRefund(100, days)).toBe(expected);
    },
  );

  it('заокруглює часткове повернення до копійок', () => {
    expect(calcRefund(99.99, 15)).toBe(69.99);
  });

  it('повертає нуль для замовлення нульової вартості', () => {
    expect(calcRefund(0, 10)).toBe(0);
  });

  it('відхиляє повернення після 30 днів', () => {
    expect(() => calcRefund(100, 31))
      .toThrow('RETURN_PERIOD_EXPIRED');
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    'відхиляє некоректну суму %s',
    (total) => {
      expect(() => calcRefund(total, 10)).toThrow('INVALID_TOTAL');
    },
  );

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'відхиляє некоректну кількість днів %s',
    (days) => {
      expect(() => calcRefund(100, days)).toThrow('INVALID_DAYS');
    },
  );
});
