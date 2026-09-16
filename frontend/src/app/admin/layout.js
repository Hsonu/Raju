'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  Laptop,
  ShoppingBag,
  Wrench,
  Settings,
  Tag,
  MessageSquare,
  ShieldAlert,
  Zap,
  ArrowLeft,
  LogOut,
  ExternalLink,
  TrendingUp,
  Video
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, demoLogin } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/finance', label: 'Finance & Analytics', icon: TrendingUp },
    { href: '/admin/videos', label: 'Repair Videos', icon: Video },
    { href: '/admin/products', label: 'Products', icon: Laptop },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/repairs', label: 'Repair Requests', icon: Wrench },
    { href: '/admin/services', label: 'Services', icon: Settings },
    { href: '/admin/coupons', label: 'Coupons', icon: Tag },
    { href: '/admin/messages', label: 'Inquiries', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>
        <p>Loading Admin Portal...</p>
      </div>
    );
  }

  // If user is not logged in or not admin, show admin login prompt
  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#091a2f', padding: '20px' }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: '#0f2744',
          borderRadius: '20px',
          padding: '40px 32px',
          border: '1px solid #1e3a8a',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
          }}>
            <ShieldAlert size={32} strokeWidth={2.3} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Admin Access Required</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>
            Please log in with your Riddhi Computer store administrator credentials to access the management portal.
          </p>

          <button
            onClick={async () => {
              try {
                await demoLogin('admin');
                showToast('Logged in as Admin!');
              } catch (e) {
                showToast(e.message || 'Login failed', 'error');
              }
            }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Zap size={18} fill="#fde047" color="#fde047" /> Quick Login as Demo Admin
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.85rem' }}>
            <Link href="/login" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>
              Standard Login Page
            </Link>
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={14} /> Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: '#0f2744',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: '1px solid #1e3a8a',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100
      }}>
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            fontWeight: 900
          }}>
            RC
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.03em' }}>RIDDHI ADMIN</strong>
            <span style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Kharghar Store Portal</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const IconComp = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: isActive ? '#1a56db' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s'
                }}
              >
                <IconComp size={18} strokeWidth={isActive ? 2.4 : 2} color={isActive ? '#ffffff' : '#94a3b8'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3D Upgrade to Premium / Store Pro Card */}
        <div style={{ padding: '0 12px 14px' }}>
          <div style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #015c46 0%, #01684e 50%, #014536 100%)',
            padding: '16px 14px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(1, 69, 54, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Background ambient glow circles */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '50%', filter: 'blur(20px)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '90px', height: '90px', background: 'rgba(0, 0, 0, 0.15)', borderRadius: '50%', filter: 'blur(20px)' }} />

            {/* 3D Skewed Floating Dual Cards */}
            <div style={{ position: 'relative', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0 10px' }}>
              {/* Back silver card */}
              <div style={{
                position: 'absolute',
                left: '26px',
                top: '6px',
                width: '74px',
                height: '48px',
                borderRadius: '8px',
                background: '#f1f5f9',
                boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
                transform: 'rotate(-12deg)',
                padding: '6px'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#b98a3f' }} />
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ width: '28px', height: '3px', background: '#cbd5e1', borderRadius: '999px' }} />
                  <div style={{ width: '18px', height: '3px', background: '#e2e8f0', borderRadius: '999px' }} />
                </div>
              </div>

              {/* Front mint-emerald gradient card */}
              <div style={{
                position: 'absolute',
                right: '24px',
                top: '12px',
                width: '80px',
                height: '52px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #8cff8d 0%, #5fb96d 100%)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                transform: 'rotate(10deg)',
                padding: '7px'
              }}>
                <div style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#b98a3f' }} />
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ width: '30px', height: '3px', background: 'rgba(255,255,255,0.9)', borderRadius: '999px' }} />
                    <div style={{ width: '20px', height: '3px', background: 'rgba(255,255,255,0.7)', borderRadius: '999px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Text & Action */}
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: '#ffffff', fontWeight: 800 }}>
                Upgrade to Premium
              </strong>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', margin: '3px 0 10px', lineHeight: 1.3 }}>
                Unlock advanced insights, custom reports & GST audit.
              </p>
              <Link
                href="/admin/finance"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '7px 0',
                  background: '#cbf3a7',
                  color: '#000000',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                }}
              >
                View Analytics Pro
              </Link>
            </div>
          </div>
        </div>

        {/* Footer / User Profile & Store Return */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#091a2f' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                A
              </div>
              <div style={{ overflow: 'hidden' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</strong>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>● Online Admin</span>
              </div>
            </div>
            <button
              onClick={() => { logout(); showToast('Logged out of Admin'); router.push('/'); }}
              style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>

          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              padding: '8px',
              background: 'rgba(255,255,255,0.06)',
              color: '#94a3b8',
              borderRadius: '8px',
              fontSize: '0.8rem',
              textAlign: 'center',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={13} /> Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header style={{
          height: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Riddhi Computer Administration</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                padding: '6px 14px',
                background: '#eff6ff',
                color: '#1a56db',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              View Live Store <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '32px', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
