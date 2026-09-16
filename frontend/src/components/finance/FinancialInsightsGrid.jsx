'use client';
import { useState } from 'react';
import { BarChart3, Target, ShieldCheck } from 'lucide-react';

export default function FinancialInsightsGrid({ stats = {} }) {
  const totalRev = stats.totalRevenue || 0;
  const prodRev = stats.productRevenue || 0;
  const repRev = stats.repairRevenue || 0;

  const targetGoal = Math.max(100000, Math.ceil((totalRev * 1.3) / 10000) * 10000);
  const completionPercent = targetGoal > 0 ? Math.min(100, Math.round((totalRev / targetGoal) * 100)) : 0;
  const remainingNeeded = Math.max(0, targetGoal - totalRev);

  const prodPercent = totalRev > 0 ? Math.round((prodRev / totalRev) * 100) : 0;
  const repPercent = totalRev > 0 ? 100 - prodPercent : 0;

  const currentMonthName = new Date().toLocaleString('en-US', { month: 'short' });

  // Generate clean real / current distribution
  const chartData = stats.monthlyAggregation && stats.monthlyAggregation.length > 0
    ? stats.monthlyAggregation.map((m) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const name = monthNames[(m._id?.month || 1) - 1] || 'Month';
        return {
          month: name,
          total: m.hardwareRevenue || 0,
          hardware: m.hardwareRevenue || 0,
          repair: 0,
        };
      })
    : [
        { month: currentMonthName, total: totalRev, hardware: prodRev, repair: repRev, isCurrent: true }
      ];

  const maxVal = Math.max(...chartData.map((d) => d.total), targetGoal, 1000);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.7fr 1fr',
      gap: '16px'
    }}>
      {/* 1. Cashflow & Revenue Bar Chart Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744', margin: 0 }}>
                Revenue & Cash Flow Analytics
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Live verified database revenue stream</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#1e40af' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#2563eb', display: 'inline-block' }} /> Hardware
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#d97706' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f59e0b', display: 'inline-block' }} /> Repairs
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', paddingTop: '20px', borderBottom: '1px solid #f1f5f9' }}>
          {chartData.map((item, idx) => {
            const hwHeight = maxVal > 0 ? (item.hardware / maxVal) * 100 : 0;
            const repHeight = maxVal > 0 ? (item.repair / maxVal) * 100 : 0;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                  maxWidth: '80px',
                  padding: '0 8px'
                }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#1e40af',
                  background: '#eff6ff',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  ₹{Number(item.total).toLocaleString('en-IN')}
                </div>

                <div style={{
                  width: '100%',
                  maxWidth: '38px',
                  height: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid #e2e8f0'
                }}>
                  {/* Repair part (top) */}
                  <div
                    style={{
                      height: `${repHeight}%`,
                      background: 'linear-gradient(180deg, #fbbf24, #f59e0b)',
                      width: '100%',
                      transition: 'height 0.5s ease'
                    }}
                    title={`Repairs: ₹${item.repair}`}
                  />
                  {/* Hardware part (bottom) */}
                  <div
                    style={{
                      height: `${hwHeight}%`,
                      background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                      width: '100%',
                      transition: 'height 0.5s ease'
                    }}
                    title={`Hardware: ₹${item.hardware}`}
                  />
                </div>

                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#0f2744'
                }}>
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.82rem', color: '#64748b' }}>
          <span>Store Status: <strong style={{ color: '#15803d' }}>Live Accounting Active</strong></span>
          <span style={{ color: '#2563eb', fontWeight: 700 }}>Total Revenue: ₹{Number(totalRev).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* 2. Target Goal & Revenue Distribution Card */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Target size={18} color="#059669" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744', margin: 0 }}>
              Store Sales Target
            </h3>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Target Goal</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f2744' }}>₹{Number(targetGoal).toLocaleString('en-IN')}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 800 }}>{completionPercent}% Reached</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>₹{Number(totalRev).toLocaleString('en-IN')} done</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: '10px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${completionPercent}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #10b981, #059669)', transition: 'width 0.5s ease' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', display: 'block' }}>
              {remainingNeeded > 0 ? `₹${Number(remainingNeeded).toLocaleString('en-IN')} needed to reach store goal` : 'Goal achieved! 🎉'}
            </span>
          </div>

          {/* Revenue Distribution Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                <span>Hardware Products ({prodPercent}%)</span>
                <span>₹{Number(prodRev).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ height: '6px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ width: `${prodPercent}%`, height: '100%', background: '#2563eb', transition: 'width 0.5s ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                <span>Repair Services ({repPercent}%)</span>
                <span>₹{Number(repRev).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ height: '6px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ width: `${repPercent}%`, height: '100%', background: '#f59e0b', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> Certified Store Audit
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Kharghar, Navi Mumbai</span>
        </div>
      </div>
    </div>
  );
}
