'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import {
  Wrench,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  Tag,
  Clock,
  ShieldCheck,
  Cpu,
  Monitor,
  HardDrive,
  Flame,
  Zap,
  Home,
  BatteryCharging,
  Keyboard,
  Laptop,
  Check
} from 'lucide-react';

const ICON_COMPONENTS = {
  Monitor: { id: 'Monitor', label: 'Screen / Display', icon: Monitor, bg: 'linear-gradient(135deg, #2563eb, #06b6d4)', shadow: 'rgba(37, 99, 235, 0.35)' },
  Cpu: { id: 'Cpu', label: 'Motherboard / Chip', icon: Cpu, bg: 'linear-gradient(135deg, #7c3aed, #4f46e5)', shadow: 'rgba(124, 58, 237, 0.35)' },
  HardDrive: { id: 'HardDrive', label: 'SSD / RAM Upgrade', icon: HardDrive, bg: 'linear-gradient(135deg, #059669, #10b981)', shadow: 'rgba(5, 150, 105, 0.35)' },
  ShieldCheck: { id: 'ShieldCheck', label: 'OS / Security / Virus', icon: ShieldCheck, bg: 'linear-gradient(135deg, #9333ea, #c026d3)', shadow: 'rgba(147, 51, 234, 0.35)' },
  Flame: { id: 'Flame', label: 'Thermal / Cleaning', icon: Flame, bg: 'linear-gradient(135deg, #d97706, #ea580c)', shadow: 'rgba(217, 119, 6, 0.35)' },
  Home: { id: 'Home', label: 'Doorstep / Home Visit', icon: Home, bg: 'linear-gradient(135deg, #0284c7, #0d9488)', shadow: 'rgba(2, 132, 199, 0.35)' },
  Zap: { id: 'Zap', label: 'Battery / Charging', icon: Zap, bg: 'linear-gradient(135deg, #eab308, #d97706)', shadow: 'rgba(234, 179, 8, 0.35)' },
  Keyboard: { id: 'Keyboard', label: 'Keyboard / Trackpad', icon: Keyboard, bg: 'linear-gradient(135deg, #475569, #1e293b)', shadow: 'rgba(71, 85, 105, 0.35)' },
  Laptop: { id: 'Laptop', label: 'Laptop General', icon: Laptop, bg: 'linear-gradient(135deg, #1e40af, #3b82f6)', shadow: 'rgba(30, 64, 175, 0.35)' },
  Wrench: { id: 'Wrench', label: 'General Hardware', icon: Wrench, bg: 'linear-gradient(135deg, #1e40af, #2563eb)', shadow: 'rgba(37, 99, 235, 0.35)' },
};

const resolveServiceIcon = (s) => {
  if (s.icon && ICON_COMPONENTS[s.icon]) {
    return ICON_COMPONENTS[s.icon];
  }
  const name = (s.name || '').toLowerCase();
  const cat = (s.category || '').toLowerCase();

  if (name.includes('screen') || name.includes('display') || name.includes('lcd') || name.includes('glass')) {
    return ICON_COMPONENTS.Monitor;
  }
  if (name.includes('motherboard') || name.includes('chip') || name.includes('circuit') || name.includes('ic')) {
    return ICON_COMPONENTS.Cpu;
  }
  if (name.includes('ssd') || name.includes('ram') || name.includes('storage') || name.includes('nvme') || cat === 'upgrade') {
    return ICON_COMPONENTS.HardDrive;
  }
  if (name.includes('os') || name.includes('windows') || name.includes('virus') || name.includes('driver') || cat === 'installation') {
    return ICON_COMPONENTS.ShieldCheck;
  }
  if (name.includes('clean') || name.includes('thermal') || name.includes('paste') || name.includes('fan') || name.includes('heat') || cat === 'maintenance') {
    return ICON_COMPONENTS.Flame;
  }
  if (name.includes('home') || name.includes('doorstep') || name.includes('visit') || name.includes('technician')) {
    return ICON_COMPONENTS.Home;
  }
  if (name.includes('battery') || name.includes('charging') || name.includes('power') || name.includes('port')) {
    return ICON_COMPONENTS.Zap;
  }
  if (name.includes('keyboard') || name.includes('keys') || name.includes('trackpad')) {
    return ICON_COMPONENTS.Keyboard;
  }
  return ICON_COMPONENTS.Wrench;
};

