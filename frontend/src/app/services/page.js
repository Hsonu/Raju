'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ServiceIcon from '../../components/ServiceIcon';
import api from '../../services/api';
import { ClipboardList, Home, Wrench, ShieldCheck, Zap, ArrowRight, MessageCircle } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await api.getServices();
        if (res && res.services) {
          setServices(res.services);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <>
      <Header />
      <main className="page-content">
        {/* Banner */}
        <div className="page-banner" style={{ marginBottom: 'var(--space-10)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <span className="page-banner-label">
              Certified Hardware &amp; Software Experts
            </span>
            <h1 className="page-banner-title">
              Professional Laptop &amp; Computer Repair Services
            </h1>
            <p className="page-banner-desc" style={{ marginBottom: 'var(--space-6)' }}>
              We repair all laptop brands with genuine parts in Kharghar, Navi Mumbai. Same-day turnaround &amp; doorstep service available.
            </p>
            <div className="cta-banner-actions">
              <Link href="/book-repair" className="btn btn-primary btn-lg">
                <ClipboardList size={18} style={{marginRight: '6px', verticalAlign: 'middle'}} /> Book a Repair Online
              </Link>
              <Link href="/home-repair" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-white)' }}>
                <Home size={18} style={{marginRight: '6px', verticalAlign: 'middle'}} /> Home Visit Service
              </Link>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Services Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'var(--space-8)'
          }}>
            {services.map((service, idx) => (
              <div
                key={service._id || idx}
                className="content-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                <div>
                  <div style={{ marginBottom: 'var(--space-5)' }}>
                    <ServiceIcon name={service.name} icon={service.icon} size={32} />
                  </div>

                  <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-3)', lineHeight: 1.3 }}>
                    {service.name}
                  </h3>

                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, marginBottom: 'var(--space-5)' }}>
                    {service.description}
                  </p>

                  {service.features && service.features.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
                          <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Starting from</span>
                      <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900, color: 'var(--color-primary)' }}>
                        ₹{(service.discountPrice || service.price || 499).toLocaleString('en-IN')}
                      </span>
                      {service.price > service.discountPrice && (
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textDecoration: 'line-through', marginLeft: 'var(--space-2)' }}>
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <Link
                      href={`/book-repair?service=${encodeURIComponent(service.name)}`}
                      className="btn btn-primary"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Book Repair →
                    </Link>
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Riddhi Computer! I want to inquire about: ${service.name} (Starting ₹${(service.discountPrice || service.price || 499).toLocaleString('en-IN')})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-icon"
                      title="Quick Quote on WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Repair Process Steps */}
          <div className="content-card" style={{ marginTop: 'var(--space-16)', textAlign: 'center' }}>
            <h2 className="content-card-title" style={{ fontSize: 'var(--font-size-2xl)', textAlign: 'center' }}>
              How Our Repair Process Works
            </h2>
            <p className="content-card-subtitle" style={{ maxWidth: '600px', margin: '0 auto var(--space-10)', textAlign: 'center' }}>
              Fast, transparent, and hassle-free repair service in 4 simple steps.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-6)',
              textAlign: 'center'
            }}>
              {[
                { num: 1, title: 'Book Online or Call', desc: 'Select your laptop issue and choose store drop-off or doorstep visit.', color: 'var(--color-primary-light)' },
                { num: 2, title: 'Diagnosis & Quote', desc: 'Certified technician diagnoses the problem and gives you an exact price before starting.', color: 'var(--color-primary-light)' },
                { num: 3, title: 'Expert Repair', desc: 'Fixed using genuine parts with high-grade micro-soldering and ESD safety tools.', color: 'var(--color-primary-light)' },
                { num: 4, title: 'Delivery with Warranty', desc: 'Device tested, cleaned, and delivered with 3 to 12 months service warranty.', color: 'var(--color-success)' },
              ].map(step => (
                <div key={step.num} style={{ padding: 'var(--space-5)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: step.color, color: 'var(--color-white)', fontSize: 'var(--font-size-lg)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>{step.num}</div>
                  <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{step.title}</h4>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
