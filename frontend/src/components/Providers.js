'use client';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { CartProvider } from '../context/CartContext';
import WhatsAppButton from './WhatsAppButton';

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <WhatsAppButton />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
