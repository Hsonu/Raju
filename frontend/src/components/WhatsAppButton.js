'use client';
import { useState } from 'react';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const phoneNumber = '919876543210';
  const defaultMsg = encodeURIComponent('Hi Riddhi Computer! I have an inquiry regarding laptop sales & repair services in Kharghar.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMsg}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '26px',
        right: '26px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: 'inherit'
      }}
    >
      {/* Tooltip on hover */}
      <div
        style={{
          background: 'var(--ink, #1E1C19)',
          color: 'var(--paper, #F3EEE6)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm, 2px)',
          fontFamily: 'var(--sans)',
          fontSize: '0.75rem',
          fontWeight: 400,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(8px)',
          transition: 'all 220ms ease',
          pointerEvents: 'none'
        }}
      >
        Chat on WhatsApp
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Riddhi Computer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hovered ? '0 6px 20px rgba(37, 211, 102, 0.45)' : '0 3px 12px rgba(37, 211, 102, 0.35)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 220ms ease',
          textDecoration: 'none',
          cursor: 'pointer'
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 20.16C10.56 20.16 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.07 16.3C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.24 3.68 16.31 4.54 17.86 6.09C19.41 7.64 20.27 9.71 20.27 11.91C20.27 16.46 16.58 20.16 12.04 20.16ZM16.56 14.39C16.31 14.27 15.09 13.67 14.86 13.58C14.64 13.5 14.47 13.46 14.31 13.71C14.14 13.96 13.66 14.52 13.51 14.69C13.37 14.86 13.22 14.88 12.97 14.76C12.72 14.63 11.92 14.37 10.97 13.53C10.23 12.87 9.73 12.05 9.58 11.8C9.44 11.55 9.56 11.42 9.69 11.29C9.8 11.18 9.93 11.01 10.06 10.86C10.18 10.71 10.22 10.61 10.3 10.44C10.39 10.27 10.34 10.13 10.28 10.01C10.22 9.88 9.73 8.68 9.53 8.19C9.33 7.71 9.13 7.77 8.98 7.77C8.84 7.76 8.68 7.76 8.51 7.76C8.35 7.76 8.08 7.82 7.85 8.07C7.62 8.32 6.98 8.92 6.98 10.14C6.98 11.36 7.87 12.54 7.99 12.71C8.11 12.87 9.74 15.39 12.23 16.47C12.82 16.73 13.28 16.88 13.64 17C14.24 17.18 14.78 17.16 15.21 17.09C15.69 17.02 16.69 16.49 16.9 15.9C17.11 15.31 17.11 14.8 17.04 14.69C16.98 14.58 16.81 14.52 16.56 14.39Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  );
}
