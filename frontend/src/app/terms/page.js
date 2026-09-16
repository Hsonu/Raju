'use client';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--paper-alt)', padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '800px', background: '#fff', borderRadius: '16px', padding: '40px', border: '1px solid var(--rule-faint)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--ink)', marginBottom: '20px' }}>Terms and Conditions</h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Last updated: August 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>1. Service Overview</h2>
              <p>Riddhi Computer provides laptop/computer sales, accessories, and professional hardware/software repair services in Kharghar, Navi Mumbai.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>2. Repair Diagnostic and Quotes</h2>
              <p>All device diagnostics are conducted by qualified hardware technicians. Any quotation given prior to full diagnostic is an estimate. No repair is initiated without explicit customer consent.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>3. Warranty on Products and Repairs</h2>
              <p>New products carry official brand warranty. Hardware repair jobs (like screen replacements, motherboard chip repairs) come with a 3 to 12-month Riddhi Computer service warranty against manufacturing defects.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>4. Data Responsibility</h2>
              <p>While we take all precautionary steps to preserve customer data during repairs and upgrades, customers are strongly encouraged to back up confidential personal data prior to handover.</p>
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
