'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { MessageCircle } from 'lucide-react';

export default function ComputersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadComputers() {
      setLoading(true);
      try {
        const res = await api.getProducts({ limit: 20 });
        if (res && res.products) {
          const compItems = res.products.filter(p =>
            p.category?.slug === 'computers' ||
            p.tags?.includes('desktop') ||
            p.tags?.includes('gaming') ||
            p.name?.toLowerCase().includes('pc') ||
            p.name?.toLowerCase().includes('gaming')
          );
          setProducts(compItems.length > 0 ? compItems : res.products);
        }
      } catch (err) {
        console.error('Failed to load computers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadComputers();
  }, []);

  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--paper)', paddingBottom: '80px' }}>
        <div className="page-banner">
          <div className="container">
            <span className="page-banner-label">
              Custom Builds & Workstations
            </span>
            <h1 className="page-banner-title">
              Gaming PCs & Desktops
            </h1>
            <p className="page-banner-desc">
              Assembled, stress-tested, and optimized by Riddhi Computer technicians with 3-year warranty and free doorstep setup in Kharghar.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: 'var(--space-8)' }}>
          {/* Custom PC Banner */}
          <div style={{
            background: 'var(--ink)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 28px',
            color: 'var(--paper)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '28px',
            border: '1px solid var(--ink-light)'
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--paper)', letterSpacing: '-0.01em' }}>Want a custom PC build?</h3>
              <p style={{ color: 'var(--rule)', fontSize: '0.8125rem', fontWeight: 300, marginTop: '4px' }}>Tell us your budget and requirements. We assemble and test with original parts.</p>
            </div>
            <a
              href="https://wa.me/919876543210?text=Hi%20Riddhi%20Computer!%20I%20want%20a%20quote%20for%20a%20custom%20PC%20build."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <MessageCircle size={16} /> Get Custom Quote
            </a>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-muted)' }}>Loading computers...</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {products.map(product => (
                <div
                  key={product._id}
                  style={{
                    background: 'var(--paper)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--rule-faint)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 220ms ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--rule)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--rule-faint)'}
                >
                  <Link href={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      aspectRatio: '4/3',
                      background: 'var(--paper-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px'
                    }}>
                      <img
                        src={product.thumbnail?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80'}
                        alt={product.name}
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </Link>
                  <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 400, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--sans)' }}>
                        {product.brand}
                      </span>
                      <Link href={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.0625rem', fontWeight: 500, color: 'var(--ink)', margin: '4px 0 6px', lineHeight: 1.35 }}>
                          {product.name}
                        </h3>
                      </Link>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', marginBottom: '12px', lineHeight: 1.55, fontFamily: 'var(--sans)', fontWeight: 300 }}>
                        {product.description?.substring(0, 90)}...
                      </p>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                        <span style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--ink)' }}>
                          ₹{product.sellingPrice?.toLocaleString('en-IN')}
                        </span>
                        {product.mrp > product.sellingPrice && (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', textDecoration: 'line-through' }}>
                            ₹{product.mrp?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <button
                          onClick={() => addToCart(product, 1)}
                          style={{
                            padding: '8px',
                            background: 'transparent',
                            color: 'var(--ink)',
                            border: '1px solid var(--rule)',
                            borderRadius: 'var(--radius-sm)',
                            fontFamily: 'var(--sans)',
                            fontWeight: 400,
                            fontSize: '0.8125rem',
                            cursor: 'pointer'
                          }}
                        >
                          Add to Cart
                        </button>
                        <Link
                          href={`/products/${product._id}`}
                          style={{
                            padding: '8px',
                            background: 'var(--ink)',
                            color: 'var(--paper)',
                            borderRadius: 'var(--radius-sm)',
                            fontFamily: 'var(--sans)',
                            fontWeight: 400,
                            fontSize: '0.8125rem',
                            textAlign: 'center',
                            textDecoration: 'none'
                          }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
