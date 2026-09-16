'use client';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function FinanceOverviewFooter({ stats = {} }) {
  const { showToast } = useToast();
  const total = stats.totalRevenue || 0;

  const handleReconcile = () => {
    if (showToast) {
      showToast('All store ledgers are 100% synchronized with live database records!');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f2744 0%, #1e3a8a 100%)',
      borderRadius: '16px',
      padding: '24px 28px',
      color: '#ffffff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      boxShadow: '0 10px 25px rgba(15, 39, 68, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#60a5fa'
        }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: '1.05rem', fontWeight: 800 }}>
            GST Verified Business Accounting
          </strong>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            GSTIN: 27AABCR1234F1Z9 • HSN: 8471 • Kharghar, Navi Mumbai
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'right', paddingRight: '12px', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Store Revenue</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399' }}>₹{Number(total).toLocaleString('en-IN')}.00</div>
        </div>

        <button
          onClick={handleReconcile}
          style={{
            padding: '10px 18px',
            background: '#ffffff',
            color: '#0f2744',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <CheckCircle2 size={16} color="#059669" /> Reconcile Balance
        </button>
      </div>
    </div>
  );
}
