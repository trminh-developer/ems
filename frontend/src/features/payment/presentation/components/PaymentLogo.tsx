import React from 'react';
import type { PaymentMethod } from '../../domain/entities/PaymentMethod';

export function PaymentLogo({ method }: { method: PaymentMethod }) {
  const [failed, setFailed] = React.useState(false);
  const images = method === 'card' ? ['visa', 'mastercard'] : [method === 'bank' ? 'bank' : method];
  return <span className="payment-method-logo" aria-hidden="true">
    {failed ? <i className={`bi ${method === 'bank' ? 'bi-bank' : 'bi-credit-card'}`} /> : images.map(brand =>
      <img key={brand} src={`/payments/${brand}.${brand === 'momo' ? 'png' : 'svg'}`} alt="" onError={() => setFailed(true)} />)}
  </span>;
}
