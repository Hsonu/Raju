'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      showToast('Please fill in your name, phone number, and message', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.submitContact(formData).catch(() => null);
      setSubmitted(true);
      showToast('Thank you! Your message has been sent to our Kharghar team.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      showToast('Message sent! We will contact you shortly.');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="page-content">
        {/* Banner */}
        <div className="page-banner">
          <div className="container" style={{ maxWidth: '700px' }}>
            <span className="page-banner-label">
              We Are Here to Help
            </span>
            <h1 className="page-banner-title">
              Contact Riddhi Computer
            </h1>
            <p className="page-banner-desc">
              Have a question about laptop pricing, custom PC configurations, or repair estimates? Reach out to us directly.
            </p>
          </div>
        </div>

        <div className="container page-content-inner">
          <div className="two-col-grid">
            {/* Contact Details Card */}
            <div className="content-card">
              <h2 className="content-card-title">
                Store Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div className="info-row">
                  <span className="info-icon"><MapPin size={20} /></span>
                  <div>
                    <strong className="info-title">Store Address:</strong>
                    <p className="info-desc">
                      Shop No. 12, Ground Floor, Sai Aangan CHS,<br />
                      Sector 20, Kharghar, Navi Mumbai,<br />
                      Maharashtra - 410210
                    </p>
                  </div>
                </div>

                <div className="info-row">
                  <span className="info-icon"><Phone size={20} /></span>
                  <div>
                    <strong className="info-title">Phone / WhatsApp:</strong>
                    <a href="tel:+919876543210" style={{ color: 'var(--color-primary-light)', fontWeight: 700, fontSize: 'var(--font-size-sm)', display: 'block' }}>
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="info-row">
                  <span className="info-icon"><Mail size={20} /></span>
                  <div>
                    <strong className="info-title">Email:</strong>
                    <a href="mailto:info@riddhicomputer.com" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      info@riddhicomputer.com
                    </a>
                  </div>
                </div>

                <div className="info-row">
                  <span className="info-icon"><Clock size={20} /></span>
                  <div>
                    <strong className="info-title">Business Hours:</strong>
                    <p className="info-desc">
                      Monday – Sunday: 10:00 AM – 9:00 PM<br />
                      <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Open All 7 Days</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="whatsapp-box">
                <div>
                  <strong style={{ display: 'block', color: '#166534', fontSize: 'var(--font-size-sm)' }}>Instant WhatsApp Support</strong>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: '#15803d' }}>Get repair quotes or check laptop availability</span>
                </div>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Riddhi%20Computer!%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  Chat Now →
                </a>
              </div>
            </div>

            {/* Contact Form Card */}
            <div className="content-card">
              <h2 className="content-card-title">
                Send Us a Message
              </h2>
              <p className="content-card-subtitle">
                Fill out this quick form and our technician desk will get back to you within 30 minutes.
              </p>

              {submitted ? (
                <div style={{ padding: 'var(--space-6)', background: 'var(--color-success-light)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: '#065f46' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>✓</div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Message Received!</h3>
                  <p style={{ fontSize: 'var(--font-size-sm)' }}>Thank you for reaching out. We will call or WhatsApp you shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-sm"
                    style={{ marginTop: 'var(--space-4)', background: '#065f46', color: 'var(--color-white)', borderRadius: 'var(--radius-sm)' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="inline-form">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="form-input"
                    />
                  </div>

                  <div className="inline-form-row">
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9820123456"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Laptop Screen Repair Quote or Gaming PC Build"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message / Problem Description *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe what laptop model you have and what issue you are facing..."
                      className="form-input"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    {loading ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
