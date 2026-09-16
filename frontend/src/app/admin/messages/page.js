'use client';
import { useState } from 'react';
import { MessageSquare, Phone, Inbox } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f2744' }}>Customer Inquiries & Messages</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Direct messages received from the storefront contact form.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length > 0 ? (
          messages.map(m => (
            <div key={m.id} style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#0f2744' }}>{m.name}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '12px' }}>{m.email} • {m.phone}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{m.date}</span>
              </div>

              <p style={{ fontWeight: 700, color: '#1a56db', marginBottom: '8px', fontSize: '0.95rem' }}>Subject: {m.subject}</p>
              <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.5, background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                &quot;{m.message}&quot;
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`https://wa.me/91${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${m.name}, this is Riddhi Computer responding to your inquiry regarding: ${m.subject}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    background: '#25D366',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageSquare size={15} /> Reply on WhatsApp
                </a>
                <a
                  href={`tel:${m.phone}`}
                  style={{
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    color: '#0f2744',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    border: '1px solid #cbd5e1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Phone size={15} /> Call Customer
                </a>
              </div>
            </div>
          ))
        ) : (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <Inbox size={40} color="#cbd5e1" style={{ margin: '0 auto 14px', display: 'block' }} />
            <strong style={{ fontSize: '1.1rem', color: '#0f2744', display: 'block' }}>No Inquiries Yet</strong>
            <p style={{ fontSize: '0.88rem', margin: '6px auto 0', maxWidth: '400px', color: '#64748b' }}>
              When customers send inquiries from your contact page, they will appear here with one-click WhatsApp reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
