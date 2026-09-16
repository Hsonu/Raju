'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { FileText, CircleCheckBig, Package, Bike, PartyPopper, ClipboardList, Microscope, Zap, Sparkles, Wrench, MessageCircle, CheckCircle2 } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || '';

  // Auto-detect type if ID is passed in URL
  const initialType = queryId.toUpperCase().startsWith('RPR') || queryId.toUpperCase().startsWith('REP') ? 'repair' : 'order';
  const [trackType, setTrackType] = useState(initialType);
  const [trackingId, setTrackingId] = useState(queryId);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const orderSteps = [
    { title: 'Order Placed', desc: 'Received & logged in system', icon: <FileText size={18} /> },
    { title: 'Confirmed', desc: 'Inventory verified by Kharghar store', icon: <CircleCheckBig size={18} /> },
    { title: 'Packed & Dispatched', desc: 'Quality checked and packed with warranty seal', icon: <Package size={18} /> },
    { title: 'Out for Delivery', desc: 'Technician/courier en route to your address', icon: <Bike size={18} /> },
    { title: 'Delivered', desc: 'Successfully handed over to customer', icon: <PartyPopper size={18} /> },
  ];

  const repairSteps = [
    { title: 'Request Submitted', desc: 'Booking logged with device details', icon: <ClipboardList size={18} /> },
    { title: 'Diagnostic & Inspection', desc: 'Hardware diagnosis by certified engineer', icon: <Microscope size={18} /> },
    { title: 'Repair in Progress', desc: 'Micro-soldering / parts replacement underway', icon: <Zap size={18} /> },
    { title: 'Quality Testing & Cleaning', desc: 'Thermal test, benchmark and deep clean', icon: <Sparkles size={18} /> },
    { title: 'Ready for Pickup / Delivered', desc: 'Ready with 3-12 months service warranty', icon: <PartyPopper size={18} /> },
  ];

  useEffect(() => {
    if (queryId) {
      const isRepair = queryId.toUpperCase().startsWith('RPR') || queryId.toUpperCase().startsWith('REP');
      setTrackType(isRepair ? 'repair' : 'order');
      setTrackingId(queryId);
      handleTrack(queryId, isRepair ? 'repair' : 'order');
    }
  }, [queryId]);

  const handleTrack = async (idToTrack, explicitType) => {
    const rawId = (idToTrack !== undefined ? idToTrack : trackingId).trim();
    if (!rawId) return;

    // Detect type from ID pattern if not explicit
    let type = explicitType || trackType;
    if (rawId.toUpperCase().startsWith('RPR') || rawId.toUpperCase().startsWith('REP')) {
      type = 'repair';
      setTrackType('repair');
    } else if (rawId.toUpperCase().startsWith('RC') || rawId.toUpperCase().startsWith('ORD')) {
      type = 'order';
      setTrackType('order');
    }

    setLoading(true);
    setSearched(true);
    setNotFound(false);
    setTrackingData(null);

    try {
      if (type === 'repair') {
        // Try repair first, fallback to order
        let res = await api.trackRepair(rawId).catch(() => null);
        if (!res?.repair) {
          const altRes = await api.trackOrder(rawId).catch(() => null);
          if (altRes?.order) {
            type = 'order';
            setTrackType('order');
            res = altRes;
          }
        }

        if (res && res.repair) {
          const r = res.repair;
          const statusMap = {
            'request_received': 0,
            'under_review': 1,
            'technician_assigned': 1,
            'device_received': 1,
            'diagnosis': 1,
            'estimate_sent': 1,
            'repair_in_progress': 2,
            'ready_for_delivery': 3,
            'completed': 4,
            'delivered': 4,
            'cancelled': 0
          };
          const stepIndex = statusMap[r.status] !== undefined ? statusMap[r.status] : 1;

          setTrackingData({
            type: 'repair',
            id: r.requestId || rawId,
            currentStep: stepIndex,
            statusText: r.status?.replace(/_/g, ' ') || 'Request Received',
            customerName: r.customerName || 'Customer',
            date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            device: `${r.brand || ''} ${r.model || ''}`.trim() || r.deviceType || 'Device',
            problem: r.problem || 'Hardware diagnosis',
            service: r.serviceRequired?.replace(/_/g, ' ') || 'Repair',
            homeVisit: r.homeVisit,
            address: r.address,
            history: r.statusHistory || [],
            details: r,
          });
        } else {
          setNotFound(true);
        }
      } else {
        // Try order first, fallback to repair
        let res = await api.trackOrder(rawId).catch(() => null);
        if (!res?.order) {
          const altRes = await api.trackRepair(rawId).catch(() => null);
          if (altRes?.repair) {
            type = 'repair';
            setTrackType('repair');
            res = altRes;
          }
        }

        if (res && res.order) {
          const o = res.order;
          const statusMap = {
            'placed': 0,
            'confirmed': 1,
            'packed': 2,
            'shipped': 2,
            'in_transit': 2,
            'out_for_delivery': 3,
            'delivered': 4,
            'cancelled': 0
          };
          const stepIndex = statusMap[o.status] !== undefined ? statusMap[o.status] : 1;

          setTrackingData({
            type: 'order',
            id: o.orderId || o._id || rawId,
            currentStep: stepIndex,
            statusText: o.status || 'Placed',
            customerName: o.shippingAddress?.fullName || 'Customer',
            date: new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            items: o.items || [],
            total: o.total,
            shippingAddress: o.shippingAddress,
            history: o.statusHistory || [],
            details: o,
          });
        } else if (res && res.repair) {
          // If repair matched fallback
          const r = res.repair;
          setTrackingData({
            type: 'repair',
            id: r.requestId || rawId,
            currentStep: 1,
            statusText: r.status?.replace(/_/g, ' ') || 'Received',
            customerName: r.customerName || 'Customer',
            date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            device: `${r.brand || ''} ${r.model || ''}`.trim() || 'Device',
            problem: r.problem,
            service: r.serviceRequired?.replace(/_/g, ' ') || 'Repair',
            details: r,
          });
        } else {
          setNotFound(true);
        }
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const steps = trackingData?.type === 'repair' ? repairSteps : orderSteps;
  const currentStep = trackingData?.currentStep ?? 1;

  return (
    <div className="container" style={{ maxWidth: '840px', margin: '40px auto 80px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--ink)', marginBottom: '8px' }}>
          Live Status Tracker
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '1rem' }}>
          Track the real-time progress of your laptop purchase order or repair service.
        </p>
      </div>

      {/* Tracker Card */}
      <div style={{
        background: 'var(--paper)',
        borderRadius: '20px',
        padding: '36px 32px',
        boxShadow: '0 8px 30px rgba(15, 39, 68, 0.08)',
        border: '1px solid var(--rule-faint)'
      }}>
        {/* Toggle Order / Repair */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
          <button
            onClick={() => { setTrackType('order'); setTrackingData(null); setSearched(false); }}
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              border: 'none',
              background: trackType === 'order' ? 'var(--accent)' : 'var(--paper-alt)',
              color: trackType === 'order' ? 'var(--paper)' : 'var(--ink-light)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <Package size={16} style={{marginRight: '6px', verticalAlign: 'middle'}} /> Product Orders
          </button>
          <button
            onClick={() => { setTrackType('repair'); setTrackingData(null); setSearched(false); }}
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              border: 'none',
              background: trackType === 'repair' ? 'var(--accent)' : 'var(--paper-alt)',
              color: trackType === 'repair' ? 'var(--paper)' : 'var(--ink-light)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <Wrench size={16} style={{marginRight: '6px', verticalAlign: 'middle'}} /> Laptop Repair Status
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleTrack(); }}
          style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}
        >
          <input
            type="text"
            placeholder={trackType === 'order' ? 'Enter Order ID (e.g. RC-948201)' : 'Enter Repair ID (e.g. REP-1002)'}
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '10px',
              border: '1px solid var(--rule)',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 28px',
              background: 'var(--ink)',
              color: 'var(--paper)',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Track Now →'}
          </button>
        </form>

        {/* Not Found Message */}
        {notFound && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            color: '#991b1b'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>No Tracking Record Found</h4>
            <p style={{ fontSize: '0.9rem', color: '#7f1d1d', margin: 0 }}>
              We could not find any active order or repair request matching reference <strong>"{trackingId}"</strong>.
              Please verify your ID or check your <Link href="/account" style={{ color: 'var(--accent)', fontWeight: 700 }}>Account History</Link>.
            </p>
          </div>
        )}

        {/* Live Stepper Visualization */}
        {trackingData && (
          <div>
            <div style={{
              background: 'var(--paper-alt)',
              borderRadius: '12px',
              padding: '18px 22px',
              border: '1px solid var(--rule-faint)',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {trackingData.type === 'repair' ? 'Repair Ticket ID' : 'Order Reference'}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)', margin: '2px 0 0' }}>{trackingData.id}</h3>
              </div>
              <div>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: '#d1fae5',
                  color: '#065f46',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'capitalize'
                }}>
                  ● {trackingData.statusText}
                </span>
              </div>
            </div>

            {/* Summary Details Card */}
            <div style={{
              background: 'var(--paper)',
              border: '1px solid var(--rule-faint)',
              borderRadius: '12px',
              padding: '18px 22px',
              marginBottom: '32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {trackingData.type === 'repair' ? '🛠️ Repair Booking Information' : '📦 Order & Delivery Information'}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Customer</span>
                  <strong style={{ color: 'var(--ink)' }}>{trackingData.customerName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Date Registered</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{trackingData.date}</span>
                </div>
                {trackingData.type === 'repair' ? (
                  <>
                    <div>
                      <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Device Model</span>
                      <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{trackingData.device}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Service Type</span>
                      <span style={{ color: 'var(--ink)', fontWeight: 600, textTransform: 'capitalize' }}>{trackingData.service}</span>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Problem Reported</span>
                      <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{trackingData.problem}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Order Total</span>
                      <strong style={{ color: '#16a34a' }}>₹{trackingData.total?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Items</span>
                      <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
                        {trackingData.items?.length > 0 ? trackingData.items.map(i => `${i.name} (${i.quantity}x)`).join(', ') : '1 item'}
                      </span>
                    </div>
                    {trackingData.shippingAddress && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ color: 'var(--ink-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Delivery Address</span>
                        <span style={{ color: 'var(--ink)', fontWeight: 500 }}>
                          {trackingData.shippingAddress.address}, {trackingData.shippingAddress.city} - {trackingData.shippingAddress.pincode}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Stepper Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '16px' }}>
              {/* Connecting vertical line */}
              <div style={{
                position: 'absolute',
                top: '20px',
                bottom: '20px',
                left: '36px',
                width: '3px',
                background: 'var(--rule-faint)',
                zIndex: 1
              }} />

              {steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;
                const isPending = idx > currentStep;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'flex-start',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    {/* Circle */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: isCompleted ? 'var(--success)' : isCurrent ? 'var(--accent)' : 'var(--paper)',
                      color: isCompleted || isCurrent ? 'var(--paper)' : 'var(--ink-muted)',
                      border: isPending ? '2px solid var(--rule)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      boxShadow: isCurrent ? '0 0 0 4px rgba(26, 86, 219, 0.2)' : 'none'
                    }}>
                      {isCompleted ? <CheckCircle2 size={20} /> : step.icon}
                    </div>

                    {/* Step info */}
                    <div style={{
                      background: isCurrent ? '#eff6ff' : 'transparent',
                      padding: isCurrent ? '12px 18px' : '6px 0',
                      borderRadius: '10px',
                      border: isCurrent ? '1px solid #bfdbfe' : 'none',
                      flex: 1
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: isCurrent ? 'var(--accent)' : isCompleted ? 'var(--ink)' : 'var(--ink-muted)'
                        }}>
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', background: '#dbeafe', padding: '2px 8px', borderRadius: '4px' }}>
                            CURRENT STATUS
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: isCurrent ? 'var(--accent)' : 'var(--ink-muted)', marginTop: '2px' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Assistance Footer */}
            <div style={{
              marginTop: '40px',
              padding: '20px',
              background: 'var(--paper-alt)',
              borderRadius: '12px',
              border: '1px solid var(--rule-faint)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--ink)' }}>Need faster update?</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>Our technician desk at Kharghar is available 10 AM to 9 PM.</span>
              </div>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Riddhi Computer! I am tracking ticket ${trackingData.id}. Any update?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px',
                  background: '#25D366',
                  color: 'var(--paper)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <MessageCircle size={16} /> Ask on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: 'var(--paper-alt)', minHeight: '80vh', padding: '20px 0' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Loading tracker...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
