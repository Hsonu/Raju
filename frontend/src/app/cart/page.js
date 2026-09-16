'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    items,
    itemCount,
    subtotal,
    totalMRP,
    savings,
    deliveryCharge,
    grandTotal,
    coupon,
    discountAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponInput.trim());
    setApplyingCoupon(false);
  };

  const handleProceedToCheckout = (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in first to proceed to checkout', 'info');
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <>
      <Header />
      <main className="page-content" style={{ minHeight: '80vh' }}>
        {/* Breadcrumb / Title Header */}
        <div style={{ background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-6) 0' }}>
          <div className="container">
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-primary)' }}>
              Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h1>
          </div>
        </div>

        <div className="container page-content-inner">
          {items.length === 0 ? (
            <div className="content-card empty-state" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="empty-state-icon">
                <ShoppingBag size={40} strokeWidth={1.75} />
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven&apos;t added any laptops or accessories to your cart yet.</p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/products" className="btn btn-primary">Explore Products</Link>
                <Link href="/book-repair" className="btn btn-secondary">Book Laptop Repair</Link>
              </div>
            </div>
          ) : (
            <div className="two-col-grid">
              {/* Cart Items List */}
              <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-primary)' }}>Items in Cart</h3>
                  <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'var(--color-error)', fontSize: 'var(--font-size-sm)', fontWeight: 600, cursor: 'pointer' }}>
                    Clear All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  {items.map((item) => {
                    const prod = item.product;
                    const itemImg = prod.thumbnail?.url || prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300';

                    return (
                      <div key={prod._id} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border-light)', flexWrap: 'wrap' }}>
                        {/* Thumbnail */}
                        <div style={{
                          width: '90px', height: '90px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)',
                          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: 'var(--space-2)', border: '1px solid var(--color-border)', flexShrink: 0
                        }}>
                          <img src={itemImg} alt={prod.name} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-primary-light)', textTransform: 'uppercase' }}>
                            {prod.brand}
                          </span>
                          <Link href={`/products/${prod._id}`} style={{ textDecoration: 'none' }}>
                            <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-primary)', margin: 'var(--space-1) 0 var(--space-2)' }}>
                              {prod.name}
                            </h4>
                          </Link>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                            <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-primary)' }}>
                              ₹{(prod.sellingPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                              (₹{prod.sellingPrice?.toLocaleString('en-IN')} each)
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                          <div className="qty-control">
                            <button onClick={() => updateQuantity(prod._id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(prod._id, item.quantity + 1)}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(prod._id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 'var(--space-2)', fontSize: '1.2rem', lineHeight: 1 }} title="Remove item">
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: 'var(--space-5)' }}>
                  <Link href="/products" style={{ color: 'var(--color-primary-light)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {/* Coupon Box */}
                <div className="content-card">
                  <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    Apply Promo / Coupon Code
                  </h4>

                  {coupon ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: 'var(--space-3) var(--space-4)', background: 'var(--color-success-light)',
                      borderRadius: 'var(--radius-md)', color: '#065f46', fontWeight: 600, fontSize: 'var(--font-size-sm)'
                    }}>
                      <div><span>🎟️ <strong>{coupon.code}</strong> applied (-₹{discountAmount})</span></div>
                      <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#991b1b', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <input
                        type="text" placeholder="e.g. WELCOME10 or REPAIR500" value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="form-input" style={{ flex: 1, textTransform: 'uppercase', fontWeight: 600 }}
                      />
                      <button type="submit" disabled={applyingCoupon} className="btn" style={{ background: 'var(--color-primary)', color: 'var(--color-white)' }}>
                        {applyingCoupon ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}
                  <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Available coupons: <strong>WELCOME10</strong> (10% off), <strong>REPAIR500</strong> (₹500 off)
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="content-card">
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
                    Order Summary
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div className="order-summary-row">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {savings > 0 && (
                      <div className="order-summary-row" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                        <span>Discount / Savings</span>
                        <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="order-summary-row">
                      <span>Doorstep Delivery (Kharghar)</span>
                      <span style={{ color: deliveryCharge === 0 ? 'var(--color-success)' : 'var(--color-text)', fontWeight: 600 }}>
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>

                    <div className="order-summary-row" style={{ fontSize: 'var(--font-size-xs)' }}>
                      <span>Estimated GST (18%)</span>
                      <span>Included in price</span>
                    </div>

                    <div className="order-summary-total">
                      <span>Grand Total</span>
                      <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button onClick={handleProceedToCheckout} className="btn btn-primary btn-lg" style={{
                    width: '100%', marginTop: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)'
                  }}>
                    {user ? (
                      <>Proceed to Checkout <ArrowRight size={18} /></>
                    ) : (
                      <><Lock size={18} /> Login & Proceed to Checkout <ArrowRight size={18} /></>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                    <ShieldCheck size={16} color="var(--color-success)" /> 100% Safe & Secure Checkout {!user && '• Sign in required'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
