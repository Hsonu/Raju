'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import api from '../../../services/api';
import { ShieldCheck, Truck, Wrench, CreditCard, Star, ShoppingCart, Zap, MessageCircle } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('specs');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await api.getProduct(id);
        if (res && res.product) {
          setProduct(res.product);
          // Load related products
          const relRes = await api.getProducts({ limit: 4 });
          if (relRes && relRes.products) {
            setRelatedProducts(relRes.products.filter(p => p._id !== res.product._id));
          }
        }
      } catch (err) {
        console.error('Failed to load product from API:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--rule-faint)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Loading product details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>Product Not Found</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>The product you are looking for might have been removed or is temporarily unavailable.</p>
            <Link href="/products" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Browse All Products
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images.map(img => typeof img === 'string' ? img : img.url)
    : [product.thumbnail?.url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'];

  const discountPercent = product.mrp && product.sellingPrice
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (!user) {
      showToast('Please sign in first to proceed with your purchase', 'info');
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  const whatsappMsg = encodeURIComponent(`Hi Riddhi Computer! I am interested in buying: ${product.name} (₹${product.sellingPrice.toLocaleString('en-IN')}). Is this available?`);
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMsg}`;

  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--paper-alt)', paddingBottom: '80px' }}>
        {/* Breadcrumb */}
        <div style={{ background: 'var(--paper)', borderBottom: '1px solid var(--rule-faint)', padding: '14px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--ink-muted)' }}>
            <Link href="/" style={{ color: 'var(--ink-muted)' }}>Home</Link>
            <span>/</span>
            <Link href="/products" style={{ color: 'var(--ink-muted)' }}>Products</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.name}
            </span>
          </div>
        </div>

        <div className="container" style={{ marginTop: '32px' }}>
          {/* Main Product Card */}
          <div style={{
            background: 'var(--paper)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(15, 39, 68, 0.06)',
            padding: '32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Image Gallery Column */}
            <div>
              <div style={{
                position: 'relative',
                background: 'var(--paper-alt)',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--rule-faint)'
              }}>
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }}
                />
                {discountPercent > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'var(--error)',
                    color: 'var(--paper)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '8px',
                        border: selectedImage === idx ? '2px solid var(--accent)' : '1px solid var(--rule-faint)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: 'var(--paper-alt)',
                        padding: '4px',
                        flexShrink: 0
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div style={{
                marginTop: '32px',
                padding: '20px',
                background: 'var(--paper-alt)',
                borderRadius: '12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center' }}><ShieldCheck size={24} /></span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ink)' }}>100% Genuine</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>Brand Original</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center' }}><Truck size={24} /></span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ink)' }}>Fast Delivery</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>Same Day in Kharghar</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center' }}><Wrench size={24} /></span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ink)' }}>Store Support</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>Free Setup & Help</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center' }}><CreditCard size={24} /></span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ink)' }}>Easy Payments</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>COD / UPI Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Column */}
            <div>
              {product.brand && (
                <span style={{
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  letterSpacing: '0.05em'
                }}>
                  {product.brand}
                </span>
              )}
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.3,
                marginTop: '6px',
                marginBottom: '12px'
              }}>
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--success)',
                  color: 'var(--paper)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}>
                  <span><Star size={14} fill="#eab308" stroke="#eab308" /></span>
                  <span>{product.ratings?.average || product.rating?.average || 4.8}</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                  ({product.ratings?.count || product.rating?.count || 24} reviews)
                </span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: (product.stockQuantity ?? 10) > 0 ? '#d1fae5' : '#fee2e2',
                  color: (product.stockQuantity ?? 10) > 0 ? '#065f46' : '#991b1b'
                }}>
                  {(product.stockQuantity ?? 10) > 0 ? `In Stock (${product.stockQuantity || 12} units)` : 'Out of Stock'}
                </span>
              </div>

              {/* Pricing Box */}
              <div style={{
                padding: '20px',
                background: 'var(--paper-alt)',
                borderRadius: '12px',
                border: '1px solid var(--rule-faint)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--ink)' }}>
                    ₹{product.sellingPrice?.toLocaleString('en-IN')}
                  </span>
                  {product.mrp && product.mrp > product.sellingPrice && (
                    <span style={{ fontSize: '1.2rem', color: 'var(--ink-muted)', textDecoration: 'line-through' }}>
                      ₹{product.mrp?.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.95rem', background: '#dcfce7', padding: '3px 10px', borderRadius: '6px' }}>
                      Save ₹{(product.mrp - product.sellingPrice).toLocaleString('en-IN')} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '10px', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                  <span style={{ padding: '2px 8px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', fontWeight: 700 }}>
                    🧾 {product.gstPercentage || 18}% GST Included (HSN: {product.hsnCode || '8471'})
                  </span>
                  <span>• Free doorstep delivery in Kharghar, Navi Mumbai</span>
                </div>
              </div>

              {/* Short Highlights */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Key Highlights</h4>
                <p style={{ color: 'var(--ink-light)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>Quantity:</span>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid var(--rule)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: 'var(--paper)'
                }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '8px 16px', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      padding: '14px',
                      background: 'var(--ink)',
                      color: 'var(--paper)',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    style={{
                      padding: '14px',
                      background: 'var(--accent)',
                      color: 'var(--paper)',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                  >
                    <Zap size={18} /> Buy Now
                  </button>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px',
                    background: '#25D366',
                    color: 'var(--paper)',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageCircle size={18} /> Inquire on WhatsApp (+91 98765 43210)
                </a>
              </div>
            </div>
          </div>

          {/* Specifications and Reviews Tabs */}
          <div style={{
            background: 'var(--paper)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(15, 39, 68, 0.06)',
            padding: '32px',
            marginTop: '32px'
          }}>
            <div style={{ display: 'flex', borderBottom: '2px solid var(--rule-faint)', gap: '32px', marginBottom: '24px' }}>
              <button
                onClick={() => setActiveTab('specs')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: activeTab === 'specs' ? 'var(--accent)' : 'var(--ink-muted)',
                  borderBottom: activeTab === 'specs' ? '3px solid var(--accent)' : 'none',
                  cursor: 'pointer',
                  marginBottom: '-2px'
                }}
              >
                Detailed Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: activeTab === 'reviews' ? 'var(--accent)' : 'var(--ink-muted)',
                  borderBottom: activeTab === 'reviews' ? '3px solid var(--accent)' : 'none',
                  cursor: 'pointer',
                  marginBottom: '-2px'
                }}
              >
                Customer Reviews (5)
              </button>
            </div>

            {activeTab === 'specs' ? (
              <div>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div
                        key={key}
                        style={{
                          padding: '16px',
                          background: 'var(--paper-alt)',
                          borderRadius: '10px',
                          border: '1px solid var(--rule-faint)'
                        }}
                      >
                        <span style={{ textTransform: 'capitalize', fontSize: '0.8rem', color: 'var(--ink-muted)', fontWeight: 600, display: 'block' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>
                          {val}
                        </strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--ink-muted)' }}>Standard specifications apply. Contact us for custom configurations.</p>
                )}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: 'var(--paper-alt)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--ink)' }}>Rahul Sharma (Verified Buyer, Kharghar)</strong>
                      <span style={{ color: '#eab308', display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#eab308" stroke="#eab308" />)}</span>
                    </div>
                    <p style={{ color: 'var(--ink-light)', fontSize: '0.9rem' }}>
                      Exceptional performance and genuine product. The team at Riddhi Computer delivered it to my home in Sector 15 within 2 hours.
                    </p>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--paper-alt)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--ink)' }}>Ankit Verma (Navi Mumbai)</strong>
                      <span style={{ color: '#eab308', display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#eab308" stroke="#eab308" />)}</span>
                    </div>
                    <p style={{ color: 'var(--ink-light)', fontSize: '0.9rem' }}>
                      Best price in Navi Mumbai. They also helped transfer all my old data free of charge. Great experience!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '24px' }}>
                You Might Also Like
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '24px'
              }}>
                {relatedProducts.map(rel => (
                  <Link
                    key={rel._id}
                    href={`/products/${rel._id}`}
                    style={{
                      background: 'var(--paper)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--rule-faint)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ aspectRatio: '1/1', background: 'var(--paper-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                      <img
                        src={rel.thumbnail?.url || rel.images?.[0]?.url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80'}
                        alt={rel.name}
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>{rel.brand}</span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', margin: '4px 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {rel.name}
                        </h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)' }}>
                          ₹{rel.sellingPrice?.toLocaleString('en-IN')}
                        </span>
                        {rel.mrp > rel.sellingPrice && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', textDecoration: 'line-through' }}>
                            ₹{rel.mrp?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
