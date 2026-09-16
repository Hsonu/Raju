'use client';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--paper-alt)', padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '800px', background: '#fff', borderRadius: '16px', padding: '40px', border: '1px solid var(--rule-faint)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--ink)', marginBottom: '20px' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Last updated: August 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>1. Information We Collect</h2>
              <p>We collect customer names, phone numbers, email addresses, and delivery addresses strictly for order fulfillment, doorstep repair service dispatch, and warranty records.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>2. Data Protection</h2>
              <p>We never sell or rent your personal contact information to third parties. All communication is directly regarding your orders, repairs, or inquiries.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>3. Contact Us</h2>
              <p>For any privacy concerns, contact us at info@riddhicomputer.com or visit our store in Sector 20, Kharghar, Navi Mumbai.</p>
            </section>
          </div>

          <div style={{ marginTop: '32px', borderTop: '1px solid var(--paper-alt)', paddingTop: '20px' }}>
            <Link href="/" style={{ color: 'var(--accent)', fontWeight: 700 }}>← Return to Home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
