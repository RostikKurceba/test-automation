import { describe, it, expect } from 'vitest';
import { calculateSimpleInterest } from '../src/simpleInterest';

describe('calculateSimpleInterest', () => {
  it('обчислює прості відсотки для коректних даних', () => {
    expect(calculateSimpleInterest(10000, 5, 3)).toBe(1500);
    expect(calculateSimpleInterest(5000, 8, 2)).toBe(800);
  });

  it('повертає нуль для граничних значень', () => {
    expect(calculateSimpleInterest(0, 5, 3)).toBe(0);
    expect(calculateSimpleInterest(10000, 5, 0)).toBe(0);
  });

  it('відхиляє від’ємну процентну ставку', () => {
    expect(() => calculateSimpleInterest(10000, -5, 3)).toThrow(
      'INVALID_RATE',
    );
    expect(() => calculateSimpleInterest(10000, Infinity, 3)).toThrow(
      'INVALID_RATE',
    );
  });

  it('відхиляє некоректну початкову суму', () => {
    expect(() => calculateSimpleInterest(-100, 5, 3)).toThrow(
      'INVALID_PRINCIPAL',
    );
    expect(() => calculateSimpleInterest(Infinity, 5, 3)).toThrow(
      'INVALID_PRINCIPAL',
    );
  });
});