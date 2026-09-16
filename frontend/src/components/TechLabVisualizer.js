'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Cpu, Monitor, Sparkles, Eye, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import styles from './TechLabVisualizer.module.css';

export default function TechLabVisualizer() {
  const [activeMode, setActiveMode] = useState('chip');
  const [thermalView, setThermalView] = useState(false);
  const canvasRef = useRef(null);

  const modes = {
    chip: {
      title: 'Micro BGA Motherboard Chip-Level Repair',
      tag: 'Chip-Level Lab',
      desc: 'Real-time thermal laser diagnostics, SMD IC replacement under 45X stereo microscope, and power rail voltage testing.',
      metrics: [
        { label: 'BGA Heat Flow', val: '380°C Active' },
        { label: '19V Power Rail', val: 'Stable 19.2V' },
        { label: 'IC Alignment', val: '100% OK' },
        { label: 'Short Circuit', val: '0 Ohms Cleared' },
      ],
      whatsappMsg: 'Hi Raju! I saw the Motherboard Chip Repair diagnostic on your website and want to book an inspection.',
    },
    screen: {
      title: '30-Minute Express Laptop Screen Replacement',
      tag: 'Display Lab',
      desc: 'Testing OEM 144Hz IPS display panels, EDP 30-pin flex ribbon signals, and structural hinge reinforcement.',
      metrics: [
        { label: 'Panel Refresh', val: '144Hz QHD+' },
        { label: 'Color Gamut', val: '100% sRGB' },
        { label: 'Dead Pixels', val: '0 (Certified)' },
        { label: 'Flex Signal', val: '10.8 Gbps OK' },
      ],
      whatsappMsg: 'Hi Raju! I want to inquire about a laptop screen replacement.',
    },
    thermal: {
      title: 'Arctic MX-4 Liquid Thermal Paste & Dual Fan Overhaul',
      tag: 'Cooling Lab',
      desc: 'Deep ultrasonic heatsink cleaning, fan lubrication, and Arctic MX-4 compound application to eliminate 95°C thermal throttle.',
      metrics: [
        { label: 'Peak Temp Drop', val: '-33°C Drop' },
        { label: 'Restored Temp', val: '62°C Peak' },
        { label: 'Fan Acoustics', val: '100% Silent' },
        { label: 'FPS Boost', val: '+45% Higher' },
      ],
      whatsappMsg: 'Hi Raju! My laptop is overheating, I want to book a deep thermal cleaning service.',
    },
  };

  const current = modes[activeMode];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let scanY = 0;
    let scanDirection = 1;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = parent.clientHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      // Dark Tech Background
      ctx.fillStyle = '#061120';
      ctx.fillRect(0, 0, w, h);

      // Circuit Grid Pattern
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Motherboard Chips & Bus Traces
      const cx = w / 2;
      const cy = h / 2;

      // Central Processor Chip
      const chipSize = Math.min(w, h) * 0.4;
      ctx.save();
      ctx.translate(cx, cy);

      // Chip Outer PCB
      ctx.fillStyle = '#0a192f';
      ctx.strokeStyle = thermalView ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = thermalView ? 'rgba(239, 68, 68, 0.6)' : 'rgba(56, 189, 248, 0.6)';
      ctx.fillRect(-chipSize / 2, -chipSize / 2, chipSize, chipSize);
      ctx.strokeRect(-chipSize / 2, -chipSize / 2, chipSize, chipSize);
      ctx.shadowBlur = 0;

      // Silicon Die Center
      const dieSize = chipSize * 0.6;
      const dieGrad = ctx.createLinearGradient(-dieSize / 2, -dieSize / 2, dieSize / 2, dieSize / 2);
      if (thermalView) {
        dieGrad.addColorStop(0, '#f97316');
        dieGrad.addColorStop(0.5, '#ef4444');
        dieGrad.addColorStop(1, '#991b1b');
      } else {
        dieGrad.addColorStop(0, '#1e3a8a');
        dieGrad.addColorStop(0.5, '#0284c7');
        dieGrad.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = dieGrad;
      ctx.fillRect(-dieSize / 2, -dieSize / 2, dieSize, dieSize);

      // Silicon circuit micro-lines
      ctx.strokeStyle = thermalView ? 'rgba(254, 240, 138, 0.4)' : 'rgba(147, 197, 253, 0.35)';
      ctx.lineWidth = 1;
      for (let i = -dieSize / 2 + 10; i < dieSize / 2; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, -dieSize / 2);
        ctx.lineTo(i, dieSize / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-dieSize / 2, i);
        ctx.lineTo(dieSize / 2, i);
        ctx.stroke();
      }

      // Chip Text Label
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(12, chipSize * 0.08)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(activeMode === 'chip' ? 'BGA IC 4nm' : activeMode === 'screen' ? 'EDP GPU 144Hz' : 'ARCTIC 62°C', 0, 4);

      ctx.restore();

      // Radiating Circuit Bus Lines
      const busLines = [
        { x1: cx - chipSize / 2, y1: cy - chipSize / 4, x2: 30, y2: cy - chipSize / 4 },
        { x1: cx - chipSize / 2, y1: cy + chipSize / 4, x2: 30, y2: cy + chipSize / 4 },
        { x1: cx + chipSize / 2, y1: cy - chipSize / 4, x2: w - 30, y2: cy - chipSize / 4 },
        { x1: cx + chipSize / 2, y1: cy + chipSize / 4, x2: w - 30, y2: cy + chipSize / 4 },
        { x1: cx - chipSize / 4, y1: cy - chipSize / 2, x2: cx - chipSize / 4, y2: 30 },
        { x1: cx + chipSize / 4, y1: cy - chipSize / 2, x2: cx + chipSize / 4, y2: 30 },
        { x1: cx - chipSize / 4, y1: cy + chipSize / 2, x2: cx - chipSize / 4, y2: h - 30 },
        { x1: cx + chipSize / 4, y1: cy + chipSize / 2, x2: cx + chipSize / 4, y2: h - 30 },
      ];

      ctx.strokeStyle = thermalView ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      busLines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();

        // Pulsing data packets
        const pulseOffset = (time * 120) % 100;
        const px = line.x1 + (line.x2 - line.x1) * (pulseOffset / 100);
        const py = line.y1 + (line.y2 - line.y1) * (pulseOffset / 100);

        ctx.fillStyle = thermalView ? '#facc15' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Oscilloscope Waveform at the bottom
      ctx.strokeStyle = thermalView ? '#ef4444' : '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const waveY = h - 25;
      for (let x = 20; x < w - 20; x++) {
        const y = waveY + Math.sin(x * 0.04 + time * 6) * 10 * Math.cos(x * 0.01);
        if (x === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Sweeping Laser Diagnostic Scan Line
      scanY += scanDirection * 2.5;
      if (scanY > h || scanY < 0) scanDirection *= -1;

      const scanGrad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
      scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      scanGrad.addColorStop(0.5, thermalView ? 'rgba(239, 68, 68, 0.8)' : 'rgba(56, 189, 248, 0.85)');
      scanGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 15, w, 30);

      ctx.strokeStyle = thermalView ? '#f87171' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = thermalView ? '#ef4444' : '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      time += 0.016;

      // Optical Microscope Reticle (Corners)
      const pad = 16;
      const len = 16;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(pad, pad + len);
      ctx.lineTo(pad, pad);
      ctx.lineTo(pad + len, pad);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(w - pad - len, pad);
      ctx.lineTo(w - pad, pad);
      ctx.lineTo(w - pad, pad + len);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(pad, h - pad - len);
      ctx.lineTo(pad, h - pad);
      ctx.lineTo(pad + len, h - pad);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(w - pad - len, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.lineTo(w - pad, h - pad - len);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [activeMode, thermalView]);

  return (
    <div className={styles.container}>
      {/* Top Bar Switchers */}
      <div className={styles.topBar}>
        <div className={styles.tabGroup}>
          <button
            onClick={() => setActiveMode('chip')}
            className={`${styles.tabBtn} ${activeMode === 'chip' ? styles.active : ''}`}
          >
            <Cpu size={14} color="#38bdf8" /> Motherboard Chip Repair
          </button>

          <button
            onClick={() => setActiveMode('screen')}
            className={`${styles.tabBtn} ${activeMode === 'screen' ? styles.active : ''}`}
          >
            <Monitor size={14} color="#38bdf8" /> Screen Replacement
          </button>

          <button
            onClick={() => setActiveMode('thermal')}
            className={`${styles.tabBtn} ${activeMode === 'thermal' ? styles.active : ''}`}
          >
            <Sparkles size={14} color="#38bdf8" /> Thermal Deep Clean
          </button>
        </div>

        <button
          onClick={() => setThermalView(!thermalView)}
          className={`${styles.thermalBtn} ${thermalView ? styles.active : ''}`}
        >
          <Eye size={14} /> {thermalView ? '🔥 Thermal Camera ON' : 'Thermal View'}
        </button>
      </div>

      {/* Main Canvas Stage */}
      <div className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Live Status Pill */}
        <div className={styles.statusPill}>
          <span className={styles.pulseDot} />
          <span>LIVE 60FPS AUTOSCAN • {current.tag.toUpperCase()}</span>
        </div>

        {/* Desktop Floating Telemetry Metrics */}
        <div className={styles.telemetryGrid}>
          {current.metrics.map((m, idx) => (
            <div key={idx} className={styles.metricItem}>
              <span>{m.label}:</span>
              <strong>{m.val}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Telemetry Ribbon (Only visible on mobile screens) */}
      <div className={styles.mobileMetricsGrid}>
        {current.metrics.map((m, idx) => (
          <div key={idx} className={styles.metricItem}>
            <span>{m.label}:</span>
            <strong>{m.val}</strong>
          </div>
        ))}
      </div>

      {/* Bottom Information Card */}
      <div className={styles.bottomCard}>
        <div className={styles.cardInfo}>
          <h4>{current.title}</h4>
          <p>{current.desc}</p>
        </div>

        <div className={styles.cardActions}>
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(current.whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            <MessageCircle size={15} /> WhatsApp Raju
          </a>
          <Link href="/book-repair" className={styles.bookBtn}>
            Book Inspection →
          </Link>
        </div>
      </div>
    </div>
  );
}
