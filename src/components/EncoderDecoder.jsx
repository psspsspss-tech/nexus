import React, { useState } from 'react';
import { Key, Copy, Check, Hash, RefreshCw, Lock, Sparkles } from 'lucide-react';
import { audioFX } from '../utils/audioFX';

export default function EncoderDecoder() {
  const [inputText, setInputText] = useState('admin:password123');
  const [mode, setMode] = useState('base64');
  const [copied, setCopied] = useState(false);

  // Simple string encodings & decodings
  const encodeBase64 = (str) => {
    try { return btoa(str); } catch (e) { return "Error encoding Base64"; }
  };
  const decodeBase64 = (str) => {
    try { return atob(str); } catch (e) { return "Invalid Base64 string"; }
  };

  const encodeHex = (str) => {
    return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  };
  const decodeHex = (str) => {
    try {
      const cleanHex = str.replace(/\s+/g, '');
      return cleanHex.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
    } catch (e) { return "Invalid Hex string"; }
  };

  const rot13 = (str) => {
    return str.replace(/[a-zA-Z]/g, (c) =>
      String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
    );
  };

  // Mock Hash function (MD5 & SHA256 simulation for visual display)
  const pseudoHash = (str, type) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
    if (type === 'md5') {
      return (hexHash + hexHash + hexHash + hexHash).slice(0, 32);
    }
    return (hexHash + hexHash + hexHash + hexHash + hexHash + hexHash + hexHash + hexHash).slice(0, 64);
  };

  // Hash Identification logic
  const identifyHash = (str) => {
    const clean = str.trim();
    if (!clean) return "Enter a hash above to identify";

    if (/^[a-fA-F0-9]{32}$/.test(clean)) return "MD5 / NTLM Hash detected (32 Hex Chars)";
    if (/^[a-fA-F0-9]{40}$/.test(clean)) return "SHA-1 Hash detected (40 Hex Chars)";
    if (/^[a-fA-F0-9]{64}$/.test(clean)) return "SHA-256 Hash detected (64 Hex Chars)";
    if (/^\$2[ayb]\$.{56}$/.test(clean)) return "Bcrypt Hash detected (Blowfish)";
    if (/^\$6\$.{16,100}$/.test(clean)) return "SHA-512 Unix Crypt Hash detected";
    
    return "Unknown or custom string format";
  };

  const getConvertedOutput = () => {
    switch (mode) {
      case 'base64_enc': return encodeBase64(inputText);
      case 'base64_dec': return decodeBase64(inputText);
      case 'hex_enc': return encodeHex(inputText);
      case 'hex_dec': return decodeHex(inputText);
      case 'url_enc': return encodeURIComponent(inputText);
      case 'url_dec': return decodeURIComponent(inputText);
      case 'rot13': return rot13(inputText);
      case 'md5': return pseudoHash(inputText, 'md5');
      case 'sha256': return pseudoHash(inputText, 'sha256');
      default: return encodeBase64(inputText);
    }
  };

  const outputText = getConvertedOutput();
  const identifiedHashType = identifyHash(inputText);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    audioFX.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 className="font-display glow-cyan" style={{ fontSize: '1.1rem', margin: 0 }}>
          PAYLOAD & HASH WORKBENCH
        </h2>
        <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Encode, decode, hash passwords, or identify unknown hash types for CTF & pentest analysis.
        </p>
      </div>

      {/* Hash Identifier Badge */}
      <div className="glass-card" style={{ marginBottom: '1.25rem', background: 'rgba(0, 243, 255, 0.05)', border: '1px solid var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Hash size={18} color="var(--neon-cyan)" />
          <div>
            <span className="font-display glow-cyan" style={{ fontSize: '0.8rem', fontWeight: 600 }}>LIVE HASH IDENTIFIER:</span>
            <p className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--neon-green)', margin: 0 }}>
              {identifiedHashType}
            </p>
          </div>
        </div>
        <span className="badge badge-cyan">AUTO ANALYZER</span>
      </div>

      {/* Input TextArea */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
          Source Raw Payload / Hash Input:
        </label>
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste plain text, payload, or target hash..."
          className="cyber-input"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Operation Mode Selector */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
          Select Transformation Algorithm:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { id: 'base64_enc', label: 'Base64 Encode' },
            { id: 'base64_dec', label: 'Base64 Decode' },
            { id: 'hex_enc', label: 'Hex Encode' },
            { id: 'hex_dec', label: 'Hex Decode' },
            { id: 'url_enc', label: 'URL Encode' },
            { id: 'url_dec', label: 'URL Decode' },
            { id: 'rot13', label: 'ROT13 Cipher' },
            { id: 'md5', label: 'MD5 Hash' },
            { id: 'sha256', label: 'SHA-256 Hash' }
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => {
                setMode(op.id);
                audioFX.playClick();
              }}
              style={{
                background: mode === op.id ? 'var(--neon-cyan)' : 'rgba(13, 17, 26, 0.8)',
                color: mode === op.id ? '#000' : 'var(--text-main)',
                border: mode === op.id ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: mode === op.id ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transformed Output Result */}
      <div className="glass-card" style={{ background: '#05070a', border: '1px solid rgba(0, 255, 102, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span className="font-display glow-green" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            TRANSFORMED OUTPUT ({mode.toUpperCase()})
          </span>
          <button
            onClick={handleCopy}
            className="cyber-btn"
            style={{ padding: '0.35rem 0.9rem', fontSize: '0.75rem' }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'COPIED TO CLIPBOARD' : 'COPY RESULT'}
          </button>
        </div>
        <textarea
          rows={4}
          readOnly
          value={outputText}
          className="cyber-input"
          style={{ background: '#090d14', color: 'var(--neon-green)', border: '1px solid rgba(0, 255, 102, 0.2)' }}
        />
      </div>
    </div>
  );
}
