import Link from 'next/link';
import styles from './Footer.module.css';

const quickLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/laptops', label: 'Laptops' },
  { href: '/accessories', label: 'Accessories' },
  { href: '/services', label: 'Repair Services' },
  { href: '/home-repair', label: 'Home Visit Repair' },
  { href: '/book-repair', label: 'Book Repair' },
];

const supportLinks = [
  { href: '/track-order', label: 'Track Order' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/about', label: 'About Us' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
];

const services = [
  'Laptop Repair', 'Desktop Repair', 'Windows Installation',
  'SSD Upgrade', 'RAM Upgrade', 'Laptop Cleaning',
  'Software Installation', 'Data Recovery',
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Grid */}
        <div className={styles.grid}>
          {/* Brand & Address */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoName}>Riddhi</span>
              <span className={styles.logoSub}>Computer</span>
            </Link>
            <p className={styles.desc}>
              Laptop sales, repair, and accessories. Serving Kharghar
              and Navi Mumbai since 2014. Genuine parts only.
            </p>
            <address className={styles.address}>
              <p>
                Shop No 12, Sai Aangan CHS,<br/>
                Plot No. 44, Sector 35D,<br/>
                Kharghar, Navi Mumbai – 410210
              </p>
            </address>
            <div className={styles.contactLinks}>
              <a href="tel:+919999999999" className={styles.contactItem}>
                +91 99999 99999
              </a>
              <a href="mailto:info@riddhicomputer.com" className={styles.contactItem}>
                info@riddhicomputer.com
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Shop</h4>
            <ul className={styles.linkList}>
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.linkList}>
              {services.map(s => (
                <li key={s}>
                  <Link href="/services" className={styles.link}>{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Support</h4>
            <ul className={styles.linkList}>
              {supportLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colophon — type credits, city, year */}
        <div className={styles.colophon}>
          <div className={styles.colophonLeft}>
            <p>© 2014–{new Date().getFullYear()} Riddhi Computer</p>
            <p>Kharghar, Navi Mumbai</p>
          </div>
          <div className={styles.colophonCenter}>
            <p>Set in Cormorant Garamond & IBM Plex Sans.</p>
          </div>
          <div className={styles.colophonRight}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
