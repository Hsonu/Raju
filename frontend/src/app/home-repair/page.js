'use client';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Home, Calendar, MessageCircle, Clock, Eye, ShieldCheck, FileText, MapPin } from 'lucide-react';

export default function HomeRepairPage() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--paper)', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <div className="page-banner" style={{ paddingBottom: 'var(--space-12)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
            <div>
              <span className="page-banner-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Home size={14} /> Doorstep Laptop & Computer Repair
              </span>
              <h1 className="page-banner-title">
                Expert Laptop Repair at Your Doorstep
              </h1>
              <p className="page-banner-desc" style={{ marginBottom: 'var(--space-8)' }}>
                Don&apos;t risk carrying your heavy gaming PC or delicate laptop. Our certified technician visits your home or office with full diagnostic gear and genuine replacement parts.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/book-repair?homeVisit=true" className="btn btn-primary btn-lg">
                  <Calendar size={16} style={{marginRight: '4px'}} /> Book Home Visit
                </Link>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Riddhi%20Computer!%20I%20need%20a%20doorstep%20laptop%20repair%20in%20Kharghar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  <MessageCircle size={16} style={{marginRight: '4px'}} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Feature List */}
            <div style={{
              background: 'var(--paper)',
              borderRadius: 'var(--radius-md)',
              padding: '28px',
              border: '1px solid var(--rule-faint)'
            }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '20px' }}>
                Why doorstep service?
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '2px' }}><Clock size={18} /></span>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '0.875rem', fontWeight: 500 }}>2-hour arrival window</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', fontWeight: 300 }}>All across Kharghar & Navi Mumbai</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '2px' }}><Eye size={18} /></span>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '0.875rem', fontWeight: 500 }}>Repair done in front of you</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', fontWeight: 300 }}>Full transparency, no surprises</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '2px' }}><ShieldCheck size={18} /></span>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '0.875rem', fontWeight: 500 }}>No fix, no inspection fee</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', fontWeight: 300 }}>Pay only when you approve the quote</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: '2px' }}><FileText size={18} /></span>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '0.875rem', fontWeight: 500 }}>Written warranty</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', fontWeight: 300 }}>Up to 12 months on replaced parts</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Coverage Areas */}
        <div className="container" style={{ marginTop: 'var(--space-10)' }}>
          <div className="content-card">
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.375rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '12px' }}>
              Service Coverage Areas
            </h2>
            <p style={{ color: 'var(--ink-muted)', marginBottom: '24px', fontWeight: 300 }}>
              Our technician network covers these locations in Navi Mumbai:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                'Kharghar (Sector 1 - 36)',
                'CBD Belapur',
                'Seawoods & Nerul',
                'Kamothe (Sector 1 - 22)',
                'Taloja Phase 1 & 2',
                'Panvel & New Panvel',
                'Vashi & Sanpada',
                'Ulwe',
              ].map((area, i) => (
                <div key={i} className="location-chip">
                  <MapPin size={14} />
                  <span>{area}</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
              <Link href="/book-repair?homeVisit=true" className="btn btn-primary btn-lg">
                Schedule Doorstep Visit →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