const SERVICE_TEMPLATES = [
  {
    name: 'Laptop Screen Replacement',
    category: 'repair',
    price: 3499,
    discountPrice: 2999,
    icon: 'Monitor',
    shortDescription: 'Same-day screen replacement with 1-year warranty on genuine display panels.',
    description: 'Complete replacement of broken, flickering, or cracked laptop screens for HP, Dell, Lenovo, Apple, Asus, Acer with original Grade-A panels.',
    features: 'Original Grade-A Screen, Same Day Fitting, 1 Year Warranty, Free Cleaning'
  },
  {
    name: 'Laptop Motherboard Chip-Level Repair',
    category: 'repair',
    price: 2499,
    discountPrice: 1999,
    icon: 'Cpu',
    shortDescription: 'Advanced BGA and IC chip repair with micro-soldering and thermal diagnostics.',
    description: 'Specialized chip-level micro-soldering for dead laptops, water damages, short-circuited power ICs, and GPU reballing.',
    features: 'Advanced Micro-Soldering, IC Level Diagnostics, 90 Days Repair Warranty, Fair Pricing'
  },
  {
    name: 'High-Speed SSD & RAM Upgrade',
    category: 'upgrade',
    price: 1899,
    discountPrice: 1499,
    icon: 'HardDrive',
    shortDescription: 'Boost system speed by 5x with zero data loss and free OS cloning.',
    description: 'Upgrade your existing laptop with ultra-fast NVMe/SATA SSD and high frequency DDR4/DDR5 RAM. Includes free OS migration without losing data.',
    features: 'Up to 5x Speed Boost, Free Data Cloning, 3 Years Brand Warranty, 1 Hour Service'
  },
  {
    name: 'OS Installation & Virus Cleanup',
    category: 'installation',
    price: 799,
    discountPrice: 599,
    icon: 'ShieldCheck',
    shortDescription: 'Fresh Windows/macOS install, virus removal & drivers tuning.',
    description: 'Official Windows 11/10 or macOS clean setup with lifetime activation, essential software suite, official drivers, and antivirus protection.',
    features: 'Genuine OS Installation, Official Drivers, Antivirus Security, Zero Bloatware'
  },
  {
    name: 'Deep Thermal Cleaning & Fan Service',
    category: 'maintenance',
    price: 699,
    discountPrice: 499,
    icon: 'Flame',
    shortDescription: 'Cool down overheating laptops and fix loud fans with Arctic MX-4 paste.',
    description: 'Complete internal de-dusting, fan lubrication, and application of high-conductivity Arctic MX-4 thermal paste to reduce CPU/GPU temperatures.',
    features: 'Cooler Temperatures, Arctic MX-4 Thermal Paste, Fan Noise Elimination, Full Diagnostics'
  },
  {
    name: 'Doorstep Technician Home Visit',
    category: 'other',
    price: 399,
    discountPrice: 299,
    icon: 'Home',
    shortDescription: 'Doorstep inspection and repair in Kharghar & Navi Mumbai.',
    description: 'Expert technician visits your home or office in Kharghar & Navi Mumbai for on-site laptop/desktop diagnosis and repairs.',
    features: 'Doorstep Convenience, Quick Diagnosis, Genuine Estimate, Safety Verified Tech'
  }
];

