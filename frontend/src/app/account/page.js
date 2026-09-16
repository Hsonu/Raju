.











'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Package, Wrench, User, MapPin, LogOut } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;
      setLoadingData(true);
      try {
        const [ordersRes, repairsRes] = await Promise.all([
          api.getMyOrders().catch(() => ({ orders: [] })),
          api.getMyRepairs().catch(() => ({ repairs: [] })),
        ]);
        setOrders(ordersRes?.orders || []);
        setRepairs(repairsRes?.repairs || []);
      } catch {
        // demo fallback
      } finally {
        setLoadingData(false);
      }
    }
    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading account...</p>
        </div>
        <Footer />
      </>
    );
  }

  const getStatusClass = (status) => {
    if (status === 'delivered') return 'delivered';
    if (status === 'cancelled') return 'cancelled';
    return 'pending';
  };

  return (
    <>
      <Header />
      <main className="page-content">
        {/* Account Header */}
        <div style={{ background: 'var(--color-primary)', color: 'var(--color-white)', padding: 'var(--space-10) 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--color-primary-light)', color: 'var(--color-white)',
                fontSize: 'var(--font-size-3xl)', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, margin: 0 }}>{user.name}</h1>
                <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0', fontSize: 'var(--font-size-sm)' }}>{user.email} {user.phone ? `• ${user.phone}` : ''}</p>
                {user.role === 'admin' && (
                  <Link href="/admin" style={{ display: 'inline-block', marginTop: 'var(--space-2)', background: '#eab308', color: '#000', fontSize: 'var(--font-size-xs)', fontWeight: 800, padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}>
                    👑 Go to Admin Dashboard →
                  </Link>
                )}
              </div>
            </div>

            <button
              onClick={() => { logout(); showToast('Logged out successfully'); router.push('/'); }}
              className="btn"
              style={{
                background: 'rgba(239, 68, 68, 0.15)', color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)', fontWeight: 700
              }}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>

        <div className="container page-content-inner">
          {/* Tabs Nav */}
          <div className="tab-nav">
            {[
              { key: 'orders', label: `Orders (${orders.length})`, icon: Package },
              { key: 'repairs', label: `Repair Requests (${repairs.length})`, icon: Wrench },
              { key: 'profile', label: 'Profile & Settings', icon: User },
              { key: 'addresses', label: 'Saved Addresses', icon: MapPin },
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                >
                  <IconComp size={16} strokeWidth={isActive ? 2.4 : 2} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Orders */}
          {activeTab === 'orders' && (
            <div className="content-card">
              <h3 className="content-card-title">My Purchase History</h3>
              {loadingData ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <p>You have not placed any product orders yet.</p>
                  <Link href="/products" className="btn btn-primary">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {orders.map(o => (
                    <div key={o.orderId || o._id} className="item-row">
                      <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Order ID:</span>
                          <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-light)', fontFamily: 'monospace' }}>{o.orderId || o._id}</strong>
                        </div>
                        <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-1) 0 var(--space-2)' }}>
                          {o.items?.[0]?.name ? (
                            o.items.length > 1 ? `${o.items[0].name} + ${o.items.length - 1} more item(s)` : o.items[0].name
                          ) : `${o.items?.length || 1} item(s)`}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          <strong style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>₹{(o.total || o.totalAmount || 0)?.toLocaleString('en-IN')}</strong>
                          <span>•</span>
                          <span>{o.paymentMethod?.toUpperCase()}</span>
                          <span>•</span>
                          <span>Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                        <span className={`status-badge ${getStatusClass(o.status)}`}>
                          {o.status || 'Placed'}
                        </span>
                        <Link href={`/track-order?id=${o.orderId || o._id}`} className="btn btn-primary btn-sm">
                          Track 🚚
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Repairs */}
          {activeTab === 'repairs' && (
            <div className="content-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 className="content-card-title" style={{ marginBottom: 0 }}>My Repair Bookings</h3>
                <Link href="/book-repair" className="btn btn-primary btn-sm">
                  + Book New Repair
                </Link>
              </div>

              {loadingData ? (
                <p>Loading repair bookings...</p>
              ) : repairs.length === 0 ? (
                <div className="empty-state">
                  <p>No repair requests found.</p>
                  <Link href="/book-repair" className="btn" style={{ background: 'var(--color-primary)', color: 'var(--color-white)' }}>
                    Book Laptop Repair
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {repairs.map(r => (
                    <div key={r.requestId || r._id} className="item-row">
                      <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Ticket ID:</span>
                          <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-light)', fontFamily: 'monospace' }}>{r.requestId || r._id}</strong>
                        </div>
                        <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-1) 0 var(--space-2)' }}>
                          {(r.brand || r.deviceInfo?.brand || 'Device')} {(r.model || r.deviceInfo?.model || '')} — {(r.problem || r.problemDescription || r.serviceRequired?.replace(/_/g, ' ') || 'Repair Request')}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          <span>{r.homeVisit ? '🏠 Home Visit' : '🏢 Store Drop-off'}</span>
                          <span>•</span>
                          <span>Service: {r.serviceRequired?.replace(/_/g, ' ') || 'General Repair'}</span>
                          <span>•</span>
                          <span>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                        <span className="status-badge info">
                          {r.status?.replace(/_/g, ' ') || 'Request Received'}
                        </span>
                        <Link href={`/track-order?id=${r.requestId || r._id}`} className="btn btn-sm" style={{ background: 'var(--color-primary)', color: 'var(--color-white)' }}>
                          View Status 🔍
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Profile */}
          {activeTab === 'profile' && (
            <div className="content-card" style={{ maxWidth: '600px' }}>
              <h3 className="content-card-title">Profile Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Name</label>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-primary)', marginTop: 'var(--space-1)' }}>{user.name}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Email Address</label>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-primary)', marginTop: 'var(--space-1)' }}>{user.email}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Phone</label>
                  <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-primary)', marginTop: 'var(--space-1)' }}>{user.phone || '+91 9820123456'}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>Account Role</label>
                  <span className="status-badge info" style={{ marginTop: 'var(--space-1)', display: 'inline-block' }}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Addresses */}
          {activeTab === 'addresses' && (
            <div className="content-card" style={{ maxWidth: '600px' }}>
              <h3 className="content-card-title">Saved Delivery Addresses</h3>
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>Primary Home Address (Default)</strong>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>
                  {user.addresses?.[0]?.address || 'Flat 402, Sea Breeze Heights, Sector 15, Kharghar, Navi Mumbai - 410210'}
                </p>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-light)', fontWeight: 700, display: 'block', marginTop: 'var(--space-2)' }}>
                  📞 {user.addresses?.[0]?.phone || user.phone || '+91 9820123456'}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
