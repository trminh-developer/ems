import React from 'react';
import { User } from '../../models';
import { isPremiumActive } from '../../utils/premium';

export default function UserBadge({ user }: { user: User }) {
  const premium = isPremiumActive(user);
  if (!user.isVerified && !premium) return null;
  const label = user.isVerified ? 'Đã xác minh danh tính' : 'Tích xanh Premium';
  return <i className="bi bi-patch-check-fill text-primary ms-1" title={label} aria-label={label} />;
}
