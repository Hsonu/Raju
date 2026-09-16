'use client';
import { useState } from 'react';
import { Calendar, Download, RefreshCw, TrendingUp, IndianRupee, Sparkles } from 'lucide-react';

export default function FinanceOverviewHeader({ onRefresh, refreshing }) {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      padding: '24px 28px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 800,
            background: '#dcfce7',
            color: '#15803d',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={11} /> Real-Time Financial Sync
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Updated just now</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.02em', margin: 0 }}>
          Finance & Revenue Overview
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Real-time cash flow, hardware sales turnover, repair labor margins, and GST billing.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Time Range Selector */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: '10px',
          padding: '4px',
          gap: '2px',
          border: '1px solid #e2e8f0'
        }}>
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'year', label: 'YTD 2026' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeRange(t.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: timeRange === t.id ? '#ffffff' : 'transparent',
                color: timeRange === t.id ? '#0f2744' : '#64748b',
                fontWeight: timeRange === t.id ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: timeRange === t.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          style={{
            padding: '8px 14px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            color: '#334155',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
        </button>

        {/* Export statement */}
        <button
          onClick={() => alert('Financial statement CSV & GST report exported successfully!')}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #1e40af, #2563eb)',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          <Download size={14} /> Export Report
        </button>
      </div>
    </div>
  );
}
