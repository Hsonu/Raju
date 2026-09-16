'use client';
import { useState } from 'react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    { code: 'WELCOME10', type: 'percentage', value: 10, maxDiscount: 1000, minOrder: 999, active: true },
    { code: 'REPAIR500', type: 'fixed', value: 500, maxDiscount: 500, minOrder: 2000, active: true },
    { code: 'FESTIVE20', type: 'percentage', value: 20, maxDiscount: 2500, minOrder: 5000, active: true },
  ]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f2744' }}>Promo & Coupon Discounts</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Configure customer discount codes for laptop purchases and repair bookings.</p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
              <th style={{ padding: '14px 16px' }}>Coupon Code</th>
              <th style={{ padding: '14px 16px' }}>Discount Value</th>
              <th style={{ padding: '14px 16px' }}>Min Order Amount</th>
              <th style={{ padding: '14px 16px' }}>Max Cap</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px' }}>
                  <strong style={{ background: '#eff6ff', color: '#1a56db', padding: '4px 10px', borderRadius: '6px', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                    {c.code}
                  </strong>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#059669' }}>
                  {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                </td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>
                  ₹{c.minOrder.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>
                  ₹{c.maxDiscount.toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '999px', background: '#d1fae5', color: '#065f46', fontSize: '0.8rem', fontWeight: 700 }}>
                    ● Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
