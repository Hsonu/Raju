'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import api from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { showToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('rc_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {
      setItems([]);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('rc_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    let isExisting = false;
    setItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        isExisting = true;
        const newQty = existing.quantity + quantity;
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });

    if (isExisting) {
      showToast(`Updated quantity of "${product.name}" in cart`);
    } else {
      showToast(`Added "${product.name}" to cart! 🛒`);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const item = items.find((i) => i.product._id === productId);
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
    if (item) {
      showToast(`Removed "${item.product.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setDiscountAmount(0);
  };

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      showToast('Please enter a coupon code', 'error');
      return false;
    }

    try {
      const subtotal = items.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
      const res = await api.validateCoupon(code.trim().toUpperCase(), subtotal);
      if (res && res.valid) {
        setCoupon({ code: code.trim().toUpperCase(), discount: res.discount, details: res.coupon });
        setDiscountAmount(res.discount);
        showToast(`🎉 Coupon "${code.toUpperCase()}" applied! Saved ₹${res.discount}`);
        return true;
      } else {
        showToast(res.message || 'Invalid coupon code', 'error');
        return false;
      }
    } catch (err) {
      // Fallback for local calculations if mock codes are used
      const codeUpper = code.trim().toUpperCase();
      const subtotal = items.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);

      if (codeUpper === 'WELCOME10') {
        const disc = Math.min(Math.round(subtotal * 0.1), 1000);
        setCoupon({ code: 'WELCOME10', discount: disc });
        setDiscountAmount(disc);
        showToast(`🎉 Coupon WELCOME10 applied! Saved ₹${disc}`);
        return true;
      } else if (codeUpper === 'REPAIR500' && subtotal >= 2000) {
        setCoupon({ code: 'REPAIR500', discount: 500 });
        setDiscountAmount(500);
        showToast(`🎉 Coupon REPAIR500 applied! Saved ₹500`);
        return true;
      } else if (codeUpper === 'FESTIVE20' && subtotal >= 5000) {
        const disc = Math.min(Math.round(subtotal * 0.2), 2500);
        setCoupon({ code: 'FESTIVE20', discount: disc });
        setDiscountAmount(disc);
        showToast(`🎉 Coupon FESTIVE20 applied! Saved ₹${disc}`);
        return true;
      }
      showToast(err.message || 'Invalid or expired coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
    showToast('Coupon removed', 'info');
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.sellingPrice || 0) * item.quantity, 0);
  const totalMRP = items.reduce((sum, item) => sum + (item.product.mrp || item.product.sellingPrice || 0) * item.quantity, 0);
  const savings = totalMRP - subtotal + discountAmount;
  const deliveryCharge = subtotal > 499 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        totalMRP,
        savings,
        deliveryCharge,
        grandTotal,
        coupon,
        discountAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
