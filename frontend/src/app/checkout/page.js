'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Lock, LogIn, UserPlus, Zap, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, deliveryCharge, discountAmount, grandTotal, coupon, clearCart } = useCart();
  const { user, loading: authLoading, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Kharghar, Navi Mumbai',
    state: 'Maharashtra',
    pincode: '410210',
    landmark: '',
    orderNotes: '',
    paymentMethod: 'cod',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.addresses?.[0]?.address || prev.address,
        city: user.addresses?.[0]?.city || prev.city,
        pincode: user.addresses?.[0]?.pincode || prev.pincode,
      }));
    }
  }, [user]);

  const handleQuickDemoLogin = async () => {
    try {
      await demoLogin('customer');
      showToast('Logged in as Demo Customer!');
    } catch (err) {
      showToast('Demo login failed', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="page-content" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before proceeding to checkout.</p>
            <Link href="/products" className="btn btn-primary">
              Browse Laptops &amp; Accessories
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Authentication Check
  if (!authLoading && !user) {
    return (
      <>
        <Header />
        <main style={{ backgroundColor: 'var(--color-bg-alt)', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-10) var(--space-5)' }}>
          <div className="content-card" style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: 'var(--radius-2xl)',
              background: 'linear-gradient(135deg, var(--accent), #1d4ed8)', color: 'var(--color-white)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-5)', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
            }}>
              <Lock size={28} strokeWidth={2.4} />
            </div>

            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
              Please Login to Continue Checkout
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.5, marginBottom: 'var(--space-6)' }}>
              To ensure safe order delivery and real-time shipment tracking, please sign in or register your account.
            </p>

            <div style={{
              background: 'var(--color-bg-alt)', padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
              marginBottom: 'var(--space-6)', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Order Summary</span>
                <strong style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-primary)' }}>{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</strong>
              </div>
              <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900, color: 'var(--color-primary-light)' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <Link href="/login?redirect=/checkout" className="btn btn-primary btn-lg" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <LogIn size={18} strokeWidth={2.4} /> Sign In to Your Account
              </Link>

              <Link href="/register?redirect=/checkout" className="btn btn-secondary" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <UserPlus size={18} strokeWidth={2.4} /> Create New Account
              </Link>

              <button type="button" onClick={handleQuickDemoLogin} className="btn" style={{
                background: 'linear-gradient(135deg, #fef08a, #fde047)', color: '#713f12', border: '1px solid #eab308',
                fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)'
              }}>
                <Zap size={16} fill="#ca8a04" color="#854d0e" strokeWidth={2.2} /> 1-Click Demo Customer Sign In
              </button>
            </div>

            <div style={{ marginTop: 'var(--space-5)' }}>
              <Link href="/cart" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <ArrowLeft size={15} /> Return to Cart
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please login first to place your order', 'error');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      showToast('Please fill in your name, phone number, and delivery address', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: items.map(i => ({
          product: i.product._id,
          quantity: i.quantity,
          price: i.product.sellingPrice,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: `${formData.address}${formData.landmark ? ', Near ' + formData.landmark : ''}`,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        couponCode: coupon?.code,
        discountAmount,
        subtotal,
        deliveryCharge,
        grandTotal,
        notes: formData.orderNotes,
      };

      let orderId = `RC-${Date.now().toString().slice(-6)}`;
      try {
        const res = await api.createOrder(orderPayload);
        if (res && res.order) {
          orderId = res.order.orderId || res.order._id || orderId;
        }
      } catch (err) {
        console.error('API order submit error:', err);
        throw err;
      }

      const savedOrder = {
        orderId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: items.map(i => ({
          name: i.product.name,
          brand: i.product.brand,
          qty: i.quantity,
          price: i.product.sellingPrice,
          image: i.product.thumbnail?.url || i.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200',
        })),
        total: grandTotal,
        paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI / Online Payment',
        shippingAddress: orderPayload.shippingAddress,
      };
      localStorage.setItem('rc_latest_order', JSON.stringify(savedOrder));

      clearCart();
      showToast('🎉 Order placed successfully!');
      router.push(`/order-success?orderId=${orderId}`);
    } catch (error) {
      showToast(error.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="page-content">
        <div style={{ background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-6) 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-primary)', margin: 0 }}>
              Checkout &amp; Delivery Details
            </h1>
            {user && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                background: 'var(--color-info-light)', padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe',
                fontSize: 'var(--font-size-xs)', color: 'var(--accent)'
              }}>
                <span>👤</span>
                <span>Ordering as <strong>{user.name}</strong> ({user.email})</span>
              </div>
            )}
          </div>
        </div>

        <div className="container page-content-inner">
          <form onSubmit={handleSubmitOrder}>
            <div className="two-col-grid">
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Contact & Address */}
                <div className="content-card">
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
                    📍 1. Delivery Information
                  </h3>

                  <div className="inline-form">
                    <div className="inline-form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="e.g. Rahul Sharma" className="form-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number (WhatsApp) *</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="e.g. 9820123456" className="form-input" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address (for order tracking &amp; bill)</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. rahul@example.com" className="form-input" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Flat / House No., Building Name, Street / Sector *</label>
                      <textarea name="address" required rows={3} value={formData.address} onChange={handleChange} placeholder="e.g. Flat 402, Sea Breeze Heights, Sector 15" className="form-input" />
                    </div>

                    <div className="inline-form-row-3">
                      <div className="form-group">
                        <label className="form-label">City / Area</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} className="form-input" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Delivery Instructions / Landmark (Optional)</label>
                      <input type="text" name="orderNotes" value={formData.orderNotes} onChange={handleChange} placeholder="e.g. Near D-Mart Kharghar, Call before reaching" className="form-input" />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="content-card">
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
                    💳 2. Payment Method
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                      padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                      border: formData.paymentMethod === 'cod' ? '2px solid var(--color-primary-light)' : '1px solid var(--color-border)',
                      background: formData.paymentMethod === 'cod' ? 'var(--color-info-light)' : 'var(--color-bg-card)',
                      cursor: 'pointer'
                    }}>
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-light)' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: 'var(--font-size-base)' }}>
                          💵 Cash on Delivery (COD) / Pay on Delivery
                        </strong>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          Pay with cash or UPI QR scanner when the technician/courier delivers your order.
                        </span>
                      </div>
                    </label>

                    <label style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                      padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                      border: formData.paymentMethod === 'upi' ? '2px solid var(--color-primary-light)' : '1px solid var(--color-border)',
                      background: formData.paymentMethod === 'upi' ? 'var(--color-info-light)' : 'var(--color-bg-card)',
                      cursor: 'pointer'
                    }}>
                      <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-light)' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: 'var(--font-size-base)' }}>
                          📱 UPI / QR Code / Net Banking
                        </strong>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          Instant payment confirmation via Google Pay, PhonePe, Paytm, or Credit/Debit card.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div>
                <div className="content-card" style={{ position: 'sticky', top: '90px' }}>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
                    Order Summary ({itemCount} items)
                  </h3>

                  {/* Items Mini List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', maxHeight: '240px', overflowY: 'auto' }}>
                    {items.map(item => (
                      <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{item.quantity}x</span>
                          <span style={{ color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                            {item.product.name}
                          </span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          ₹{(item.product.sellingPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Cost Calculation */}
                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div className="order-summary-row">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="order-summary-row" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                        <span>Coupon Discount ({coupon?.code})</span>
                        <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="order-summary-row">
                      <span>Doorstep Delivery (Kharghar)</span>
                      <span style={{ color: deliveryCharge === 0 ? 'var(--color-success)' : 'var(--color-text)', fontWeight: 600 }}>
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>

                    <div className="order-summary-total">
                      <span>Total Amount</span>
                      <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} className="btn btn-lg" style={{
                    width: '100%', marginTop: 'var(--space-6)',
                    background: submitting ? 'var(--color-text-muted)' : 'var(--color-success)',
                    color: 'var(--color-white)', cursor: submitting ? 'not-allowed' : 'pointer'
                  }}>
                    {submitting ? 'Placing Your Order...' : `✓ Place Order (₹${grandTotal.toLocaleString('en-IN')})`}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
                    By placing your order, you agree to Riddhi Computer terms of service and warranty policy.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
