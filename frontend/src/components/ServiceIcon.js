'use client';
import {
  Monitor, Cpu, Zap, ShieldCheck, Sparkles, Home,
  HardDrive, Wrench, BatteryCharging, Keyboard, Flame,
  Laptop, Activity, Layers, Rocket
} from 'lucide-react';

export default function ServiceIcon({ name = '', icon = '', size = 32 }) {
  const cleanName = (name || '').toLowerCase();

  // Determine icon configuration based on service name or icon emoji
  let config = {
    gradient: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
    shadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
    iconComponent: <Wrench size={size} color="#ffffff" strokeWidth={2.2} />,
    badgeColor: '#38bdf8'
  };

  if (cleanName.includes('screen') || cleanName.includes('display') || icon === '🖥️' || icon === '💻') {
    config = {
      gradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
      shadow: '0 8px 22px rgba(2, 132, 199, 0.4)',
      iconComponent: <Monitor size={size} color="#ffffff" strokeWidth={2.2} />,
      badgeColor: '#38bdf8'
    };
  } else if (cleanName.includes('motherboard') || cleanName.includes('chip') || cleanName.includes('bga') || icon === '⚡') {
    config = {
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)',
      shadow: '0 8px 22px rgba(124, 58, 237, 0.4)',
      iconComponent: <Cpu size={size} color="#ffffff" strokeWidth={2.2} />,
      badgeColor: '#c084fc'
    };
  } else if (cleanName.includes('ssd') || cleanName.includes('ram') || cleanName.includes('upgrade') || cleanName.includes('speed') || icon === '🚀') {
    config = {
      gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
      shadow: '0 8px 22px rgba(5, 150, 105, 0.4)',
      iconComponent: <Rocket size={size} color="#ffffff" strokeWidth={2.2} />,
      badgeColor: '#34d399'
    };
  } else if (cleanName.includes('os') || cleanName.includes('windows') || cleanName.includes('virus') || cleanName.includes('security') || icon === '🛡️') {
    config = {
      gradient: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
      shadow: '0 8px 22px rgba(220, 38, 38, 0.4)',
      iconComponent: <ShieldCheck size={size} color="#ffffff" strokeWidth={2.2} />,
      badgeColor: '#f87171'
    };
  } else if (cleanName.includes('thermal') || cleanName.includes('clean') || cleanName.includes('fan') || cleanName.includes('paste') || icon === '❄️') {
    config = {
      gradient: 'linear-gradient(135deg, #0891b2 0%, #67e8f9 100%)',
      shadow: '0 8px 22px rgba(8, 145, 178, 0.4)',
      iconComponent: <Sparkles size={size} color="#ffffff" strokeWidth={2.2} />,
      badgeColor: '#67e8f9'
    };
  } else if (cleanName.includes('doorstep') || cleanName.includes('home') || cleanName.includes('visit') || icon === '🏠') {
    config = {
      gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
      shadow: '0 8px 22px rgba(217, 119, 6, 0.4)',
      iconComponent: <Home size={size} color="#ffffff" strokeWidth={2.2} />,
      badgeColor: '#fbbf24'
    };
  } else if (cleanName.includes('battery') || cleanName.includes('power') || cleanName.includes('charger')) {
    config = {
      gradient: 'linear-gradient(135deg, #eab308 0%, #facc15 100%)',
      shadow: '0 8px 22px rgba(234, 179, 8, 0.4)',
      iconComponent: <BatteryCharging size={size} color="#ffffff" strokeWidth={2.2} />,
      badgeColor: '#facc15'
    };
  } else if (cleanName.includes('keyboard') || cleanName.includes('trackpad') || cleanName.includes('key')) {
    config = {
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)',
      shadow: '0 8px 22px rgba(79, 70, 229, 0.4)',
      iconComponent: <Keyboard size={size} color="#ffffff" strokeWidth={2.2} />,
      badgeColor: '#818cf8'
    };
  } else if (cleanName.includes('data') || cleanName.includes('recovery') || cleanName.includes('hard drive')) {
    config = {
      gradient: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)',
      shadow: '0 8px 22px rgba(13, 148, 136, 0.4)',
      iconComponent: <HardDrive size={size} color="#ffffff" strokeWidth={2.2} />,
      badgeColor: '#2dd4bf'
    };
  }

  return (
    <div
      style={{
        width: '68px',
        height: '68px',
        borderRadius: '18px',
        background: config.gradient,
        boxShadow: config.shadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        flexShrink: 0
      }}
    >
      {/* Subtle glowing glass highlight */}
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: '2px',
          right: '2px',
          height: '45%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
          borderRadius: '16px 16px 8px 8px',
          pointerEvents: 'none'
        }}
      />
      {config.iconComponent}
    </div>
  );
}
