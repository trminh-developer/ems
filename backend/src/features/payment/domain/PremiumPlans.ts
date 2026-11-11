export const PREMIUM_PLANS = {
  '1_month': { months: 1, price: 99000, title: '1 Tháng' },
  '6_months': { months: 6, price: 499000, title: '6 Tháng' },
  '12_months': { months: 12, price: 899000, title: '12 Tháng' },
} as const;

export function getPremiumPlan(planId: string) {
  if (!Object.prototype.hasOwnProperty.call(PREMIUM_PLANS, planId)) {
    throw Object.assign(new Error('Gói Premium không hợp lệ.'), { statusCode: 400 });
  }
  return PREMIUM_PLANS[planId as keyof typeof PREMIUM_PLANS];
}

export function extendPremium(currentExpiry: Date | string | null, months: number): Date {
  const now = new Date();
  const current = currentExpiry ? new Date(currentExpiry) : now;
  const base = current > now ? current : now;
  const result = new Date(base);
  // Clamp dates for shorter months, e.g. January 31 -> February 28.
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(base.getUTCDate(), lastDay));
  return result;
}
