/* ═══════════════════════════════════════════════════════════════
   HERO DESIGN CRITIQUE & RATIONALE
   
   • Audience:
     Residents, university students, and business owners in Kharghar & 
     Navi Mumbai seeking dependable computer hardware guidance or chip-level 
     laptop repair without retail markups or dishonest replacement advice.

   • One-sentence offer:
     Independent bench diagnostics and chip-level motherboard restoration 
     with same-day turnaround and doorstep pickup in Kharghar.

   • Why this composition fits THIS project:
     Riddhi Computer is a 10-year-old independent hardware bench led by 
     Raju in Sector 7, Kharghar. Instead of SaaS gradient cards and floating 
     orbs, this composition adopts a monograph-style asymmetric grid: an 
     editorial serif headline with tight tracking, an unhurried 2-sentence 
     proof statement, a single sharp letterhead action button with a quiet 
     text link, and an authentic workshop intake ledger displaying real bench 
     constraints and provenance.

   • 5-second test result:
     A visitor immediately grasps: (1) Riddhi Computer is an established local 
     hardware repair workshop in Sector 7 Kharghar, (2) They diagnose and repair 
     laptops at component level rather than blindly replacing whole units, and 
     (3) The primary next step is to book a bench repair or inspect workshop rates.
   ═══════════════════════════════════════════════════════════════ */

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './page.module.css';
import {
  Laptop, Monitor, Headphones, Wrench, Home, Cpu, MemoryStick, HardDrive,
  Package, MonitorSmartphone, Sparkles, Zap, Phone, MessageCircle,
  MapPin, ArrowRight
} from 'lucide-react';

/* ===== DATA ===== */
const categories = [
  { icon: <Laptop size={20} />, name: 'Laptops', desc: 'New & refurbished. All major brands.', href: '/laptops' },
  { icon: <Monitor size={20} />, name: 'Desktops', desc: 'Custom built to order.', href: '/computers' },
  { icon: <Headphones size={20} />, name: 'Accessories', desc: 'Peripherals, cables, bags.', href: '/accessories' },
  { icon: <Wrench size={20} />, name: 'Repair Services', desc: 'Chip-level. Same-day turnaround.', href: '/services' },
  { icon: <Home size={20} />, name: 'Home Visit', desc: 'We come to your door in Kharghar.', href: '/home-repair' },
];

const repairServices = [
  { icon: <Laptop size={18} />, name: 'Laptop Repair', desc: 'All brands. Screen, keyboard, motherboard.' },
  { icon: <Monitor size={18} />, name: 'Desktop Repair', desc: 'Full diagnostics and component replacement.' },
  { icon: <MonitorSmartphone size={18} />, name: 'OS Installation', desc: 'Windows, drivers, software setup.' },
  { icon: <Zap size={18} />, name: 'SSD Upgrade', desc: 'Replace your hard drive. 10x faster boot.' },
  { icon: <Cpu size={18} />, name: 'RAM Upgrade', desc: 'More memory, less freezing.' },
  { icon: <Sparkles size={18} />, name: 'Deep Cleaning', desc: 'Thermal paste, dust removal, fan service.' },
  { icon: <Package size={18} />, name: 'Software Setup', desc: 'Office, antivirus, development tools.' },
  { icon: <HardDrive size={18} />, name: 'Data Recovery', desc: 'Safe transfer from failing drives.' },
  { icon: <Home size={18} />, name: 'Home Visit', desc: 'Doorstep service. No extra charge in Kharghar.' },
];

const principles = [
  { title: 'Genuine parts only', text: 'We stock OEM screens, keyboards, batteries, and cooling fans. No third-party substitutes unless you ask. Every replacement comes with a warranty seal.' },
  { title: 'Transparent pricing', text: 'We quote before we start. The price on the invoice is the price you pay. No diagnostic fees if you proceed with the repair.' },
  { title: 'Direct founder oversight', text: 'Raju personally supervises every complex repair. No middlemen, no outsourced labour. Your laptop stays in our workshop from intake to handover.' },
];

