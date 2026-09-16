'use client';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ShieldCheck, Search, Home } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="page-content">
        {/* Banner */}
        <div className="page-banner">
          <div className="container" style={{ maxWidth: '800px' }}>
            <span className="page-banner-label">
              Our Story &amp; Commitment
            </span>
            <h1 className="page-banner-title">
              About Riddhi Computer
            </h1>
            <p className="page-banner-desc">
              Kharghar&apos;s most trusted destination for laptop sales, custom gaming PC builds, and precision chip-level hardware repair services since 2014.
            </p>
          </div>
        </div>

        <div className="container page-content-inner">
          {/* Stats Bar */}
          <div className="content-card" style={{ marginBottom: 'var(--space-10)' }}>
            <div className="stats-grid">
              <div>
                <span className="stat-value" style={{ color: 'var(--color-primary-light)' }}>10+</span>
                <span className="stat-label">Years in Business</span>
              </div>
              <div>
                <span className="stat-value" style={{ color: 'var(--color-success)' }}>15,000+</span>
                <span className="stat-label">Laptops Repaired</span>
              </div>
              <div>
                <span className="stat-value" style={{ color: 'var(--color-warning)' }}>98.5%</span>
                <span className="stat-label">Customer Satisfaction</span>
              </div>
              <div>
                <span className="stat-value" style={{ color: 'var(--color-primary)' }}>2 Hours</span>
                <span className="stat-label">Average Screen Turnaround</span>
              </div>
            </div>
          </div>

          {/* Meet The Founders & Leadership Section */}
          <div className="content-card two-col-grid" style={{ marginBottom: 'var(--space-10)', padding: 'var(--space-10)' }}>
            {/* Founders Photo Container */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src="/founders.jpg"
                  alt="Raju & Founders of Riddhi Computer"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
                    aspectRatio: '4/3',
                    transition: 'transform 0.4s ease'
                  }}
                />
              </div>

              {/* Trust note */}
              <div style={{
                position: 'absolute',
                bottom: '-12px',
                left: '16px',
                right: '16px',
                background: 'var(--ink)',
                color: 'var(--paper)',
                padding: 'var(--space-3) var(--space-5)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 300,
                fontFamily: 'var(--sans)',
                letterSpacing: '0.03em',
                textAlign: 'center'
              }}>
                Trusted by 15,000+ customers in Kharghar since 2014
              </div>
            </div>

            {/* Leadership Story & Message */}
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
                Meet the Leadership
              </span>

              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--color-primary)', margin: 'var(--space-4) 0 var(--space-4)', lineHeight: 1.25 }}>
                Personal Care &amp; Integrity You Can Trust
              </h2>

              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)' }}>
                At <strong>Riddhi Computer</strong>, every customer interacts directly with experienced professionals. When you bring your precious laptop or book a doorstep service, Raju and the leadership team personally oversee every diagnostic and repair.
              </p>

              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-6)' }}>
                We believe that honesty, genuine spare parts, and zero-compromise data privacy are what built our 10+ year legacy in Kharghar.
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Raju!%20I%20visited%20your%20website%20and%20want%20to%20inquire%20about%20a%20laptop%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  Chat with Raju on WhatsApp
                </a>
                <Link href="/book-repair" className="btn btn-lg" style={{ background: 'var(--color-primary)', color: 'var(--color-white)', borderRadius: 'var(--radius-lg)' }}>
                  Book a Repair
                </Link>
              </div>
            </div>
          </div>

          {/* Story & Pillars */}
          <div className="two-col-grid" style={{ marginBottom: 'var(--space-10)' }}>
            <div className="content-card">
              <h2 className="content-card-title" style={{ fontSize: 'var(--font-size-xl)' }}>
                Who We Are
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                Founded with a mission to bring transparent, reliable, and affordable computer technology solutions to Kharghar and Navi Mumbai residents, Riddhi Computer has grown into a full-fledged sales and hardware engineering service hub.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                Whether you need a brand-new HP or Dell laptop for college or office work, a custom high-FPS gaming desktop, or urgent motherboard micro-soldering after a liquid spill, our team treats your hardware with the utmost precision.
              </p>
            </div>

            <div className="content-card">
              <h2 className="content-card-title" style={{ fontSize: 'var(--font-size-xl)' }}>
                Our Core Promises
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <li className="info-row">
                  <span className="info-icon"><ShieldCheck size={22} /></span>
                  <div>
                    <strong className="info-title">100% Genuine Components</strong>
                    <span className="info-desc">We source only OEM brand-original panels, batteries, and IC chips.</span>
                  </div>
                </li>
                <li className="info-row">
                  <span className="info-icon"><Search size={22} /></span>
                  <div>
                    <strong className="info-title">Zero Hidden Costs</strong>
                    <span className="info-desc">Exact diagnostic report and fixed quote before starting any work.</span>
                  </div>
                </li>
                <li className="info-row">
                  <span className="info-icon"><Home size={22} /></span>
                  <div>
                    <strong className="info-title">Doorstep Home Visits</strong>
                    <span className="info-desc">Convenient pickup, repair, and delivery across all Kharghar sectors.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Visit Store Callout */}
          <div className="cta-banner">
            <h2 className="cta-banner-title" style={{ fontSize: 'var(--font-size-2xl)' }}>
              Visit Our Kharghar Experience Store
            </h2>
            <p className="cta-banner-desc">
              Shop No. 12, Ground Floor, Sai Aangan CHS, Sector 20, Kharghar, Navi Mumbai 410210. Open 10:00 AM to 9:00 PM every day.
            </p>
            <div className="cta-banner-actions">
              <Link href="/contact" className="btn btn-lg" style={{ background: 'var(--color-white)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}>
                Get Store Directions
              </Link>
              <Link href="/book-repair" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'var(--color-white)', borderRadius: 'var(--radius-md)' }}>
                Book a Repair Online
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
