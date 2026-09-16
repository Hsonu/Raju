'use client';
import { IndianRupee, TrendingUp, Laptop, Wrench, Receipt, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function FinancialMetricsGrid({ stats = {} }) {
  const totalRev = stats.totalRevenue ?? 0;
  const prodRev = stats.productRevenue ?? 0;
  const repRev = stats.repairRevenue ?? 0;
  const gstRev = stats.gstCollected ?? 0;
  const itemsSold = stats.laptopSalesCount ?? 0;
  const repairsDone = stats.devicesRepairedCount ?? 0;

  const metrics = [
    {
      title: 'TOTAL REVENUE TURNOVER',
      amount: totalRev,
      trend: totalRev > 0 ? '● Active' : '₹0.00',
      trendLabel: 'Gross Store Sales',
      subtext: 'Verified ledger turnover',
      icon: IndianRupee,
      badgeBg: 'linear-gradient(135deg, #10b981, #059669)',
      badgeShadow: 'rgba(16, 185, 129, 0.35)',
      trendColor: '#15803d',
      trendBg: '#dcfce7'
    },
    {
      title: 'LAPTOP & HARDWARE SALES',
      amount: prodRev,
      trend: `${itemsSold} Sold`,
      trendLabel: 'Store Orders',
      subtext: 'Direct hardware sales',
      icon: Laptop,
      badgeBg: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
      badgeShadow: 'rgba(37, 99, 235, 0.35)',
      trendColor: '#1d4ed8',
      trendBg: '#eff6ff'
    },
    {
      title: 'REPAIR LABOR & SERVICES',
      amount: repRev,
      trend: `${repairsDone} Completed`,
      trendLabel: 'Devices Repaired',
      subtext: 'Chip & hardware service fees',
      icon: Wrench,
      badgeBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      badgeShadow: 'rgba(245, 158, 11, 0.35)',
      trendColor: '#b45309',
      trendBg: '#fef3c7'
    },
    {
      title: 'GST TAX COLLECTED (18%)',
      amount: gstRev,
      trend: 'HSN 8471',
      trendLabel: 'GSTR-1 Compliant',
      subtext: 'CGST 9% + SGST 9% output tax',
      icon: Receipt,
      badgeBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      badgeShadow: 'rgba(139, 92, 246, 0.35)',
      trendColor: '#7c3aed',
      trendBg: '#f3e8ff'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px'
    }}>
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '22px 24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            {/* Top row: title & luxury gradient icon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {m.title}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.03em' }}>
                    ₹{Number(m.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '13px',
                background: m.badgeBg,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 6px 16px ${m.badgeShadow}`
              }}>
                <Icon size={22} strokeWidth={2.3} />
              </div>
            </div>

            {/* Bottom row: Real calculated badge & description */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: m.trendColor,
                background: m.trendBg,
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                {m.trend}
              </span>

              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                {m.trendLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
