import React, { useState, useEffect } from 'react';
import { Cpu, Activity, HardDrive, Wifi, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export default function SystemTelemetry() {
  const [cpuCores, setCpuCores] = useState([24, 32, 18, 45, 29, 38, 12, 54]);
  const [ramUsed, setRamUsed] = useState(4.3);
  const [ramTotal] = useState(16.0);
  const [netRx, setNetRx] = useState(142);
  const [netTx, setNetTx] = useState(88);
  const [history, setHistory] = useState(Array(20).fill(25));

  const processes = [
    { pid: 1754, name: 'xfwm4', user: 'vimal', cpu: '1.9%', mem: '48 MB', status: 'RUNNING' },
    { pid: 3760, name: 'xfdesktop', user: 'vimal', cpu: '24.0%', mem: '57 MB', status: 'RUNNING' },
    { pid: 4155, name: 'xfce4-panel', user: 'vimal', cpu: '7.8%', mem: '52 MB', status: 'RUNNING' },
    { pid: 1629, name: 'gnome-keyring-daemon', user: 'vimal', cpu: '0.1%', mem: '10 MB', status: 'RUNNING' },
    { pid: 8842, name: 'neo-kali-ai-core', user: 'vimal', cpu: '4.2%', mem: '142 MB', status: 'ACTIVE' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newCores = cpuCores.map(() => Math.floor(12 + Math.random() * 45));
      setCpuCores(newCores);
      const avgCpu = Math.floor(newCores.reduce((a, b) => a + b, 0) / newCores.length);
      setHistory(prev => [...prev.slice(1), avgCpu]);
      setRamUsed((4.1 + Math.random() * 0.6).toFixed(1));
      setNetRx(Math.floor(100 + Math.random() * 150));
      setNetTx(Math.floor(40 + Math.random() * 90));
    }, 1500);

    return () => clearInterval(interval);
  }, [cpuCores]);

  return (
    <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 className="font-display glow-cyan" style={{ fontSize: '1.1rem', margin: 0 }}>
            SYSTEM TELEMETRY & NODE METRICS
          </h2>
          <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real-time CPU core loads, memory allocation, network throughput & process telemetry.
          </p>
        </div>
        <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-green)' }}></span>
          KALI HOST CONNECTED
        </span>
      </div>

      {/* Top Gauges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* CPU Overall */}
        <div className="glass-card" style={{ background: 'rgba(7, 9, 14, 0.7)', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--neon-cyan)" />
              <span className="font-display glow-cyan" style={{ fontSize: '0.85rem' }}>CPU LOAD</span>
            </div>
            <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--neon-cyan)' }}>
              {Math.floor(cpuCores.reduce((a, b) => a + b, 0) / cpuCores.length)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.floor(cpuCores.reduce((a, b) => a + b, 0) / cpuCores.length)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>

        {/* RAM Usage */}
        <div className="glass-card" style={{ background: 'rgba(7, 9, 14, 0.7)', border: '1px solid rgba(0, 255, 102, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="var(--neon-green)" />
              <span className="font-display glow-green" style={{ fontSize: '0.85rem' }}>MEMORY</span>
            </div>
            <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--neon-green)' }}>
              {ramUsed} / {ramTotal} GB
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(ramUsed / ramTotal) * 100}%`,
                height: '100%',
                background: 'var(--neon-green)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>

        {/* Network Throughput */}
        <div className="glass-card" style={{ background: 'rgba(7, 9, 14, 0.7)', border: '1px solid rgba(157, 0, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wifi size={18} color="var(--neon-purple)" />
              <span className="font-display glow-purple" style={{ fontSize: '0.85rem' }}>NET TRAFFIC</span>
            </div>
            <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neon-purple)' }}>
              RX: {netRx} KB/s • TX: {netTx} KB/s
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(netRx / 300) * 100}%`,
                height: '100%',
                background: 'var(--neon-purple)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* CPU Cores Breakdown Grid */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(7, 9, 14, 0.7)' }}>
        <h4 className="font-display glow-cyan" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
          MULTI-CORE PROCESSOR BREAKDOWN (8 THREADS)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
          {cpuCores.map((val, idx) => (
            <div key={idx} style={{ background: '#07090e', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }} className="font-mono">
                <span style={{ color: 'var(--text-muted)' }}>Core #{idx + 1}</span>
                <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>{val}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${val}%`, height: '100%', background: 'var(--neon-cyan)', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Desktop Processes Table */}
      <div className="glass-card" style={{ background: 'rgba(7, 9, 14, 0.7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
          <h4 className="font-display glow-green" style={{ fontSize: '0.85rem', margin: 0 }}>
            ACTIVE PROCESS MONITOR
          </h4>
          <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            USER: vimal • SESSION: XFCE / X11
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="font-mono">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <th style={{ padding: '0.5rem' }}>PID</th>
              <th style={{ padding: '0.5rem' }}>PROCESS NAME</th>
              <th style={{ padding: '0.5rem' }}>USER</th>
              <th style={{ padding: '0.5rem' }}>CPU%</th>
              <th style={{ padding: '0.5rem' }}>MEMORY</th>
              <th style={{ padding: '0.5rem' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.pid} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8rem' }}>
                <td style={{ padding: '0.6rem 0.5rem', color: 'var(--neon-cyan)' }}>{p.pid}</td>
                <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-main)', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-muted)' }}>{p.user}</td>
                <td style={{ padding: '0.6rem 0.5rem', color: 'var(--neon-green)' }}>{p.cpu}</td>
                <td style={{ padding: '0.6rem 0.5rem', color: 'var(--neon-purple)' }}>{p.mem}</td>
                <td style={{ padding: '0.6rem 0.5rem' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
