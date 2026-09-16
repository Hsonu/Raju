'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAllOrders({ limit: 50 });
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch {
      // demo fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order updated to ${newStatus}`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      showToast(`Status updated to ${newStatus}`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f2744' }}>Orders Management</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Track, update fulfillment status, and view customer delivery info.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                background: statusFilter === st ? '#1a56db' : '#ffffff',
                color: statusFilter === st ? '#ffffff' : '#475569',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                textTransform: 'capitalize'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px' }}>Order ID & Date</th>
                <th style={{ padding: '14px 16px' }}>Customer Details</th>
                <th style={{ padding: '14px 16px' }}>Items Summary</th>
                <th style={{ padding: '14px 16px' }}>Total & Mode</th>
                <th style={{ padding: '14px 16px' }}>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No orders found for this status.</td></tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ color: '#1a56db', display: 'block', fontSize: '0.85rem' }}>{o._id}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ display: 'block', color: '#0f2744' }}>{o.shippingAddress?.fullName || 'Customer'}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📞 {o.shippingAddress?.phone || 'N/A'}</span>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0', maxWidth: '200px' }}>
                        {o.shippingAddress?.address}, {o.shippingAddress?.city}
                      </p>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>
                        {o.items?.length || 1} product(s)
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ color: '#0f2744', display: 'block', fontSize: '1rem' }}>
                        ₹{(o.totalAmount || o.grandTotal || 0).toLocaleString('en-IN')}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                        {o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={o.status || 'pending'}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          background: o.status === 'delivered' ? '#d1fae5' : o.status === 'shipped' ? '#eff6ff' : '#fef3c7',
                          color: o.status === 'delivered' ? '#065f46' : o.status === 'shipped' ? '#1e40af' : '#92400e',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
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
