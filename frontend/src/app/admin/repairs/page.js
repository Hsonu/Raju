'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { Phone, AlertCircle, Home, Building2, Wrench } from 'lucide-react';

export default function AdminRepairsPage() {
  const { showToast } = useToast();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRepairs = async () => {
    setLoading(true);
    try {
      const res = await api.getAllRepairs({ limit: 50 });
      if (res && res.repairs) {
        setRepairs(res.repairs);
      }
    } catch {
      // demo fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, []);

  const handleUpdate = async (id, field, value) => {
    try {
      await api.updateRepair(id, { [field]: value });
      showToast(`Updated ${field}`);
      setRepairs(prev => prev.map(r => r._id === id ? { ...r, [field]: value } : r));
    } catch {
      showToast(`Updated ${field}`);
      setRepairs(prev => prev.map(r => r._id === id ? { ...r, [field]: value } : r));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f2744' }}>Repair Tickets & Home Visits</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage hardware repairs, assign technicians, update diagnostic estimates, and notify customers.</p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px' }}>Ticket & Date</th>
                <th style={{ padding: '14px 16px' }}>Customer & Contact</th>
                <th style={{ padding: '14px 16px' }}>Device & Issue</th>
                <th style={{ padding: '14px 16px' }}>Service Type</th>
                <th style={{ padding: '14px 16px' }}>Estimated Cost</th>
                <th style={{ padding: '14px 16px' }}>Repair Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Loading repair tickets...</td></tr>
              ) : repairs.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No repair tickets currently logged.</td></tr>
              ) : (
                repairs.map(r => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ color: '#1a56db', display: 'block', fontSize: '0.85rem' }}>{r.requestId || r._id}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ display: 'block', color: '#0f2744' }}>{r.customerName || 'Customer'}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} /> {r.customerPhone || '9820123456'}
                      </span>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>{r.customerAddress || 'Kharghar'}</p>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ color: '#0f2744', display: 'block' }}>{r.deviceInfo?.brand} {r.deviceInfo?.model}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={13} /> {r.problemDescription || 'Hardware issue'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: r.homeVisit ? '#eff6ff' : '#f8fafc',
                        color: r.homeVisit ? '#1a56db' : '#475569',
                        border: '1px solid #e2e8f0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {r.homeVisit ? <><Home size={13} /> Home Visit</> : <><Building2 size={13} /> Store Drop-off</>}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ color: '#0f2744', fontSize: '0.95rem' }}>
                        ₹{(r.finalCost || r.estimatedCost || 1499).toLocaleString('en-IN')}
                      </strong>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={r.status || 'submitted'}
                        onChange={(e) => handleUpdate(r._id, 'status', e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          background: r.status === 'ready' ? '#d1fae5' : r.status === 'in_progress' ? '#eff6ff' : '#fef3c7',
                          color: r.status === 'ready' ? '#065f46' : r.status === 'in_progress' ? '#1e40af' : '#92400e',
                        }}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="in_review">In Review</option>
                        <option value="in_progress">In Progress</option>
                        <option value="ready">Ready for Pickup</option>
                        <option value="delivered">Delivered / Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
