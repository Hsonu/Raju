'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { Cpu } from 'lucide-react';

export default function LaptopsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandFilter, setBrandFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadLaptops() {
      setLoading(true);
      try {
        const res = await api.getProducts({ limit: 20 });
        if (res && res.products) {
          const laptopItems = res.products.filter(p =>
            p.category?.slug === 'laptops' ||
            p.tags?.includes('laptop') ||
            ['HP', 'Dell', 'Lenovo', 'Apple', 'Asus', 'Acer'].includes(p.brand)
          );
          setProducts(laptopItems.length > 0 ? laptopItems : res.products);
        }
      } catch (err) {
        console.error('Failed to load laptops:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLaptops();
  }, []);

  const filteredProducts = products.filter(p => {
    if (brandFilter !== 'all' && p.brand?.toLowerCase() !== brandFilter.toLowerCase()) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.sellingPrice - b.sellingPrice;
    if (sortBy === 'price-high') return b.sellingPrice - a.sellingPrice;
    return 0;
  });

  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--paper)', paddingBottom: '80px' }}>
        {/* Banner */}
        <div className="page-banner">
          <div className="container">
            <span className="page-banner-label">
              Top Brand Laptops
            </span>
            <h1 className="page-banner-title">
              Laptops & MacBooks
            </h1>
            <p className="page-banner-desc">
              Explore the latest high-performance gaming, business, and student laptops from HP, Dell, Lenovo, and Apple with official warranty.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: 'var(--space-8)' }}>
          {/* Controls Bar */}
          <div style={{
            background: 'var(--paper)',
            border: '1px solid var(--rule-faint)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '28px'
          }}>
            {/* Brand Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['all', 'HP', 'Dell', 'Lenovo', 'Apple'].map(b => (
                <button
                  key={b}
                  onClick={() => setBrandFilter(b)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: brandFilter === b ? '1px solid var(--ink)' : '1px solid var(--rule-faint)',
                    background: brandFilter === b ? 'var(--ink)' : 'transparent',
                    color: brandFilter === b ? 'var(--paper)' : 'var(--ink-light)',
                    fontFamily: 'var(--sans)',
                    fontWeight: 400,
                    fontSize: '0.8125rem',
                    letterSpacing: '0.02em',
                    cursor: 'pointer',
                    transition: 'all 220ms ease'
                  }}
                >
                  {b === 'all' ? 'All Brands' : b}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', fontWeight: 300 }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{
                  padding: '6px 32px 6px 10px',
                  width: 'auto',
                  fontSize: '0.8125rem'
                }}
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'var(--ink-muted)' }}>Loading laptops...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px solid var(--rule-faint)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, color: 'var(--ink)', marginBottom: '12px' }}>No laptops found for selected filter</h3>
              <button onClick={() => setBrandFilter('all')} style={{ padding: '8px 20px', background: 'var(--ink)', color: 'var(--paper)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.8125rem' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {filteredProducts.map(product => {
                const discount = product.mrp > product.sellingPrice
                  ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
                  : 0;

                return (
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
                        position: 'relative',
                        aspectRatio: '4/3',
                        background: 'var(--paper-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                      }}>
                        <img
                          src={product.thumbnail?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80'}
                          alt={product.name}
                          style={{ maxHeight: '100%', objectFit: 'contain' }}
                        />
                        {discount > 0 && (
                          <span style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'var(--error)',
                            color: 'var(--paper)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.6875rem',
                            fontWeight: 500,
                            letterSpacing: '0.03em'
                          }}>
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                    </Link>

                    <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 400, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--sans)' }}>
                            {product.brand}
                          </span>
                        </div>
                        <Link href={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{
                            fontFamily: 'var(--serif)',
                            fontSize: '1.0625rem',
                            fontWeight: 500,
                            color: 'var(--ink)',
                            lineHeight: 1.35,
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {product.name}
                          </h3>
                        </Link>
                        {product.specifications?.processor && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--sans)', fontWeight: 300 }}>
                            <Cpu size={13} color="var(--accent)" /> {product.specifications.processor} | {product.specifications.ram || '16GB RAM'}
                          </p>
                        )}
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
                              cursor: 'pointer',
                              transition: 'border-color 220ms ease'
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
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
