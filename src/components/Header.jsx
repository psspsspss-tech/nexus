import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Activity, Volume2, VolumeX, Mic, MicOff, Terminal, Sparkles, Wifi } from 'lucide-react';
import { audioFX } from '../utils/audioFX';

export default function Header({ 
  currentPersona, 
  setPersona, 
  matrixMode, 
  setMatrixMode,
  soundOn,
  setSoundOn,
  speechOn,
  setSpeechOn
}) {
  const [cpuUsage, setCpuUsage] = useState(24);
  const [ramUsage, setRamUsage] = useState(4.2);
  const [netSpeed, setNetSpeed] = useState(128);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(18 + Math.random() * 35));
      setRamUsage((3.8 + Math.random() * 0.9).toFixed(1));
      setNetSpeed(Math.floor(90 + Math.random() * 110));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const personas = [
    { id: 'kali_expert', name: 'Kali OS Architect', icon: Terminal, color: 'var(--neon-cyan)' },
    { id: 'sec_auditor', name: 'Sec Auditor', icon: Shield, color: 'var(--neon-green)' },
    { id: 'code_refactor', name: 'Exploit/Code Analyst', icon: Sparkles, color: 'var(--neon-purple)' }
  ];

  return (
    <header className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-glow)' }}>
      {/* Brand & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-pulse-glow" style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(0,243,255,0.2), rgba(157,0,255,0.2))', border: '1px solid var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Terminal size={24} color="var(--neon-cyan)" />
          </div>
          <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--neon-green)', boxShadow: '0 0 8px var(--neon-green)' }}></span>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="font-display glow-cyan" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '0.08em' }}>
              NEO-KALI <span style={{ color: 'var(--neon-green)' }}>AI</span>
            </h1>
            <span className="badge badge-cyan">v2.4 CORE</span>
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-green)' }}></span>
              ONLINE
            </span>
          </div>
          <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Cyber Security AI Engine & Desktop Command Center
          </p>
        </div>
      </div>

      {/* Center Persona Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(7, 9, 14, 0.6)', padding: '0.3rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
        {personas.map(p => {
          const Icon = p.icon;
          const isActive = currentPersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setPersona(p.id);
                audioFX.playClick();
              }}
              style={{
                background: isActive ? 'rgba(0, 243, 255, 0.15)' : 'transparent',
                border: isActive ? '1px solid var(--neon-cyan)' : '1px solid transparent',
                color: isActive ? 'var(--neon-cyan)' : 'var(--text-muted)',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={14} color={isActive ? p.color : 'currentColor'} />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Right HUD Widgets & Audio Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Telemetry Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <Cpu size={14} color="var(--neon-cyan)" />
            <span style={{ color: 'var(--text-muted)' }}>CPU</span>
            <span style={{ color: cpuUsage > 40 ? 'var(--neon-orange)' : 'var(--neon-cyan)', fontWeight: 600 }}>{cpuUsage}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <Activity size={14} color="var(--neon-green)" />
            <span style={{ color: 'var(--text-muted)' }}>RAM</span>
            <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>{ramUsage} GB</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <Wifi size={14} color="var(--neon-purple)" />
            <span style={{ color: 'var(--text-muted)' }}>NET</span>
            <span style={{ color: 'var(--neon-purple)', fontWeight: 600 }}>{netSpeed} KB/s</span>
          </div>
        </div>

        {/* Matrix & Audio Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => {
              setMatrixMode(!matrixMode);
              audioFX.playClick();
            }}
            title="Toggle Matrix FX Canvas"
            className="cyber-btn-secondary"
            style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
          >
            <Sparkles size={14} color={matrixMode ? 'var(--neon-green)' : 'currentColor'} />
            <span style={{ color: matrixMode ? 'var(--neon-green)' : 'inherit' }}>MATRIX</span>
          </button>

          <button
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              audioFX.soundEnabled = next;
              if (next) audioFX.playClick();
            }}
            title="Toggle Audio FX"
            className="cyber-btn-secondary"
            style={{ padding: '0.4rem' }}
          >
            {soundOn ? <Volume2 size={16} color="var(--neon-cyan)" /> : <VolumeX size={16} color="var(--text-muted)" />}
          </button>

          <button
            onClick={() => {
              const next = !speechOn;
              setSpeechOn(next);
              audioFX.speechEnabled = next;
              audioFX.playClick();
            }}
            title="Toggle Speech Voice Output"
            className="cyber-btn-secondary"
            style={{ padding: '0.4rem' }}
          >
            {speechOn ? <Mic size={16} color="var(--neon-purple)" /> : <MicOff size={16} color="var(--text-muted)" />}
          </button>
        </div>
      </div>
    </header>
  );
}