const faqs = [
  { q: 'What brands do you service?', a: 'Dell, HP, Lenovo, Asus, Acer, Apple, MSI, and most others. If it has a motherboard, we can likely fix it.' },
  { q: 'Do you offer home visit repairs?', a: 'Yes. Within Kharghar and most of Navi Mumbai. Book online or call. We arrive within 60 minutes during business hours.' },
  { q: 'How long does a typical repair take?', a: 'Screen replacements and SSD upgrades: same day. Motherboard-level work: 24–48 hours. We will give you a realistic estimate, not a sales pitch.' },
  { q: 'Do you provide warranty on repairs?', a: 'Yes. 3 to 12 months depending on the part and repair type. Warranty details are printed on your invoice.' },
  { q: 'Can I track my repair status?', a: 'Yes. You receive a tracking ID after booking. Check your repair status anytime from the Track Order page.' },
];

/* ===== MAIN PAGE ===== */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ═══ HERO — Monograph Practice & Workshop Masthead ═══ */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroGrain} aria-hidden="true" />
          <div className={`${styles.heroGrid} container`}>
            
            {/* Left Narrative Column */}
            <div className={styles.heroNarrative}>
              <div className={styles.heroKicker}>
                <span className={styles.kickerIndex} aria-hidden="true">01</span>
                <span className={styles.kickerLabel}>Workshop &amp; Bench Repair — Sector 7, Kharghar</span>
              </div>

              <h1 id="hero-title" className={styles.heroTitle}>
                We repair down to the board.<br />
                <em>Before you buy another machine.</em>
              </h1>

              <p className={styles.heroSummary}>
                Independent computer workshop in Navi Mumbai since 2014. Same-day diagnostics for Dell, Lenovo, Apple, and HP, with transparent bench pricing and doorstep pickup across Kharghar.
              </p>

              <div className={styles.heroActionGroup}>
                <Link href="/book-repair" className={styles.heroPrimaryAction}>
                  Book a bench repair <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <Link href="#services" className={styles.heroSecondaryLink}>
                  View workshop rates &amp; turnaround <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>

              {/* Trust Metric Badges */}
              <div className={styles.heroTrustRow}>
                <div className={styles.heroTrustItem}>
                  <span className={styles.trustNum}>10+</span>
                  <span className={styles.trustLabel}>Years on Bench</span>
                </div>
                <div className={styles.heroTrustDivider} aria-hidden="true" />
                <div className={styles.heroTrustItem}>
                  <span className={styles.trustNum}>15k+</span>
                  <span className={styles.trustLabel}>Systems Serviced</span>
                </div>
                <div className={styles.heroTrustDivider} aria-hidden="true" />
                <div className={styles.heroTrustItem}>
                  <span className={styles.trustNum}>Same-Day</span>
                  <span className={styles.trustLabel}>Express Repairs</span>
                </div>
                <div className={styles.heroTrustDivider} aria-hidden="true" />
                <div className={styles.heroTrustItem}>
                  <span className={styles.trustNum}>100%</span>
                  <span className={styles.trustLabel}>OEM Spare Parts</span>
                </div>
              </div>
            </div>

            {/* Right Visual & Workshop Dossier Column */}
            <div className={styles.heroVisualCol}>
              {/* Technician Showcase Image Card */}
              <div className={styles.heroImageCard}>
                <div className={styles.heroImageWrap}>
                  <img
                    src="/hero-technician.png"
                    alt="Master Computer Technician at Riddhi Computer Workshop Kharghar"
                    className={styles.heroTechnicianImg}
                    loading="eager"
                  />
                  <div className={styles.heroImageGradient} aria-hidden="true" />
                </div>

                {/* Floating Tag Top */}
                <div className={styles.heroImgBadgeTop}>
                  <span className={styles.badgePulseDot} />
                  <span>Live Bench Diagnostics</span>
                </div>

                {/* Bottom Overlay Label */}
                <div className={styles.heroImgOverlayBottom}>
                  <div className={styles.heroImgTechName}>Raju &amp; Lead Bench Team</div>
                  <div className={styles.heroImgTechRole}>Chip-Level Motherboard &amp; Hardware Diagnostics</div>
                </div>
              </div>

              {/* Monograph Ledger / Manifest Card */}
              <aside className={styles.heroManifest} aria-label="Workshop intake details">
                <div className={styles.manifestHeader}>
                  <span className={styles.manifestProvenance}>Riddhi Computer / Est. 2014</span>
                  <span className={styles.manifestStatus}>Intake Open</span>
                </div>
                <div className={styles.manifestRule} aria-hidden="true" />
                <dl className={styles.manifestList}>
                  <div className={styles.manifestRow}>
                    <dt>Bench Location</dt>
                    <dd>Shop 12, Sector 7, Kharghar, Navi Mumbai</dd>
                  </div>
                  <div className={styles.manifestRow}>
                    <dt>Turnaround</dt>
                    <dd>Same-day for screens &amp; drives; 24–48h board repair</dd>
                  </div>
                  <div className={styles.manifestRow}>
                    <dt>Intake Policy</dt>
                    <dd>Upfront quotation. No diagnostic fee if unrepairable.</dd>
                  </div>
                  <div className={styles.manifestRow}>
                    <dt>Components</dt>
                    <dd>OEM screens, keyboards, thermal paste &amp; tier-1 SSDs</dd>
                  </div>
                </dl>
                <div className={styles.manifestFooter}>
                  <span className={styles.manifestHours}>Mon – Sat / 10:00 – 21:00</span>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Raju!%20I%20have%20a%20question%20about%20a%20laptop%20or%20repair."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.manifestDirectLine}
                  >
                    Direct desk line →
                  </a>
                </div>
              </aside>
            </div>

          </div>
          <div className={styles.heroBorderBottom} aria-hidden="true" />
        </section>

        {/* ═══ CATEGORIES — Editorial list ═══ */}
        <section className={`${styles.categoriesSection}`} id="categories">
          <div className="container">
            <div className={styles.sectionLabel}>
              <p className={styles.chapterNum} aria-hidden="true">02</p>
              <h2 className={styles.sectionHeading}>What We Do</h2>
            </div>
            <div className={styles.catList}>
              {categories.map((cat, i) => (
                <Link key={cat.name} href={cat.href} className={styles.catItem}>
                  <span className={styles.catIcon}>{cat.icon}</span>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catDesc}>{cat.desc}</span>
                  <ArrowRight size={14} className={styles.catArrow} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SERVICES — Asymmetric two-column ═══ */}
        <section className={styles.servicesSection} id="services">
          <div className="container">
            <div className={styles.sectionLabel}>
              <p className={styles.chapterNum} aria-hidden="true">03</p>
              <h2 className={styles.sectionHeading}>Repair Services</h2>
            </div>
            <p className={styles.sectionIntro}>
              We repair all major brands at chip level. Genuine parts, same-day turnaround on most jobs, and a warranty on every repair.
            </p>
            <div className={styles.servicesGrid}>
              {repairServices.map((svc, i) => (
                <div key={svc.name} className={styles.serviceItem}>
                  <span className={styles.serviceIcon}>{svc.icon}</span>
                  <div>
                    <h3 className={styles.serviceName}>{svc.name}</h3>
                    <p className={styles.serviceDesc}>{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.servicesCta}>
              <Link href="/book-repair" className={styles.textLink}>
                Book a repair online <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ PULL QUOTE ═══ */}
        <aside className={styles.pullquote} aria-label="Practice note">
          <div className="container">
            <div className={styles.pullquoteInner}>
              <div className={styles.pullquoteMargin} aria-hidden="true">
                <span /><span /><span /><span /><span />
                <span /><span /><span />
              </div>
              <blockquote>
                <p>
                  &ldquo;We don&apos;t upsell. If your laptop needs a ₹400 thermal paste job,
                  we won&apos;t recommend a ₹12,000 motherboard replacement. That&apos;s cost
                  us some revenue. We&apos;re comfortable with that.&rdquo;
                </p>
                <cite>— Raju, founder</cite>
              </blockquote>
            </div>
          </div>
        </aside>

        {/* ═══ WHY US — Editorial principles ═══ */}
        <section className={styles.principlesSection} id="why-us">
          <div className="container">
            <div className={styles.sectionLabel}>
              <p className={styles.chapterNum} aria-hidden="true">04</p>
              <h2 className={styles.sectionHeading}>How We Work</h2>
            </div>
            <div className={styles.principlesGrid}>
              {principles.map((p, i) => (
                <div key={p.title} className={styles.principleItem}>
                  <h3 className={styles.principleTitle}>{p.title}</h3>
                  <p className={styles.principleText}>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PROMO — Warm accent band ═══ */}
        <section className={styles.promoBand}>
          <div className="container">
            <div className={styles.promoInner}>
              <div className={styles.promoText}>
                <h2 className={styles.promoTitle}>Upgrade your old laptop today.</h2>
                <p className={styles.promoDesc}>
                  SSD and RAM upgrades at transparent prices. Most upgrades completed in under an hour while you wait.
                </p>
              </div>
              <div className={styles.promoActions}>
                <Link href="/services" className={styles.textLink}>
                  View upgrade options <ArrowRight size={14} />
                </Link>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                  WhatsApp us <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOUNDERS ═══ */}
        <section className={styles.foundersSection}>
          <div className="container">
            <div className={styles.sectionLabel}>
              <p className={styles.chapterNum} aria-hidden="true">05</p>
              <h2 className={styles.sectionHeading}>The People</h2>
            </div>
            <div className={styles.foundersGrid}>
              <div className={styles.foundersCredentialsCard}>
                <span className={styles.foundersBadge}>WORKSHOP STORY</span>
                <h3 className={styles.foundersLeadQuote}>
                  &ldquo;A computer repair shop built on word-of-mouth trust and microscope precision.&rdquo;
                </h3>
                <div className={styles.foundersMetaList}>
                  <div className={styles.metaItem}>
                    <strong>Founded</strong>
                    <span>2014 in Kharghar</span>
                  </div>
                  <div className={styles.metaItem}>
                    <strong>Supervision</strong>
                    <span>Direct by Raju &amp; Senior Techs</span>
                  </div>
                  <div className={styles.metaItem}>
                    <strong>Location</strong>
                    <span>Sector 35D, Kharghar</span>
                  </div>
                </div>
              </div>
              <div className={styles.foundersText}>
                <p className={styles.foundersLede}>
                  Riddhi Computer has been locally owned and operated since 2014. When you visit our Kharghar store or book a home repair, you deal directly with experienced technicians.
                </p>
                <p>
                  No middlemen. No outsourced call centres. When Raju quotes you a price, that's the price. When a technician says your laptop needs a specific part, they've diagnosed it themselves under a microscope.
                </p>
                <p>
                  We've repaired over 15,000 laptops. We've replaced more screens than we can count. We still get nervous about every motherboard repair, which is why we do them carefully.
                </p>
                <div className={styles.foundersActions}>
                  <Link href="/about" className={styles.textLink}>
                    Read our full story <ArrowRight size={14} />
                  </Link>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Raju!%20I%20visited%20your%20website."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.textLink}
                  >
                    Chat with Raju <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className={styles.faqSection} id="faq">
          <div className="container">
            <div className={styles.sectionLabel}>
              <p className={styles.chapterNum} aria-hidden="true">06</p>
              <h2 className={styles.sectionHeading}>Common Questions</h2>
            </div>
            <div className={styles.faqList}>
              {faqs.map((faq, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    {faq.q}
                    <svg className={styles.faqChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="6,9 12,15 18,9" /></svg>
                  </summary>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ LOCATION ═══ */}
        <section className={styles.locationSection} id="location">
          <div className="container">
            <div className={styles.sectionLabel}>
              <p className={styles.chapterNum} aria-hidden="true">07</p>
              <h2 className={styles.sectionHeading}>Visit Us</h2>
            </div>
            <div className={styles.locationGrid}>
              <div className={styles.locationInfo}>
                <h3 className={styles.locationName}>Riddhi Computer</h3>
                <address className={styles.locationAddress}>
                  <p>
                    Shop No 12, Sai Aangan CHS,<br />
                    Plot No. 44, Sector 35D,<br />
                    Kharghar, Navi Mumbai – 410210
                  </p>
                </address>
                <div className={styles.locationActions}>
                  <a href="tel:+919876543210" className={styles.textLink}>
                    <Phone size={14} /> Call now
                  </a>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <a href="https://maps.google.com/?q=Riddhi+Computer+Kharghar" target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                    <MapPin size={14} /> Get directions
                  </a>
                </div>
              </div>
              <div className={styles.locationMap}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5!2d73.06!3d19.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAyJzI0LjAiTiA3M8KwMDMnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="320"
                  style={{ border: 0, filter: 'saturate(0.7) contrast(1.05)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Riddhi Computer Location"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CONTACT CTA — Simple ═══ */}
        <section className={styles.contactCta}>
          <div className="container">
            <h2 className={styles.ctaTitle}>Need help with your laptop?</h2>
            <p className={styles.ctaDesc}>
              Call, message, or book online. We respond within the hour during business hours.
            </p>
            <div className={styles.ctaActions}>
              <a href="tel:+919876543210" className={styles.ctaLink}>
                <Phone size={16} /> Call now
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className={styles.ctaLink}>
                <MessageCircle size={16} /> WhatsApp
              </a>
              <Link href="/book-repair" className={styles.ctaLink}>
                Book repair online
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
