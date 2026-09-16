'use client';
import { QrCode, CreditCard, Banknote, CheckCircle2, ArrowUpRight, ArrowDownRight, Clock, FileText, Inbox } from 'lucide-react';

export default function FinancialActivityGrid({ transactions = [] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '16px'
    }}>
      {/* 1. Recent Invoices & Transactions Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#2563eb" /> Recent Invoices & Settlements
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Latest verified customer payments in Kharghar</span>
          </div>

          <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 800, background: '#dcfce7', padding: '4px 10px', borderRadius: '6px' }}>
            ● Live Sync
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Invoice ID</th>
                <th style={{ padding: '10px 12px' }}>Customer & Item</th>
                <th style={{ padding: '10px 12px' }}>Payment Mode</th>
                <th style={{ padding: '10px 12px' }}>Amount (₹)</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t._id || t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#1e40af' }}>
                      {t._id ? `INV-${t._id.substring(t._id.length - 6).toUpperCase()}` : t.id}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ display: 'block', color: '#0f2744' }}>{t.customer || t.shippingAddress?.fullName || 'Customer'}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.item || (t.items?.[0]?.name) || 'Store Purchase'}</span>
                    </td>
                    <td style={{ padding: '12px', color: '#334155', fontWeight: 600 }}>
                      {t.method || t.paymentMethod || 'UPI / QR'}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 900, color: '#059669', fontSize: '0.95rem' }}>
                      ₹{(t.amount || t.totalAmount || t.grandTotal || t.total || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: '#dcfce7',
                        color: '#15803d',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <CheckCircle2 size={11} /> {t.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '40px 12px', textAlign: 'center', color: '#64748b' }}>
                    <Inbox size={32} color="#cbd5e1" style={{ margin: '0 auto 8px', display: 'block' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>No invoice records or customer transactions yet.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Payment Gateway & Collection Mode Breakdown */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={18} color="#059669" /> Payment Channels
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '18px' }}>
            Collection channels breakdown
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* UPI QR */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <QrCode size={16} color="#2563eb" />
                  <strong style={{ fontSize: '0.85rem', color: '#0f2744' }}>UPI / QR Pay</strong>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 800 }}>Instant</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Google Pay, PhonePe, Paytm QR</span>
            </div>

            {/* Credit/Debit Cards */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} color="#7c3aed" />
                  <strong style={{ fontSize: '0.85rem', color: '#0f2744' }}>Card / POS Terminal</strong>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 800 }}>Visa/Master</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Credit card, Debit card swipe</span>
            </div>

            {/* Cash at Store */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Banknote size={16} color="#059669" />
                  <strong style={{ fontSize: '0.85rem', color: '#0f2744' }}>Store Counter Cash</strong>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 800 }}>Direct</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Cash on Delivery / In-store counter</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '14px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Bank Settlement: Daily Auto-Payout active</span>
        </div>
      </div>
    </div>
  );
}
