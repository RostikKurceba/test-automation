
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calcRefund(
  total: number,
  daysSincePurchase: number,
): number {
  if (!Number.isFinite(total) || total < 0) {
    throw new Error('INVALID_TOTAL');
  }

  if (
    !Number.isInteger(daysSincePurchase) ||
    daysSincePurchase < 0
  ) {
    throw new Error('INVALID_DAYS');
  }

  if (daysSincePurchase > 30) {
    throw new Error('RETURN_PERIOD_EXPIRED');
  }

  if (daysSincePurchase <= 14) {
    return round2(total);
  }

  return round2(total * 0.7);
}
