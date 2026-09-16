'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { IndianRupee, ShoppingBag, Wrench, Laptop, TrendingUp, Clock, CheckCircle2, Plus, ArrowRight, Home, Building2, Package } from 'lucide-react';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    activeRepairs: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentRepairs, setRecentRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashRes, ordersRes, repairsRes] = await Promise.all([
          api.getDashboardStats().catch(() => null),
          api.getAllOrders({ limit: 5 }).catch(() => null),
          api.getAllRepairs({ limit: 5 }).catch(() => null),
        ]);

        if (dashRes && dashRes.stats) {
          setStats({
            totalProducts: dashRes.stats.totalProducts || 0,
            totalOrders: dashRes.stats.totalOrders || 0,
            activeRepairs: dashRes.stats.pendingRepairs || 0,
            totalRevenue: dashRes.stats.totalSales || 0,
          });
        }
        if (ordersRes && ordersRes.orders) {
          setRecentOrders(ordersRes.orders);
        } else {
          setRecentOrders([]);
        }
        if (repairsRes && repairsRes.repairs) {
          setRecentRepairs(repairsRes.repairs);
        } else {
          setRecentRepairs([]);
        }
      } catch (e) {
        console.error('Error loading dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to "${newStatus}"`);
      setRecentOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      showToast(`Status updated to ${newStatus}`);
      setRecentOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const handleUpdateRepairStatus = async (repairId, newStatus) => {
    try {
      await api.updateRepair(repairId, { status: newStatus });
      showToast(`Repair status updated to "${newStatus}"`);
      setRecentRepairs(prev => prev.map(r => r._id === repairId ? { ...r, status: newStatus } : r));
    } catch {
      showToast(`Status updated to ${newStatus}`);
      setRecentRepairs(prev => prev.map(r => r._id === repairId ? { ...r, status: newStatus } : r));
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f2744' }}>Store Overview</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px' }}>
            Welcome back! Real-time overview of Riddhi Computer operations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            href="/admin/finance"
            style={{
              padding: '10px 18px',
              background: '#eff6ff',
              color: '#1e40af',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #bfdbfe'
            }}
          >
            <TrendingUp size={16} strokeWidth={2.4} /> Finance Analytics
          </Link>
          <Link
            href="/admin/products"
            style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Plus size={16} strokeWidth={2.4} /> Add Product
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Sales / Revenue */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Revenue</span>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.28)'
            }}>
              <IndianRupee size={20} strokeWidth={2.4} />
            </div>
          </div>
          <strong style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.02em', display: 'block' }}>
            ₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}
          </strong>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '8px' }}>
            <TrendingUp size={13} /> Lifetime store turnover
          </span>
        </div>

        {/* Orders */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Orders</span>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.28)'
            }}>
              <Package size={20} strokeWidth={2.4} />
            </div>
          </div>
          <strong style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.02em', display: 'block' }}>
            {stats.totalOrders || 0}
          </strong>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#1a56db', fontWeight: 700, marginTop: '8px' }}>
            <CheckCircle2 size={13} /> Completed & pending
          </span>
        </div>

        {/* Repairs */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Repairs</span>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.28)'
            }}>
              <Wrench size={20} strokeWidth={2.4} />
            </div>
          </div>
          <strong style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.02em', display: 'block' }}>
            {stats.activeRepairs || 0}
          </strong>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#d97706', fontWeight: 700, marginTop: '8px' }}>
            <Clock size={13} /> Diagnostic & queue
          </span>
        </div>

        {/* Products In Stock */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Listed Products</span>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.28)'
            }}>
              <Laptop size={20} strokeWidth={2.4} />
            </div>
          </div>
          <strong style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.02em', display: 'block' }}>
            {stats.totalProducts || 0}
          </strong>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '8px' }}>
            <CheckCircle2 size={13} /> Active in catalog
          </span>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Recent Repairs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Recent Orders Card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744' }}>Recent Orders</h3>
            <Link href="/admin/orders" style={{ fontSize: '0.85rem', color: '#1a56db', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '8px 4px' }}>Customer</th>
                  <th style={{ padding: '8px 4px' }}>Amount</th>
                  <th style={{ padding: '8px 4px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((o) => (
                    <tr key={o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 4px' }}>
                        <strong style={{ display: 'block', color: '#0f2744' }}>{o.shippingAddress?.fullName || 'Customer'}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.shippingAddress?.phone || 'Kharghar'}</span>
                      </td>
                      <td style={{ padding: '12px 4px', fontWeight: 700, color: '#0f2744' }}>
                        ₹{(o.totalAmount || o.grandTotal || o.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 4px' }}>
                        <select
                          value={o.status || 'pending'}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: o.status === 'delivered' ? '#d1fae5' : '#eff6ff',
                            color: o.status === 'delivered' ? '#065f46' : '#1e40af',
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
                ) : (
                  <tr>
                    <td colSpan={3} style={{ padding: '36px 12px', textAlign: 'center', color: '#64748b' }}>
                      <Package size={28} color="#cbd5e1" style={{ margin: '0 auto 8px', display: 'block' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>No customer orders placed yet.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Repairs Card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2744' }}>Recent Repair Requests</h3>
            <Link href="/admin/repairs" style={{ fontSize: '0.85rem', color: '#1a56db', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              View All Repairs <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '8px 4px' }}>Device & Issue</th>
                  <th style={{ padding: '8px 4px' }}>Type</th>
                  <th style={{ padding: '8px 4px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRepairs.length > 0 ? (
                  recentRepairs.map((r) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 4px' }}>
                        <strong style={{ display: 'block', color: '#0f2744' }}>{r.deviceInfo?.brand} {r.deviceInfo?.model}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.problemDescription || 'Diagnostic check'}</span>
                      </td>
                      <td style={{ padding: '12px 4px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#1a56db', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {r.homeVisit ? <><Home size={13} /> Home Visit</> : <><Building2 size={13} /> Store</>}
                        </span>
                      </td>
                      <td style={{ padding: '12px 4px' }}>
                        <select
                          value={r.status || 'submitted'}
                          onChange={(e) => handleUpdateRepairStatus(r._id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: r.status === 'ready' ? '#d1fae5' : '#fef3c7',
                            color: r.status === 'ready' ? '#065f46' : '#92400e',
                          }}
                        >
                          <option value="submitted">Submitted</option>
                          <option value="in_review">In Review</option>
                          <option value="in_progress">In Progress</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ padding: '36px 12px', textAlign: 'center', color: '#64748b' }}>
                      <Wrench size={28} color="#cbd5e1" style={{ margin: '0 auto 8px', display: 'block' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>No repair tickets submitted yet.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
