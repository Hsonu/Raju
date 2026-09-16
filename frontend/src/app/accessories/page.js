'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

export default function AccessoriesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadAccessories() {
      setLoading(true);
      try {
        const res = await api.getProducts({ limit: 20 });
        if (res && res.products) {
          const accItems = res.products.filter(p =>
            p.category?.slug === 'accessories' ||
            p.category?.slug === 'components' ||
            ['mouse', 'ssd', 'ram', 'keyboard', 'headset'].some(tag => p.tags?.includes(tag))
          );
          setProducts(accItems.length > 0 ? accItems : res.products);
        }
      } catch (err) {
        console.error('Failed to load accessories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAccessories();
  }, []);

  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--paper)', paddingBottom: '80px' }}>
        <div className="page-banner">
          <div className="container">
            <span className="page-banner-label">
              Genuine Peripherals & Upgrades
            </span>
            <h1 className="page-banner-title">
              Accessories & Components
            </h1>
            <p className="page-banner-desc">
              SSDs, RAM modules, wireless mice, mechanical keyboards, chargers, and laptop bags with guaranteed compatibility.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: 'var(--space-8)' }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-muted)' }}>Loading accessories...</p>
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
                        src={product.thumbnail?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80'}
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
