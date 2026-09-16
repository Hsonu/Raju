'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'RC-948201';
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rc_latest_order');
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  return (
    <div className="container" style={{ maxWidth: '700px', margin: '40px auto 80px' }}>
      <div style={{
        background: 'var(--paper)',
        borderRadius: '20px',
        padding: '40px 32px',
        boxShadow: '0 8px 30px rgba(15, 39, 68, 0.08)',
        border: '1px solid var(--rule-faint)',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#d1fae5',
          color: 'var(--success)',
          fontSize: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          ✓
        </div>

        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Order Confirmed
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--ink)', margin: '6px 0 12px' }}>
          Thank You for Your Order!
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
          We have received your order and our Kharghar store team is preparing it for dispatch.
        </p>

        {/* Order ID Badge */}
        <div style={{
          background: 'var(--paper-alt)',
          borderRadius: '12px',
          padding: '16px 24px',
          border: '1px solid var(--rule-faint)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', display: 'block' }}>Order Reference Number</span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{orderId}</strong>
          </div>
          <Link
            href={`/track-order?id=${orderId}`}
            style={{
              padding: '8px 16px',
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}
          >
            Track Status 🚚
          </Link>
        </div>

        {/* Order Details Breakdown if available */}
        {order && (
          <div style={{ textAlign: 'left', borderTop: '1px solid var(--paper-alt)', paddingTop: '24px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span>{item.qty}x {item.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--ink)' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--paper-alt)', padding: '16px', borderRadius: '10px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--ink-muted)' }}>Delivery Address:</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{order.shippingAddress?.address}, {order.shippingAddress?.city}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--ink-muted)' }}>Recipient:</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{order.shippingAddress?.fullName} ({order.shippingAddress?.phone})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--ink-muted)' }}>Payment Mode:</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        )}

        {/* Estimated Delivery Note */}
        <div style={{
          background: '#eff6ff',
          borderRadius: '12px',
          padding: '16px',
          color: 'var(--accent)',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '32px',
          textAlign: 'left',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🛵</span>
          <div>
            <strong>Estimated Delivery: Today / Within 24 Hours in Kharghar</strong>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', opacity: 0.9 }}>Our team member will call you before dispatch.</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '14px 28px',
              background: 'var(--ink)',
              color: 'var(--paper)',
              borderRadius: '8px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            Return to Homepage
          </Link>
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Riddhi Computer! I just placed order ${orderId}. Can you please confirm the delivery timing?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '14px 24px',
              background: '#25D366',
              color: 'var(--paper)',
              borderRadius: '8px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            💬 Update via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--paper-alt)', minHeight: '80vh', padding: '20px 0' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Loading confirmation...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
