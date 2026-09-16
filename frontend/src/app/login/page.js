'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Wrench, ShoppingBag, Monitor, Zap, User, Settings } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';
  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getRedirectMessage = () => {
    if (redirectPath.includes('book-repair')) {
      return {
        icon: <Wrench size={20} />,
        title: 'Sign In to Book a Repair',
        desc: 'Please log in to your account so you can submit your repair request and track real-time repair progress.'
      };
    }
    if (redirectPath.includes('checkout')) {
      return {
        icon: <ShoppingBag size={20} />,
        title: 'Sign In to Complete Checkout',
        desc: 'Please log in to place your order, confirm your doorstep delivery address, and receive invoice updates.'
      };
    }
    return null;
  };

  const redirectInfo = getRedirectMessage();

  const handleSuccessfulAuth = (user) => {
    if (redirectPath) {
      router.push(redirectPath);
    } else if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/account');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      showToast('Logged in successfully! Welcome back.');
      handleSuccessfulAuth(res.user);
    } catch (err) {
      showToast(err.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    try {
      const res = await demoLogin(role);
      showToast(`Logged in as ${role === 'admin' ? 'Admin' : 'Customer'}!`);
      handleSuccessfulAuth(res.user);
    } catch (err) {
      showToast(err.message || 'Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const registerHref = redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : '/register';

  return (
    <div className="content-card" style={{ maxWidth: '480px', width: '100%' }}>
      {/* Contextual Banner if Redirected */}
      {redirectInfo && (
        <div style={{
          background: 'var(--color-info-light)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
          border: '1px solid #bfdbfe',
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{redirectInfo.icon}</span>
          <div>
            <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--accent)', fontWeight: 800 }}>
              {redirectInfo.title}
            </strong>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', margin: 'var(--space-1) 0 0', lineHeight: 1.4 }}>
              {redirectInfo.desc}
            </p>
          </div>
        </div>
      )}

      {/* Logo & Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-primary)',
          color: 'var(--color-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-3)'
        }}>
          <Monitor size={24} />
        </div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-primary)' }}>Welcome Back</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
          Login to Riddhi Computer customer or admin portal
        </p>
      </div>

      {/* Quick Demo Fill Buttons */}
      <div style={{
        background: 'var(--color-bg-alt)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        border: '1px solid var(--color-border)'
      }}>
        <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 'var(--space-2)', textAlign: 'center' }}>
          <Zap size={14} style={{marginRight: '4px', verticalAlign: 'middle'}} /> 1-Click Quick Demo Login
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            disabled={loading}
            className="btn btn-secondary btn-sm"
          >
            <User size={16} style={{marginRight: '4px', verticalAlign: 'middle'}} /> Demo Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            disabled={loading}
            className="btn btn-sm"
            style={{ background: 'var(--color-primary)', color: 'var(--color-white)' }}
          >
            <Settings size={16} style={{marginRight: '4px', verticalAlign: 'middle'}} /> Demo Admin
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="inline-form">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="form-input"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
          {loading ? 'Logging in...' : 'Sign In →'}
        </button>
      </form>

      {/* Register Link */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link href={registerHref} style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--color-bg-alt)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-10) var(--space-5)' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
