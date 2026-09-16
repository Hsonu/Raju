'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Header.module.css';
import { ClipboardList, ShoppingCart, User, Package, Phone, MessageCircle } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/laptops', label: 'Laptops' },
  { href: '/services', label: 'Services' },
  { href: '/home-repair', label: 'Home Repair' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="3" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M10 25h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M16 21v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoName}>Riddhi</span>
              <span className={styles.logoSub}>Computer</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/book-repair" className={styles.repairBtn}>
              Book Repair
            </Link>
            <Link href="/cart" className={styles.cartBtn} aria-label="Cart" style={{ position: 'relative' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--accent, #7A4028)',
                  color: 'var(--paper, #F3EEE6)',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link href="/account" className={styles.userBtn} aria-label="Account" title={user.name}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            ) : (
              <Link href="/login" className={styles.loginBtn}>
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className={`${styles.menuToggle} ${menuOpen ? styles.menuOpen : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}

      {/* Mobile Menu Drawer */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.logoText}>
            <span className={styles.logoName}>Riddhi</span>
            <span className={styles.logoSub}>Computer</span>
          </div>
        </div>
        <nav className={styles.mobileNav}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileDivider} />
          <Link href="/book-repair" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
            Book Repair
          </Link>
          <Link href="/cart" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          <Link href={user ? '/account' : '/login'} className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
            {user ? 'Account' : 'Login'}
          </Link>
          <Link href="/track-order" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
            Track Order
          </Link>
        </nav>
        <div className={styles.mobileFooter}>
          <a href="tel:+919876543210" className={styles.mobileContact}>
            <Phone size={14} style={{marginRight: '6px'}} /> Call
          </a>
          <a href="https://wa.me/919876543210" className={styles.mobileContact} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={14} style={{marginRight: '6px'}} /> WhatsApp
          </a>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div style={{ height: 'var(--header-height)' }} />
    </>
  );
}
