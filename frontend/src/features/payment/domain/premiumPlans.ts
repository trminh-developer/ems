import type { Plan } from './entities/Plan';

export const premiumPlans: Plan[] = [
  { id: '1_month', title: '1 Tháng', price: 3000, priceLabel: '3.000đ', discount: '', popular: false },
  { id: '6_months', title: '6 Tháng', price: 6000, priceLabel: '6.000đ', discount: '', popular: true },
  { id: '12_months', title: '12 Tháng', price: 9000, priceLabel: '9.000đ', discount: '', popular: false },
];

export const findPremiumPlan = (id: unknown) => premiumPlans.find(plan => plan.id === id);
