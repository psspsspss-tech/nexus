import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TermIcon, Play, Trash2, Copy, Check, CornerDownLeft } from 'lucide-react';
import { audioFX } from '../utils/audioFX';

export default function TerminalSandbox({ externalCommand }) {
  const [history, setHistory] = useState([
    { type: 'sys', text: 'NEO-KALI Linux Shell Engine [v2.4.0-release]' },
    { type: 'sys', text: 'Type "help" or click sample scripts below to execute Kali shell commands.' }
  ]);
  const [command, setCommand] = useState('');
  const termEndRef = useRef(null);

  useEffect(() => {
    if (externalCommand) {
      handleRunCommand(externalCommand);
    }
  }, [externalCommand]);

  const sampleCommands = [
    'uname -a',
    'ifconfig eth0',
    'whoami',
    'ps aux | grep xfce',
    'nmap --version',
    'python3 -c "import socket; print(socket.gethostname())"'
  ];

  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRunCommand = (cmdText = command) => {
    if (!cmdText.trim()) return;

    audioFX.playClick();
    const cleanCmd = cmdText.trim();
    const newEntry = [{ type: 'cmd', text: `root@kali:~# ${cleanCmd}` }];

    const cmdLower = cleanCmd.toLowerCase();

    if (cmdLower === 'help') {
      newEntry.push({
        type: 'out',
        text: `Available Built-in Commands & Utilities:
  help               - Display command manual
  clear              - Clear terminal display screen
  whoami             - Show current active user session
  uname -a           - Display Linux Kernel and CPU architecture
  ifconfig / ip a    - Show active network interface cards
  ps aux             - List active desktop processes
  nmap --version     - Print Nmap Security Scanner release info
  cat /etc/os-release- Print Linux OS distribution details`
      });
    } else if (cmdLower === 'clear') {
      setHistory([]);
      setCommand('');
      return;
    } else if (cmdLower === 'whoami') {
      newEntry.push({ type: 'out', text: 'root (Privileged Operator Session)' });
    } else if (cmdLower.includes('uname')) {
      newEntry.push({ type: 'out', text: 'Linux kali-desktop 6.6.9-kali1-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux' });
    } else if (cmdLower.includes('ifconfig') || cmdLower.includes('ip a')) {
      newEntry.push({
        type: 'out',
        text: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 45291  bytes 38491022 (38.4 MB)
        TX packets 21094  bytes 2491029 (2.4 MB)`
      });
    } else if (cmdLower.includes('os-release') || cmdLower.includes('cat /etc')) {
      newEntry.push({
        type: 'out',
        text: `PRETTY_NAME="Kali GNU/Linux Rolling"
NAME="Kali GNU/Linux"
VERSION_ID="2026.2"
VERSION="2026.2"
ID=kali
ID_LIKE=debian
HOME_URL="https://www.kali.org/"`
      });
    } else if (cmdLower.includes('nmap')) {
      newEntry.push({ type: 'out', text: 'Nmap version 7.94 ( https://nmap.org )' });
    } else if (cmdLower.includes('python')) {
      newEntry.push({ type: 'out', text: 'Python 3.11.8 [GCC 13.2.0 on linux]' });
    } else if (cmdLower.includes('ps aux')) {
      newEntry.push({
        type: 'out',
        text: `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 168968  9128 ?        Ss   13:40   0:01 /sbin/init
vimal     1754  1.9  0.6 123844 48328 ?        Sl   13:40   0:00 xfwm4
vimal     3760 24.0  0.7 144868 57216 ?        Sl   13:41   0:00 xfdesktop
vimal     4155  7.8  0.6 152369 52364 ?        Sl   13:41   0:00 xfce4-panel`
      });
    } else {
      newEntry.push({
        type: 'out',
        text: `[*] Executing: ${cleanCmd}\n[+] Task dispatched to Neo-Kali execution background daemon.\n[✓] Exit Status: 0 (SUCCESS)`
      });
    }

    setHistory(prev => [...prev, ...newEntry]);
    setCommand('');
  };

  return (
    <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <div style={{ paddingBottom: '0.8rem', borderBottom: '1px solid rgba(0, 243, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <TermIcon size={18} color="var(--neon-green)" />
          <h2 className="font-display glow-green" style={{ fontSize: '1rem', margin: 0 }}>
            INTERACTIVE KALI BASH TERMINAL
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              setHistory([]);
              audioFX.playClick();
            }}
            className="cyber-btn-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
          >
            <Trash2 size={13} /> CLEAR
          </button>
        </div>
      </div>

      {/* Terminal View Output */}
      <div style={{ flex: 1, background: '#040609', border: '1px solid rgba(0, 255, 102, 0.25)', borderRadius: '8px', padding: '1rem', overflowY: 'auto', marginBottom: '0.8rem' }} className="font-mono">
        {history.map((h, idx) => (
          <div key={idx} style={{ marginBottom: '0.4rem', lineHeight: '1.5', fontSize: '0.84rem' }}>
            {h.type === 'sys' && (
              <span style={{ color: 'var(--neon-cyan)' }}>[SYSTEM] {h.text}</span>
            )}
            {h.type === 'cmd' && (
              <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>{h.text}</span>
            )}
            {h.type === 'out' && (
              <pre style={{ margin: 0, color: 'var(--text-main)', opacity: 0.9, whiteSpace: 'pre-wrap' }}>{h.text}</pre>
            )}
          </div>
        ))}
        <div ref={termEndRef} />
      </div>

      {/* Quick Shell Commands Bar */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem', overflowX: 'auto' }}>
        {sampleCommands.map((sc, idx) => (
          <button
            key={idx}
            onClick={() => handleRunCommand(sc)}
            className="cyber-btn-secondary"
            style={{ fontSize: '0.7rem', whiteSpace: 'nowrap', padding: '0.25rem 0.6rem' }}
          >
            <Play size={11} color="var(--neon-green)" /> {sc}
          </button>
        ))}
      </div>

      {/* Terminal Command Input */}
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
        <span className="font-mono glow-green" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
          root@kali:~#
        </span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
          placeholder="Type bash command (e.g. nmap --version, whoami, help)..."
          className="cyber-input"
          style={{ background: '#040609', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}
        />
        <button
          onClick={() => handleRunCommand()}
          className="cyber-btn"
          style={{ height: '42px', padding: '0 1.2rem', borderColor: 'var(--neon-green)', color: 'var(--neon-green)' }}
        >
          <CornerDownLeft size={16} /> EXEC
        </button>
      </div>
    </div>
  );
}
