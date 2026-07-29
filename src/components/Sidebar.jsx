import React from 'react';
import { MessageSquare, Terminal, Wrench, Key, Cpu, ShieldAlert, FileCode2 } from 'lucide-react';
import { audioFX } from '../utils/audioFX';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'chat', label: 'AI Chat Agent', icon: MessageSquare, badge: 'READY' },
    { id: 'toolkit', label: 'Kali Command Gen', icon: Wrench, badge: '6 TOOLS' },
    { id: 'encoder', label: 'Payload & Decoder', icon: Key, badge: 'WORKBENCH' },
    { id: 'telemetry', label: 'System Telemetry', icon: Cpu, badge: 'LIVE' },
    { id: 'terminal', label: 'Interactive Terminal', icon: Terminal, badge: 'BASH' }
  ];

  return (
    <aside className="glass-panel" style={{ width: '260px', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ padding: '0 0.5rem 0.5rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.5rem' }}>
        <span className="font-display glow-cyan" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>
          NAVIGATION MODULES
        </span>
      </div>

      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              audioFX.playClick();
            }}
            style={{
              background: isActive
                ? 'linear-gradient(90deg, rgba(0, 243, 255, 0.15), rgba(157, 0, 255, 0.05))'
                : 'transparent',
              border: isActive ? '1px solid var(--neon-cyan)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '0.75rem 0.9rem',
              color: isActive ? 'var(--neon-cyan)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            className="sidebar-tab-btn"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Icon size={18} color={isActive ? 'var(--neon-cyan)' : 'currentColor'} />
              <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 400 }}>
                {tab.label}
              </span>
            </div>
            {tab.badge && (
              <span
                className={`badge ${
                  isActive ? 'badge-cyan' : 'badge-green'
                }`}
                style={{ fontSize: '0.65rem' }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Security Tip Panel at bottom */}
      <div className="glass-card" style={{ marginTop: 'auto', background: 'rgba(7, 9, 14, 0.6)', border: '1px solid rgba(0, 243, 255, 0.15)', padding: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <ShieldAlert size={14} color="var(--neon-green)" />
          <span className="font-display glow-green" style={{ fontSize: '0.7rem', fontWeight: 600 }}>SYSTEM STATUS</span>
        </div>
        <p className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Kali Cyber Node Active. AI Agent ready for Nmap, Metasploit, Python script analysis & payload generation.
        </p>
      </div>
    </aside>
  );
}
