import { User } from '../models';

export function isPremiumActive(user: User | null | undefined): boolean {
  return !!(user?.isPremium && user.premiumExpiresAt && new Date(user.premiumExpiresAt).getTime() > Date.now());
}

export function nextIdentityChange(lastChanged?: string): Date | null {
  if (!lastChanged) return null;
  const next = new Date(new Date(lastChanged).getTime() + 7 * 24 * 60 * 60 * 1000);
  return Number.isFinite(next.getTime()) && next.getTime() > Date.now() ? next : null;
}
