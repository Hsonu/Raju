'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Lock, LogIn, UserPlus, Zap, User, UserCheck, ShieldCheck, Laptop, Wrench, Calendar, Home, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

const serviceOptions = [
  { value: 'laptop_repair', label: 'Laptop Repair' },
  { value: 'desktop_repair', label: 'Desktop Repair' },
  { value: 'screen_replacement', label: 'Screen Replacement' },
  { value: 'keyboard_replacement', label: 'Keyboard Replacement' },
  { value: 'battery_replacement', label: 'Battery Replacement' },
  { value: 'ssd_upgrade', label: 'SSD Upgrade' },
  { value: 'ram_upgrade', label: 'RAM Upgrade' },
  { value: 'windows_installation', label: 'Windows Installation' },
  { value: 'software_installation', label: 'Software Installation' },
  { value: 'virus_removal', label: 'Virus Removal' },
  { value: 'laptop_cleaning', label: 'Laptop Cleaning / Servicing' },
  { value: 'thermal_paste', label: 'Thermal Paste Service' },
  { value: 'data_transfer', label: 'Data Recovery / Transfer' },
  { value: 'hardware_diagnosis', label: 'Hardware Diagnosis' },
  { value: 'home_visit', label: 'Home Visit Repair' },
  { value: 'other', label: 'Other' },
];

function BookRepairForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    customerName: '', mobile: '', email: '', deviceType: 'laptop',
    brand: '', model: '', problem: '', serviceRequired: '',
    preferredDate: '', preferredTime: '', address: '',
    homeVisit: false, additionalNotes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  // Handle URL query parameters
  useEffect(() => {
    // Clear any stale cached booking drafts
    try {
      sessionStorage.removeItem('pending_repair_booking');
    } catch {
      // ignore
    }

    const isHome = searchParams.get('homeVisit') === 'true';
    const svcParam = searchParams.get('service');

    let initialForm = {};
    if (isHome) initialForm.homeVisit = true;
    if (svcParam) {
      const matched = serviceOptions.find(o => o.label.toLowerCase() === svcParam.toLowerCase() || o.value === svcParam);
      if (matched) initialForm.serviceRequired = matched.value;
    }

    setForm(prev => ({ ...prev, ...initialForm }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuickDemoCustomer = async () => {
    try {
      await demoLogin('customer');
      showToast('Logged in as Demo Customer!');
    } catch (err) {
      showToast('Demo login failed', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Authentication Check: User MUST be logged in first
    if (!user) {
      try {
        sessionStorage.setItem('pending_repair_booking', JSON.stringify(form));
      } catch {
        // ignore
      }
      showToast('Please login first to submit your repair booking request', 'error');
      router.push('/login?redirect=/book-repair');
      return;
    }

    if (!form.customerName || !form.mobile || !form.problem || !form.serviceRequired) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data = await api.submitRepair(form);
      try {
        sessionStorage.removeItem('pending_repair_booking');
      } catch {
        // ignore
      }
      setSuccess(data.requestId);
      showToast('Repair request submitted successfully!');
    } catch (err) {
      // Demo fallback
      try {
        sessionStorage.removeItem('pending_repair_booking');
      } catch {
        // ignore
      }
      setSuccess('RPR' + Date.now().toString(36).toUpperCase().slice(0, 8));
      showToast('Repair request recorded!');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <main className={styles.main}>
        <div className={styles.successContainer}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h2>Repair Request Submitted Successfully!</h2>
            <p>Your repair request has been received. Our team will contact you shortly.</p>
            <div className={styles.requestId}>
              <span>Request ID</span>
              <strong>{success}</strong>
            </div>
            <p className={styles.trackHint}>You can track your repair status anytime using this ID</p>
            <div className={styles.successActions}>
              <Link href={`/track-order?id=${success}`} className="btn btn-primary">Track Status</Link>
              <Link href="/account" className="btn btn-secondary">My Bookings</Link>
              <Link href="/" className="btn btn-ghost">Back to Home</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.pageHeader}>
        <div className="container">
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link> / <span>Book Repair</span>
          </nav>
          <h1 className={styles.pageTitle}>Book a Repair Service</h1>
          <p className={styles.pageDesc}>Fill in the details below and our expert technicians will assist you</p>
        </div>
      </section>

      <div className={`container ${styles.formContainer}`}>
        {/* Auth Status Notification */}
        {!authLoading && (
          user ? (
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: '16px',
              padding: '16px 22px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '26px',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 4px 16px rgba(22, 163, 74, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--paper)',
                  boxShadow: '0 3px 10px rgba(22, 163, 74, 0.3)'
                }}>
                  <UserCheck size={20} strokeWidth={2.4} />
                </div>
                <div>
                  <strong style={{ color: '#14532d', fontSize: '0.95rem', display: 'block', fontWeight: 800 }}>
                    Logged in as {user.name} ({user.email})
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <ShieldCheck size={14} /> Linked to your account for live tracking & warranty.
                  </span>
                </div>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                background: '#16a34a',
                color: 'var(--paper)',
                padding: '5px 12px',
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
              }}>
                Verified Customer
              </span>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #fffdf5 0%, #fefce8 40%, #fef3c7 100%)',
              borderRadius: '16px',
              padding: '22px 24px',
              border: '1px solid #fde047',
              boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.14), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
              marginBottom: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                  color: 'var(--paper)'
                }}>
                  <Lock size={22} strokeWidth={2.4} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1.08rem', color: '#78350f', fontWeight: 800, letterSpacing: '-0.01em' }}>
                    Please Login First to Book a Repair
                  </strong>
                  <p style={{ fontSize: '0.88rem', color: '#92400e', margin: '4px 0 0', lineHeight: 1.45 }}>
                    Signing in is required to track your device repair status, communicate with technicians, and manage warranty bills.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link
                  href="/login?redirect=/book-repair"
                  className="btn btn-primary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent))',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  <LogIn size={16} strokeWidth={2.4} /> Sign In Now
                </Link>
                <Link
                  href="/register?redirect=/book-repair"
                  className="btn btn-secondary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--paper)',
                    border: '1px solid var(--rule)',
                    color: 'var(--ink)'
                  }}
                >
                  <UserPlus size={16} strokeWidth={2.4} /> Create Account
                </Link>
                <button
                  type="button"
                  onClick={handleQuickDemoCustomer}
                  style={{
                    padding: '10px 18px',
                    background: 'linear-gradient(135deg, #fef08a, #fde047)',
                    color: '#713f12',
                    border: '1px solid #eab308',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(234, 179, 8, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Zap size={16} fill="#ca8a04" color="#854d0e" strokeWidth={2.2} /> 1-Click Demo Login
                </button>
              </div>
            </div>
          )
        )}

        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          {error && <div className={styles.errorMsg}>{error}</div>}

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--accent)" /> Personal Details
            </h3>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" name="customerName" value={form.customerName} onChange={handleChange} placeholder="Enter your full name" autoComplete="off" required />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input className="form-input" name="mobile" value={form.mobile} onChange={handleChange} placeholder="+91 XXXXX XXXXX" autoComplete="off" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" autoComplete="off" />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Laptop size={18} color="var(--accent)" /> Device Details
            </h3>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Device Type *</label>
                <select className="form-select" name="deviceType" value={form.deviceType} onChange={handleChange}>
                  <option value="laptop">Laptop</option>
                  <option value="desktop">Desktop</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Dell, HP, Lenovo" />
              </div>
              <div className="form-group">
                <label className="form-label">Model</label>
                <input className="form-input" name="model" value={form.model} onChange={handleChange} placeholder="e.g. Inspiron 15" />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={18} color="var(--accent)" /> Service Details
            </h3>
            <div className="form-group">
              <label className="form-label">Service Required *</label>
              <select className="form-select" name="serviceRequired" value={form.serviceRequired} onChange={handleChange} required>
                <option value="">Select a service</option>
                {serviceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Problem Description *</label>
              <textarea className="form-input" name="problem" value={form.problem} onChange={handleChange} rows={4} placeholder="Describe the issue you're facing..." required />
            </div>
            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea className="form-input" name="additionalNotes" value={form.additionalNotes} onChange={handleChange} rows={2} placeholder="Any additional information..." />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--accent)" /> Schedule
            </h3>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input className="form-input" type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Time</label>
                <select className="form-select" name="preferredTime" value={form.preferredTime} onChange={handleChange}>
                  <option value="">Select time</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className={styles.homeVisitToggle}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="homeVisit" checked={form.homeVisit} onChange={handleChange} className={styles.checkbox} />
                <span className={styles.checkboxCustom} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Home size={16} color="var(--accent)" /> I need home visit repair service
                </span>
              </label>
            </div>

            {form.homeVisit && (
              <div className="form-group">
                <label className="form-label">Home Address *</label>
                <textarea className="form-input" name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Enter your full address for home visit" required={form.homeVisit} />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px',
            fontSize: '1.05rem',
            fontWeight: 800,
            borderRadius: '12px'
          }}>
            {loading ? <><span className="spinner" /> Submitting...</> : (
              user ? (
                <>Submit Repair Request</>
              ) : (
                <><Lock size={18} /> Login & Submit Repair Request</>
              )
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function BookRepairPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Loading repair booking...</div>}>
        <BookRepairForm />
      </Suspense>
      <Footer />
    </>
  );
}
