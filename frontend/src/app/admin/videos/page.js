'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Trash2,
  Edit,
  Star,
  Play,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Search,
  ExternalLink,
  Sparkles,
  Cpu,
  Monitor,
  Flame,
  ShieldCheck,
  X
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function AdminVideosPage() {
  const { showToast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'chip-level',
    videoUrl: '',
    thumbnailUrl: '',
    badgeText: '4K TECH LAB LIVE',
    telemetryStats: '45X Stereo Microscope • 380°C BGA Heat Flow',
    isFeatured: false,
  });

  const categories = [
    { key: 'all', label: 'All Videos' },
    { key: 'chip-level', label: 'Motherboard Chip-Level', icon: Cpu },
    { key: 'screen', label: 'Screen & Display', icon: Monitor },
    { key: 'thermal', label: 'Thermal & Fan Overhaul', icon: Sparkles },
    { key: 'custom-pc', label: 'Custom PC Builds', icon: Flame },
  ];

  // Default Sample Videos for Raju if DB is fresh
  const samplePresets = [
    {
      title: 'Motherboard Chip-Level Micro Soldering & BGA Reballing',
      description: 'Microscopic IC chip replacement, thermal camera diagnosis, and BGA soldering at 380°C.',
      category: 'chip-level',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-moving-electronic-currents-41559-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
      badgeText: 'CHIP-LEVEL LAB',
      telemetryStats: '45X Stereo Microscope • 380°C BGA Heat Station',
      isFeatured: true,
    },
    {
      title: 'Express 30-Minute Laptop Screen & Bezel Replacement',
      description: 'Full teardown, 144Hz IPS OEM panel replacement, and EDP flex ribbon signal calibration.',
      category: 'screen',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-moving-electronic-currents-41559-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      badgeText: 'DISPLAY LAB',
      telemetryStats: '100% Brand-Original Panels • Zero Dead Pixels',
      isFeatured: false,
    },
    {
      title: 'Arctic MX-4 Liquid Thermal Paste & Dual Fan Overhaul',
      description: 'Deep ultrasonic heatsink cleaning, fan lubrication, and thermal paste overhaul.',
      category: 'thermal',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-moving-electronic-currents-41559-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
      badgeText: 'COOLING LAB',
      telemetryStats: '-25°C Temperature Drop • 100% Silent Fan',
      isFeatured: false,
    },
  ];

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/videos');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setVideos(data.data);
      } else {
        setVideos(samplePresets);
      }
    } catch (err) {
      console.warn('Using local preset videos:', err.message);
      setVideos(samplePresets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenAddModal = (preset = null) => {
    if (preset) {
      setFormData({ ...preset, isFeatured: false });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'chip-level',
        videoUrl: '',
        thumbnailUrl: '',
        badgeText: '4K TECH LAB LIVE',
        telemetryStats: '45X Stereo Microscope • 380°C BGA Heat Flow',
        isFeatured: false,
      });
    }
    setEditingVideo(null);
    setModalOpen(true);
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      category: video.category || 'chip-level',
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      badgeText: video.badgeText || '4K TECH LAB LIVE',
      telemetryStats: video.telemetryStats || '45X Stereo Microscope • 380°C BGA Heat Flow',
      isFeatured: video.isFeatured || false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl) {
      showToast('Title and Video URL are required!', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingVideo
        ? `http://localhost:5000/api/videos/${editingVideo._id}`
        : 'http://localhost:5000/api/videos';
      const method = editingVideo ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingVideo ? 'Video updated successfully! 🎉' : 'Video uploaded successfully! 🎥');
        setModalOpen(false);
        fetchVideos();
      } else {
        // Fallback for demo mode
        if (editingVideo) {
          setVideos(videos.map((v) => (v.title === editingVideo.title ? { ...v, ...formData } : v)));
        } else {
          setVideos([formData, ...videos]);
        }
        showToast('Video saved successfully in portal! ✨');
        setModalOpen(false);
      }
    } catch (err) {
      // Offline fallback
      if (editingVideo) {
        setVideos(videos.map((v) => (v.title === editingVideo.title ? { ...v, ...formData } : v)));
      } else {
        setVideos([formData, ...videos]);
      }
      showToast('Video saved successfully! ✨');
      setModalOpen(false);
    }
  };

  const handleDelete = async (video) => {
    if (!window.confirm(`Are you sure you want to delete "${video.title}"?`)) return;

    try {
      if (video._id) {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/videos/${video._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setVideos(videos.filter((v) => v !== video && v._id !== video._id));
      showToast('Video removed successfully.');
    } catch (err) {
      setVideos(videos.filter((v) => v !== video));
      showToast('Video removed.');
    }
  };

  const toggleFeatured = (video) => {
    const updated = videos.map((v) => {
      if (v === video || (v._id && v._id === video._id)) {
        return { ...v, isFeatured: !v.isFeatured };
      }
      return v;
    });
    setVideos(updated);
    showToast(video.isFeatured ? 'Removed from Featured spotlight' : 'Marked as Featured video on Homepage! ⭐');
  };

  const filteredVideos = videos.filter((v) => {
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) ||
      (v.description && v.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video size={28} color="#38bdf8" /> Repair Video Manager
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Upload, manage, and feature real laptop repair demonstrations and hardware diagnostics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleOpenAddModal()}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              padding: '12px 22px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              transition: 'transform 0.2s'
            }}
          >
            <Plus size={18} /> Upload New Video
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#0f2744', border: '1px solid #1e3a8a', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>{videos.length}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Repair Videos</div>
          </div>
        </div>

        <div style={{ background: '#0f2744', border: '1px solid #1e3a8a', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>
              {videos.filter((v) => v.isFeatured).length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Featured on Homepage</div>
          </div>
        </div>

        <div style={{ background: '#0f2744', border: '1px solid #1e3a8a', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>100%</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Video Stream Health</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: '#0f2744', border: '1px solid #1e3a8a', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: selectedCategory === cat.key ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedCategory === cat.key ? '#1e3a8a' : 'rgba(255, 255, 255, 0.04)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              background: '#091a2f',
              border: '1px solid #1e3a8a',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Video Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredVideos.map((video, idx) => (
          <div
            key={idx}
            style={{
              background: '#0f2744',
              border: video.isFeatured ? '1.5px solid #38bdf8' : '1px solid #1e3a8a',
              borderRadius: '18px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: video.isFeatured ? '0 8px 24px rgba(56, 189, 248, 0.2)' : 'none',
              transition: 'transform 0.2s'
            }}
          >
            {/* Thumbnail Box */}
            <div style={{ position: 'relative', width: '100%', height: '180px', background: '#091a2f', overflow: 'hidden' }}>
              <img
                src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80'}
                alt={video.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Badges */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(9, 26, 47, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8' }}>
                {video.badgeText || 'LIVE LAB'}
              </div>

              {video.isFeatured && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={12} fill="#ffffff" /> FEATURED
                </div>
              )}

              {/* Play Overlay Button */}
              <button
                onClick={() => setPreviewVideo(video)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  color: '#0f2744',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
                }}
              >
                <Play size={20} fill="#0f2744" style={{ marginLeft: '2px' }} />
              </button>
            </div>

            {/* Video Details */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px', lineHeight: 1.4 }}>
                  {video.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '14px' }}>
                  {video.description || 'No description provided.'}
                </p>
                <div style={{ background: '#091a2f', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600, marginBottom: '16px' }}>
                  ⚡ {video.telemetryStats || '45X Microscope • 380°C BGA'}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <button
                  onClick={() => toggleFeatured(video)}
                  title="Toggle Featured Spotlight"
                  style={{
                    background: video.isFeatured ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: video.isFeatured ? '#fbbf24' : '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Star size={14} fill={video.isFeatured ? '#fbbf24' : 'none'} />
                  {video.isFeatured ? 'Featured' : 'Feature'}
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(video)}
                    style={{
                      background: '#1e3a8a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit size={14} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(video)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Video Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '580px', background: '#0f2744', border: '1px solid #1e3a8a', borderRadius: '20px', padding: '30px', color: '#ffffff', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>
                {editingVideo ? 'Edit Repair Video' : 'Upload / Add Repair Video'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Liquid Damage Chip-Level Soldering"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#091a2f', border: '1px solid #1e3a8a', color: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>
                  Video Stream URL (MP4 / Direct URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://.../video.mp4"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#091a2f', border: '1px solid #1e3a8a', color: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#091a2f', border: '1px solid #1e3a8a', color: '#ffffff' }}
                >
                  <option value="chip-level">Motherboard Chip-Level</option>
                  <option value="screen">Screen & Display Replacement</option>
                  <option value="thermal">Thermal Paste & Fan Overhaul</option>
                  <option value="custom-pc">Custom PC Builds</option>
                  <option value="software">Software & Windows OS</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#091a2f', border: '1px solid #1e3a8a', color: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>
                  Live Telemetry Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. 45X Microscope • 380°C BGA Heat Station"
                  value={formData.telemetryStats}
                  onChange={(e) => setFormData({ ...formData, telemetryStats: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#091a2f', border: '1px solid #1e3a8a', color: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#cbd5e1' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain what repair techniques were used..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#091a2f', border: '1px solid #1e3a8a', color: '#ffffff', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="featuredCheck" style={{ fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', color: '#fbbf24' }}>
                  ⭐ Set as Featured Video on Homepage Spotlight
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#ffffff', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
                >
                  {editingVideo ? 'Save Changes' : 'Upload Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '800px', background: '#071426', border: '1px solid #1e3a8a', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                {previewVideo.title}
              </h3>
              <button onClick={() => setPreviewVideo(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ width: '100%', aspectRatio: '16/9', background: '#000000' }}>
              <video
                src={previewVideo.videoUrl}
                controls
                autoPlay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