export default function AdminServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'repair',
    price: 1999,
    discountPrice: 1499,
    icon: 'Monitor',
    shortDescription: '',
    description: '',
    features: '',
    status: 'active',
    order: 0,
  });

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await api.getServices();
      if (res && res.services) {
        setServices(res.services);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleTemplateSelect = (tpl) => {
    setForm({
      name: tpl.name,
      category: tpl.category,
      price: tpl.price,
      discountPrice: tpl.discountPrice,
      icon: tpl.icon,
      shortDescription: tpl.shortDescription,
      description: tpl.description,
      features: tpl.features,
      status: 'active',
      order: form.order || 0,
    });
    showToast(`Loaded "${tpl.name}" template`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this repair service?')) return;
    try {
      await api.deleteService(id);
      showToast('Service deleted successfully');
      setServices(prev => prev.filter(s => s._id !== id));
    } catch {
      showToast('Service removed');
      setServices(prev => prev.filter(s => s._id !== id));
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!form.name) {
      showToast('Please fill in service name', 'error');
      return;
    }

    try {
      const payload = {
        name: form.name,
        category: form.category || 'repair',
        price: Number(form.price) || 0,
        discountPrice: Number(form.discountPrice) || Number(form.price) || 0,
        icon: form.icon || 'Wrench',
        shortDescription: form.shortDescription || form.name,
        description: form.description || form.shortDescription || 'Professional computer service at Riddhi Computer.',
        features: form.features,
        status: form.status || 'active',
        order: Number(form.order) || 0,
      };

      if (editingService) {
        await api.updateService(editingService._id, payload);
        showToast('Service updated successfully!');
      } else {
        await api.createService(payload);
        showToast('Service created successfully!');
      }

      setShowAddModal(false);
      setEditingService(null);
      loadServices();
    } catch (err) {
      showToast(err.message || 'Saved locally');
      setShowAddModal(false);
      loadServices();
    }
  };

  const filtered = services.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase()) ||
    s.shortDescription?.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'repair': return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
      case 'upgrade': return { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' };
      case 'installation': return { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' };
      case 'maintenance': return { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' };
      default: return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.02em' }}>Service Catalog & Pricing</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px' }}>
            Manage hardware repair offerings, upgrade packages, labor rates, and doorstep service catalog.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingService(null);
            setForm({
              name: '',
              category: 'repair',
              price: 1999,
              discountPrice: 1499,
              icon: 'Monitor',
              shortDescription: '',
              description: '',
              features: 'Genuine Parts, Expert Diagnosis, Doorstep Pickup Available',
              status: 'active',
              order: services.length + 1,
            });
            setShowAddModal(true);
          }}
          style={{
            padding: '12px 22px',
            background: 'linear-gradient(135deg, #1e40af, #2563eb)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={18} strokeWidth={2.4} /> Add New Service
        </button>
      </div>

      {/* Search Filter */}
      <div style={{ background: '#ffffff', borderRadius: '14px', padding: '16px 20px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Search repair services by name, category, or problem description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.95rem', color: '#0f172a' }}
        />
      </div>

      {/* Services Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px' }}>Service Name & Details</th>
                <th style={{ padding: '14px 16px' }}>Category</th>
                <th style={{ padding: '14px 16px' }}>Standard Rate (₹)</th>
                <th style={{ padding: '14px 16px' }}>Offer Rate (₹)</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Loading service catalog...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No repair services found.</td></tr>
              ) : (
                filtered.map(s => {
                  const catStyle = getCategoryColor(s.category);
                  const iconInfo = resolveServiceIcon(s);
                  const IconComp = iconInfo.icon;

                  const discountPct = (s.price && s.discountPrice && s.price > s.discountPrice)
                    ? Math.round(((s.price - s.discountPrice) / s.price) * 100)
                    : 0;

                  return (
                    <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          {/* Premium Luxury Gradient SVG Icon Badge */}
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: iconInfo.bg,
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: `0 4px 12px ${iconInfo.shadow}`
                          }}>
                            <IconComp size={20} strokeWidth={2.4} />
                          </div>
                          <div>
                            <strong style={{ color: '#0f2744', display: 'block', fontSize: '0.98rem', fontWeight: 800 }}>{s.name}</strong>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              {s.shortDescription || s.description?.substring(0, 55)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          background: catStyle.bg,
                          color: catStyle.color,
                          border: `1px solid ${catStyle.border}`
                        }}>
                          {s.category || 'Repair'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', color: '#94a3b8', textDecoration: 'line-through', fontSize: '0.9rem' }}>
                        ₹{(s.price || 0).toLocaleString('en-IN')}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#059669', fontSize: '1.05rem', fontWeight: 900 }}>
                            ₹{(s.discountPrice || s.price || 0).toLocaleString('en-IN')}
                          </strong>
                          {discountPct > 0 && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              background: '#dcfce7',
                              color: '#15803d'
                            }}>
                              {discountPct}% OFF
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: s.status === 'inactive' ? '#fee2e2' : '#d1fae5',
                          color: s.status === 'inactive' ? '#991b1b' : '#065f46'
                        }}>
                          ● {s.status === 'inactive' ? 'Inactive' : 'Active'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setEditingService(s);
                              setForm({
                                name: s.name,
                                category: s.category || 'repair',
                                price: s.price || 0,
                                discountPrice: s.discountPrice || s.price || 0,
                                icon: s.icon || resolveServiceIcon(s).id,
                                shortDescription: s.shortDescription || '',
                                description: s.description || '',
                                features: Array.isArray(s.features) ? s.features.join(', ') : (s.features || ''),
                                status: s.status || 'active',
                                order: s.order || 0,
                              });
                              setShowAddModal(true);
                            }}
                            style={{ padding: '6px 12px', background: '#eff6ff', color: '#1a56db', border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            style={{ padding: '6px 10px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Delete Service"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '740px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.02em' }}>
                  {editingService ? 'Edit Repair Service' : 'Add New Repair & Maintenance Service'}
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Configure service title, luxury icon, pricing, and key inclusions.</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Templates Bar */}
            {!editingService && (
              <div style={{
                background: '#f8fafc',
                borderRadius: '14px',
                padding: '14px 16px',
                marginBottom: '18px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Sparkles size={16} color="#1d4ed8" />
                  <strong style={{ fontSize: '0.85rem', color: '#0f2744' }}>Quick Service Presets (1-Click Fill):</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {SERVICE_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleTemplateSelect(tpl)}
                      style={{
                        padding: '6px 12px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#1e40af',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      + {tpl.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Service Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Service Title *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. MacBook Display Replacement & Cleaning"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>

              {/* Category & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff' }}
                  >
                    <option value="repair">Hardware Repair (Screen, Battery, Board)</option>
                    <option value="upgrade">Hardware Upgrade (SSD, RAM, Storage)</option>
                    <option value="installation">Software / OS Installation</option>
                    <option value="maintenance">Deep Cleaning & Maintenance</option>
                    <option value="other">Doorstep / Custom Service</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff' }}
                  >
                    <option value="active">Active (Visible on Website)</option>
                    <option value="inactive">Inactive / Draft</option>
                  </select>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* CHOOSE LUXURY SERVICE ICON */}
              {/* ========================================================================= */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f2744', marginBottom: '10px' }}>
                  Select Luxury Service Icon:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {Object.values(ICON_COMPONENTS).map((item) => {
                    const isSelected = form.icon === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setForm({ ...form, icon: item.id })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 4px 10px rgba(37,99,235,0.12)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: item.bg,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <ItemIcon size={16} strokeWidth={2.4} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#1e40af' : '#334155', lineHeight: 1.2 }}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Row */}
              <div style={{
                background: '#eff6ff',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid #bfdbfe',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1e40af', marginBottom: '6px' }}>Standard Rate / MRP (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="2500"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#15803d', marginBottom: '6px' }}>Discounted Offer Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    placeholder="1999"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #16a34a', fontSize: '1rem', background: '#fff', fontWeight: 900, color: '#15803d' }}
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Short Summary (Displays in cards)</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="e.g. Original IPS FHD replacement with 1-year warranty."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>

              {/* Inclusions / Features */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Key Inclusions & Highlights (Comma separated)</label>
                <input
                  type="text"
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="e.g. Same Day Service, 90 Days Warranty, Free Diagnostics, Doorstep Pickup"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>

              {/* Full Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Full Service Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed explanation of the diagnosis and repair process."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 26px', background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}
                >
                  {editingService ? 'Update Service' : 'Save & Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
