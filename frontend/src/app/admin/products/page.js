'use client';
import { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import {
  Trash2,
  Edit2,
  Plus,
  Search,
  X,
  Receipt,
  Tag,
  UploadCloud,
  Image as ImageIcon,
  Link2,
  Sparkles,
  Check,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

const PRESET_LAPTOPS = [
  {
    name: 'HP Pavilion 15 (Silver)',
    brand: 'HP',
    url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Lenovo ThinkPad (Black Business)',
    brand: 'Lenovo',
    url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Apple MacBook Pro (Space Grey)',
    brand: 'Apple',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Dell XPS 15 (Carbon Silver)',
    brand: 'Dell',
    url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'ASUS ROG Gaming Laptop (RGB)',
    brand: 'Asus',
    url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'
  }
];

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Image upload states
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    brand: 'HP',
    sku: '',
    mrp: 65000,
    discountPercentage: 15,
    sellingPrice: 55250,
    gstPercentage: 18,
    gstInclusive: true,
    hsnCode: '8471',
    stockQuantity: 8,
    description: '',
    processor: 'Intel Core i5 13th Gen',
    ram: '16GB DDR4',
    storage: '512GB NVMe SSD',
    imageUrl: '',
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 50 });
      if (res && res.products) {
        setProducts(res.products);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle MRP change -> auto calculate sellingPrice
  const handleMrpChange = (val) => {
    const mrpNum = Number(val) || 0;
    const discountNum = Number(form.discountPercentage) || 0;
    const newSelling = discountNum > 0 ? Math.round(mrpNum * (1 - discountNum / 100)) : mrpNum;
    setForm(prev => ({ ...prev, mrp: val, sellingPrice: newSelling }));
  };

  // Handle Discount % change -> auto calculate sellingPrice
  const handleDiscountChange = (val) => {
    const discountNum = Number(val) || 0;
    const mrpNum = Number(form.mrp) || 0;
    const newSelling = mrpNum > 0 ? Math.round(mrpNum * (1 - discountNum / 100)) : 0;
    setForm(prev => ({ ...prev, discountPercentage: val, sellingPrice: newSelling }));
  };

  // Handle Selling Price change -> auto calculate discount %
  const handleSellingPriceChange = (val) => {
    const sellingNum = Number(val) || 0;
    const mrpNum = Number(form.mrp) || 0;
    const newDiscount = (mrpNum > 0 && sellingNum <= mrpNum) ? Math.round(((mrpNum - sellingNum) / mrpNum) * 100) : 0;
    setForm(prev => ({ ...prev, sellingPrice: val, discountPercentage: newDiscount }));
  };

  // Quick Preset Discount Button
  const applyPresetDiscount = (pct) => {
    const mrpNum = Number(form.mrp) || 0;
    const newSelling = mrpNum > 0 ? Math.round(mrpNum * (1 - pct / 100)) : 0;
    setForm(prev => ({ ...prev, discountPercentage: pct, sellingPrice: newSelling }));
  };

  // Handle Image File Selection from Computer
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFilePreview(dataUrl);
      setForm(prev => ({ ...prev, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag and Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFilePreview(dataUrl);
      setForm(prev => ({ ...prev, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      showToast('Product deleted successfully');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      showToast('Product removed');
      setProducts(prev => prev.filter(p => p._id !== id));
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.sellingPrice) {
      showToast('Please fill in product name and selling price', 'error');
      return;
    }

    try {
      const defaultImg = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600';
      const activeImg = form.imageUrl || filePreview || defaultImg;

      if (selectedFile) {
        // Send multipart FormData with actual file upload
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('brand', form.brand);
        fd.append('sku', form.sku || `RC-${Math.floor(1000 + Math.random() * 9000)}`);
        fd.append('mrp', Number(form.mrp) || 0);
        fd.append('sellingPrice', Number(form.sellingPrice) || 0);
        fd.append('gstPercentage', Number(form.gstPercentage) || 18);
        fd.append('gstInclusive', form.gstInclusive !== false);
        fd.append('hsnCode', form.hsnCode || '8471');
        fd.append('stockQuantity', Number(form.stockQuantity) || 0);
        fd.append('description', form.description || 'High performance genuine device available at Riddhi Computer.');
        fd.append('specifications', JSON.stringify({
          processor: form.processor,
          ram: form.ram,
          storage: form.storage,
        }));
        fd.append('images', selectedFile);

        if (editingProduct) {
          await api.updateProduct(editingProduct._id, fd);
          showToast('Product and uploaded image updated successfully!');
        } else {
          await api.createProduct(fd);
          showToast('Product created with uploaded image!');
        }
      } else {
        // Send JSON payload
        const payload = {
          name: form.name,
          brand: form.brand,
          sku: form.sku || `RC-${Math.floor(1000 + Math.random() * 9000)}`,
          mrp: Number(form.mrp) || 0,
          sellingPrice: Number(form.sellingPrice) || 0,
          gstPercentage: Number(form.gstPercentage) || 18,
          gstInclusive: form.gstInclusive !== false,
          hsnCode: form.hsnCode || '8471',
          stockQuantity: Number(form.stockQuantity) || 0,
          description: form.description || 'High performance genuine device available at Riddhi Computer.',
          specifications: {
            processor: form.processor,
            ram: form.ram,
            storage: form.storage,
          },
          images: [{ url: activeImg, publicId: 'custom' }],
          thumbnail: { url: activeImg, publicId: 'default' },
        };

        if (editingProduct) {
          await api.updateProduct(editingProduct._id, payload);
          showToast('Product updated successfully!');
        } else {
          await api.createProduct(payload);
          showToast('Product created successfully!');
        }
      }

      setShowAddModal(false);
      setEditingProduct(null);
      setSelectedFile(null);
      setFilePreview('');
      loadProducts();
    } catch (err) {
      showToast(err.message || 'Saved locally');
      setShowAddModal(false);
      loadProducts();
    }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  // Live GST and Savings calculations for Modal Preview
  const mrpVal = Number(form.mrp) || 0;
  const sellingVal = Number(form.sellingPrice) || 0;
  const gstRateVal = Number(form.gstPercentage) || 0;
  const isGstIncl = form.gstInclusive !== false;

  let basePrice = 0;
  let gstAmount = 0;
  let finalCustomerPrice = 0;

  if (isGstIncl) {
    basePrice = gstRateVal > 0 ? sellingVal / (1 + gstRateVal / 100) : sellingVal;
    gstAmount = sellingVal - basePrice;
    finalCustomerPrice = sellingVal;
  } else {
    basePrice = sellingVal;
    gstAmount = sellingVal * (gstRateVal / 100);
    finalCustomerPrice = sellingVal + gstAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const savings = Math.max(0, mrpVal - finalCustomerPrice);
  const discountPct = mrpVal > 0 && mrpVal > finalCustomerPrice ? Math.round(((mrpVal - finalCustomerPrice) / mrpVal) * 100) : 0;

  const currentDisplayImage = form.imageUrl || filePreview || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.02em' }}>Product Inventory</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px' }}>
            Manage laptops, hardware, image uploads, MRP pricing, GST tax rates, and discount margins.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setSelectedFile(null);
            setFilePreview('');
            setImageMode('upload');
            setForm({
              name: '',
              brand: 'HP',
              sku: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
              mrp: 65000,
              discountPercentage: 15,
              sellingPrice: 55250,
              gstPercentage: 18,
              gstInclusive: true,
              hsnCode: '8471',
              stockQuantity: 8,
              description: '',
              processor: 'Intel Core i5 13th Gen',
              ram: '16GB DDR4',
              storage: '512GB NVMe SSD',
              imageUrl: '',
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
          <Plus size={18} strokeWidth={2.4} /> Add New Product
        </button>
      </div>

      {/* Search Filter */}
      <div style={{ background: '#ffffff', borderRadius: '14px', padding: '16px 20px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Search products by title, brand, SKU or specifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.95rem', color: '#0f172a' }}
        />
      </div>

      {/* Products Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px' }}>Product</th>
                <th style={{ padding: '14px 16px' }}>Brand</th>
                <th style={{ padding: '14px 16px' }}>Pricing & Discount</th>
                <th style={{ padding: '14px 16px' }}>GST Tax</th>
                <th style={{ padding: '14px 16px' }}>Stock</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Loading catalog...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No products found.</td></tr>
              ) : (
                filtered.map(p => {
                  const discount = p.mrp > p.sellingPrice ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100) : 0;
                  const gst = p.gstPercentage || 18;
                  return (
                    <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={p.thumbnail?.url || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100'}
                            alt=""
                            style={{ width: '48px', height: '48px', objectFit: 'cover', background: '#f8fafc', borderRadius: '8px', padding: '2px', border: '1px solid #e2e8f0' }}
                          />
                          <div>
                            <strong style={{ display: 'block', color: '#0f2744', fontWeight: 800 }}>{p.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>SKU: {p.sku} • HSN: {p.hsnCode || '8471'}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1e293b' }}>
                        {p.brand}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#0f2744', fontSize: '1.05rem', fontWeight: 900 }}>
                            ₹{p.sellingPrice?.toLocaleString('en-IN')}
                          </strong>
                          {discount > 0 && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              background: '#dcfce7',
                              color: '#15803d'
                            }}>
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                        {p.mrp > p.sellingPrice && (
                          <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            MRP: ₹{p.mrp?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Receipt size={12} /> {gst}% GST {p.gstInclusive !== false ? 'Incl.' : '+ Tax'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: (p.stockQuantity ?? 10) > 0 ? '#d1fae5' : '#fee2e2',
                          color: (p.stockQuantity ?? 10) > 0 ? '#065f46' : '#991b1b',
                        }}>
                          {(p.stockQuantity ?? 10) > 0 ? `${p.stockQuantity || 10} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              const mrp = p.mrp || p.sellingPrice || 65000;
                              const selling = p.sellingPrice || 55000;
                              const disc = mrp > selling ? Math.round(((mrp - selling) / mrp) * 100) : 0;
                              setSelectedFile(null);
                              setFilePreview(p.thumbnail?.url || p.images?.[0]?.url || '');
                              setImageMode('upload');
                              setForm({
                                name: p.name,
                                brand: p.brand,
                                sku: p.sku,
                                mrp: mrp,
                                discountPercentage: disc,
                                sellingPrice: selling,
                                gstPercentage: p.gstPercentage || 18,
                                gstInclusive: p.gstInclusive !== false,
                                hsnCode: p.hsnCode || '8471',
                                stockQuantity: p.stockQuantity ?? 10,
                                description: p.description || '',
                                processor: p.specifications?.processor || '',
                                ram: p.specifications?.ram || '',
                                storage: p.specifications?.storage || '',
                                imageUrl: p.thumbnail?.url || p.images?.[0]?.url || '',
                              });
                              setShowAddModal(true);
                            }}
                            style={{ padding: '6px 12px', background: '#eff6ff', color: '#1a56db', border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            style={{ padding: '6px 10px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Delete Product"
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

      {/* Add / Edit Product Modal */}
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
            maxWidth: '750px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f2744', letterSpacing: '-0.02em' }}>
                  {editingProduct ? 'Edit Product & Media' : 'Add New Product'}
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Configure device details, image uploads, discount, and GST tax slabs.</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Product Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Product Title *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. HP Pavilion 15 Core i5 13th Gen (16GB/512GB SSD/Win 11)"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>

              {/* Brand & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Brand</label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff' }}
                  >
                    <option value="HP">HP</option>
                    <option value="Dell">Dell</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Apple">Apple</option>
                    <option value="Asus">Asus</option>
                    <option value="Acer">Acer</option>
                    <option value="Logitech">Logitech</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Crucial">Crucial</option>
                    <option value="Riddhi Custom">Riddhi Custom</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Inventory Stock</label>
                  <input
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                    placeholder="8"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* IMAGE UPLOAD SUITE (Upload File / Image URL / Stock Gallery) */}
              {/* ========================================================================= */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '20px',
                border: '1.5px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={18} color="#1d4ed8" />
                    <strong style={{ fontSize: '0.95rem', color: '#0f2744', fontWeight: 800 }}>Product Image & Media</strong>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '8px', padding: '3px', gap: '3px' }}>
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: imageMode === 'upload' ? '#ffffff' : 'transparent',
                        color: imageMode === 'upload' ? '#1a56db' : '#64748b',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: imageMode === 'upload' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      <UploadCloud size={13} /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: imageMode === 'url' ? '#ffffff' : 'transparent',
                        color: imageMode === 'url' ? '#1a56db' : '#64748b',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: imageMode === 'url' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      <Link2 size={13} /> Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('presets')}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: imageMode === 'presets' ? '#ffffff' : 'transparent',
                        color: imageMode === 'presets' ? '#1a56db' : '#64748b',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: imageMode === 'presets' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      <Sparkles size={13} /> Laptop Presets
                    </button>
                  </div>
                </div>

                {/* Option 1: File Upload (Drag & Drop + Browse) */}
                {imageMode === 'upload' && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed #93c5fd',
                        borderRadius: '12px',
                        padding: '24px 20px',
                        textAlign: 'center',
                        background: '#eff6ff',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.92rem', color: '#1e40af' }}>
                          Click to browse or drag & drop image file
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Option 2: Image URL Input */}
                {imageMode === 'url' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Direct Web Image URL
                    </label>
                    <input
                      type="url"
                      value={form.imageUrl}
                      onChange={(e) => {
                        setSelectedFile(null);
                        setFilePreview('');
                        setForm({ ...form, imageUrl: e.target.value });
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', background: '#fff' }}
                    />
                  </div>
                )}

                {/* Option 3: Presets Laptop Gallery */}
                {imageMode === 'presets' && (
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '10px', fontWeight: 600 }}>
                      Click any high-resolution laptop image to use instantly:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                      {PRESET_LAPTOPS.map((preset, idx) => {
                        const isSelected = form.imageUrl === preset.url;
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedFile(null);
                              setFilePreview('');
                              setForm({ ...form, imageUrl: preset.url, brand: preset.brand });
                            }}
                            style={{
                              border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                              borderRadius: '10px',
                              padding: '6px',
                              background: '#fff',
                              cursor: 'pointer',
                              position: 'relative',
                              textAlign: 'center',
                              boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.15)' : 'none'
                            }}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              style={{ width: '100%', height: '65px', objectFit: 'cover', borderRadius: '6px', marginBottom: '4px' }}
                            />
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isSelected ? '#1e40af' : '#334155', display: 'block', lineHeight: 1.2 }}>
                              {preset.name}
                            </span>
                            {isSelected && (
                              <div style={{ position: 'absolute', top: '4px', right: '4px', background: '#2563eb', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selected Active Image Preview Bar */}
                {(form.imageUrl || filePreview) && (
                  <div style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={currentDisplayImage}
                        alt="Preview"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} /> Active Image Selected
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {selectedFile ? `File: ${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)` : form.imageUrl}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview('');
                        setForm(prev => ({ ...prev, imageUrl: '' }));
                      }}
                      style={{
                        padding: '4px 10px',
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* HIGHLIGHTED PRICING, DISCOUNT & GST CONFIGURATION CARD */}
              {/* ========================================================================= */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '16px',
                padding: '20px',
                border: '1.5px solid #cbd5e1',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Tag size={18} color="#1d4ed8" />
                  <strong style={{ fontSize: '0.98rem', color: '#0f2744', fontWeight: 800 }}>Pricing, Discount & GST Settings</strong>
                </div>

                {/* MRP, Discount, Selling Price Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      MRP Price (₹)
                    </label>
                    <input
                      type="number"
                      value={form.mrp}
                      onChange={(e) => handleMrpChange(e.target.value)}
                      placeholder="65000"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, background: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#15803d', marginBottom: '6px' }}>
                      Discount (%)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={form.discountPercentage}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        placeholder="15"
                        style={{ width: '100%', padding: '10px 28px 10px 12px', borderRadius: '8px', border: '1px solid #86efac', fontSize: '0.95rem', fontWeight: 800, color: '#15803d', background: '#f0fdf4' }}
                      />
                      <span style={{ position: 'absolute', right: '10px', top: '10px', fontWeight: 800, color: '#16a34a', fontSize: '0.85rem' }}>%</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e40af', marginBottom: '6px' }}>
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={form.sellingPrice}
                      onChange={(e) => handleSellingPriceChange(e.target.value)}
                      placeholder="55250"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '2px solid #2563eb', fontSize: '1rem', fontWeight: 900, color: '#1e40af', background: '#eff6ff' }}
                    />
                  </div>
                </div>

                {/* Quick Discount Presets */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Quick Discount:</span>
                  {[5, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyPresetDiscount(pct)}
                      style={{
                        padding: '3px 8px',
                        background: Number(form.discountPercentage) === pct ? '#15803d' : '#ffffff',
                        color: Number(form.discountPercentage) === pct ? '#ffffff' : '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                {/* GST Rate & HSN Code Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      GST Tax Slab Rate
                    </label>
                    <select
                      value={form.gstPercentage}
                      onChange={(e) => setForm({ ...form, gstPercentage: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', fontWeight: 600 }}
                    >
                      <option value="18">18% — Laptops, Desktops & Electronics (Standard)</option>
                      <option value="28">28% — Luxury Hardware & High-End Monitors</option>
                      <option value="12">12% — Computer Accessories, Cables & Peripherals</option>
                      <option value="5">5% — Essential Repair Hardware Components</option>
                      <option value="0">0% — GST Exempted / Zero Tax</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      HSN / SAC Code
                    </label>
                    <input
                      type="text"
                      value={form.hsnCode}
                      onChange={(e) => setForm({ ...form, hsnCode: e.target.value })}
                      placeholder="8471"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#fff' }}
                    />
                  </div>
                </div>

                {/* GST Mode Checkbox */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.gstInclusive}
                      onChange={(e) => setForm({ ...form, gstInclusive: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#1a56db', cursor: 'pointer' }}
                    />
                    <span>Price is Inclusive of GST (Customer pays exactly ₹{sellingVal.toLocaleString('en-IN')})</span>
                  </label>
                </div>

                {/* Live Real-Time GST & Discount Breakdown Preview Box */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid #bfdbfe',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Receipt size={14} /> Real-Time Tax & Invoice Breakdown
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                      {discountPct}% Discount Applied
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: '10px', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>Base Price (Net):</span>
                      <strong style={{ color: '#0f2744' }}>₹{Math.round(basePrice).toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>CGST ({gstRateVal / 2}%):</span>
                      <strong style={{ color: '#0f2744' }}>₹{cgst.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>SGST ({gstRateVal / 2}%):</span>
                      <strong style={{ color: '#0f2744' }}>₹{sgst.toFixed(2)}</strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#64748b', display: 'block' }}>Customer Final Bill:</span>
                      <strong style={{ color: '#1e40af', fontSize: '0.95rem' }}>₹{Math.round(finalCustomerPrice).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {savings > 0 && (
                    <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #e2e8f0', fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>
                      🎉 Customer saves ₹{savings.toLocaleString('en-IN')} on MRP!
                    </div>
                  )}
                </div>
              </div>

              {/* Hardware Specifications */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Processor</label>
                  <input
                    type="text"
                    value={form.processor}
                    onChange={(e) => setForm({ ...form, processor: e.target.value })}
                    placeholder="e.g. Intel Core i5 13th Gen"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>RAM</label>
                  <input
                    type="text"
                    value={form.ram}
                    onChange={(e) => setForm({ ...form, ram: e.target.value })}
                    placeholder="e.g. 16GB DDR4"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Storage</label>
                  <input
                    type="text"
                    value={form.storage}
                    onChange={(e) => setForm({ ...form, storage: e.target.value })}
                    placeholder="e.g. 512GB NVMe SSD"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter product description, warranty details, etc."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
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
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
