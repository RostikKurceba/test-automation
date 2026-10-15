export function calculateSimpleInterest(
  principal: number,
  annualRate: number,
  years: number,
): number {
  if (!Number.isFinite(principal) || principal < 0) {
    throw new Error('INVALID_PRINCIPAL');
  }

  if (!Number.isFinite(annualRate) || annualRate < 0) {
    throw new Error('INVALID_RATE');
  }

  if (!Number.isFinite(years) || years < 0) {
    throw new Error('INVALID_YEARS');
  }

  const interest = (principal * annualRate * years) / 100;

  return Math.round((interest + Number.EPSILON) * 100) / 100;
}