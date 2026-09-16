'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Wrench, ShoppingBag } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const getRedirectMessage = () => {
    if (redirectPath.includes('book-repair')) {
      return {
        icon: Wrench,
        title: 'Create Account to Book Repair',
        desc: 'Sign up to submit your repair request and track real-time repair status online.'
      };
    }
    if (redirectPath.includes('checkout')) {
      return {
        icon: ShoppingBag,
        title: 'Create Account to Checkout',
        desc: 'Sign up to complete your order, save your address, and receive invoice notifications.'
      };
    }
    return null;
  };

  const redirectInfo = getRedirectMessage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      showToast('Account created successfully! Welcome to Riddhi Computer.');
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push('/account');
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loginHref = redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : '/login';

  return (
    <div className="content-card" style={{ maxWidth: '480px', width: '100%' }}>
      {/* Contextual Banner if Redirected */}
      {redirectInfo && (
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, var(--color-info-light) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
          border: '1px solid #bfdbfe',
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'center'
        }}>
          <div className="info-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-white)' }}>
            {redirectInfo.icon && <redirectInfo.icon size={18} strokeWidth={2.4} />}
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--accent)', fontWeight: 800 }}>
              {redirectInfo.title}
            </strong>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--accent)', margin: 'var(--space-1) 0 0', lineHeight: 1.4 }}>
              {redirectInfo.desc}
            </p>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-primary)' }}>Create an Account</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
          Join Riddhi Computer for fast checkouts &amp; repair tracking
        </p>
      </div>

      <form onSubmit={handleSubmit} className="inline-form">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number (WhatsApp)</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9820123456" className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Create Password *</label>
          <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} placeholder="At least 6 characters" className="form-input" />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
          {loading ? 'Registering...' : 'Register Account →'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
        Already have an account?{' '}
        <Link href={loginHref} style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--color-bg-alt)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-10) var(--space-5)' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>Loading...</div>}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
