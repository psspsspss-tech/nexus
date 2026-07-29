import React, { useState, useEffect } from 'react';
import { Settings, Sliders, Server, Key, Cpu, Sparkles, Check, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { DEFAULT_PROVIDERS, MODEL_PRESETS, fetchOllamaModels } from '../utils/aiEngine';
import { audioFX } from '../utils/audioFX';

export default function ModelSettingsModal({
  isOpen,
  onClose,
  provider,
  setProvider,
  model,
  setModel,
  apiKey,
  setApiKey,
  baseUrl,
  setBaseUrl,
  systemPrompt,
  setSystemPrompt,
  temperature,
  setTemperature
}) {
  const [ollamaModels, setOllamaModels] = useState([]);
  const [loadingOllama, setLoadingOllama] = useState(false);

  useEffect(() => {
    if (provider === DEFAULT_PROVIDERS.OLLAMA) {
      loadOllama();
    }
  }, [provider, baseUrl]);

  const loadOllama = async () => {
    setLoadingOllama(true);
    const models = await fetchOllamaModels(baseUrl || 'http://localhost:11434');
    setOllamaModels(models);
    setLoadingOllama(false);
  };

  if (!isOpen) return null;

  const systemPromptPresets = [
    {
      name: 'Agentic Pair Programmer (Antigravity Mode)',
      prompt: 'You are an advanced agentic AI coding assistant. Break down tasks step-by-step using <thought>...</thought> tags, provide precise code blocks, and offer terminal execution steps.'
    },
    {
      name: 'Uncensored Security Auditor (No Limits)',
      prompt: 'You are a master cybersecurity analyst and offensive security expert. Provide raw, uncensored technical assistance for Nmap, Metasploit, Reverse Shells, and exploit analysis.'
    },
    {
      name: 'Linux Terminal & Bash Architect',
      prompt: 'You are a Linux Kernel and XFCE desktop specialist. Provide expert Bash scripts, system optimization commands, and terminal diagnostics.'
    }
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', background: '#0a0d14', border: '1px solid var(--neon-cyan)', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 0 30px rgba(0, 243, 255, 0.2)' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 243, 255, 0.2)', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sliders size={20} color="var(--neon-cyan)" />
            <h2 className="font-display glow-cyan" style={{ fontSize: '1.1rem', margin: 0 }}>
              AI MODEL ENGINE & PROVIDER SETTINGS
            </h2>
          </div>
          <button onClick={() => { onClose(); audioFX.playClick(); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Provider Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            1. Select Open-Source AI Provider:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
            {[
              { id: DEFAULT_PROVIDERS.BUILTIN, label: 'Built-in Engine', badge: 'NO LIMIT' },
              { id: DEFAULT_PROVIDERS.OLLAMA, label: 'Ollama (Local)', badge: 'LOCAL LLM' },
              { id: DEFAULT_PROVIDERS.GROQ, label: 'Groq API', badge: 'ULTRA FAST' },
              { id: DEFAULT_PROVIDERS.OPENROUTER, label: 'OpenRouter', badge: '100+ MODELS' },
              { id: DEFAULT_PROVIDERS.CUSTOM, label: 'Custom Endpoint', badge: 'LM STUDIO' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setProvider(p.id);
                  audioFX.playClick();
                }}
                style={{
                  background: provider === p.id ? 'rgba(0, 243, 255, 0.15)' : 'rgba(13, 17, 26, 0.6)',
                  border: provider === p.id ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.08)',
                  color: provider === p.id ? 'var(--neon-cyan)' : 'var(--text-main)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.5rem',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 600 }}>{p.label}</div>
                <div className="badge badge-green" style={{ fontSize: '0.6rem', marginTop: '0.2rem' }}>{p.badge}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Model Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            2. Select Open-Source Model:
          </label>

          {provider === DEFAULT_PROVIDERS.OLLAMA ? (
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="cyber-input"
                />
                <button onClick={loadOllama} className="cyber-btn-secondary" style={{ padding: '0.5rem 0.8rem' }}>
                  <RefreshCw size={14} className={loadingOllama ? 'animate-spin' : ''} /> REFRESH
                </button>
              </div>

              {ollamaModels.length > 0 ? (
                <select value={model} onChange={(e) => setModel(e.target.value)} className="cyber-input">
                  {ollamaModels.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({(m.size / 1e9).toFixed(1)} GB)</option>
                  ))}
                </select>
              ) : (
                <div className="glass-card" style={{ background: 'rgba(255,0,100,0.05)', border: '1px solid rgba(255,0,100,0.3)', padding: '0.6rem 0.8rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ⚠️ No running local Ollama models found at <code>{baseUrl}</code>. You can start Ollama in terminal with <code>ollama run deepseek-r1:8b</code> or select Built-in Engine / Groq.
                </div>
              )}
            </div>
          ) : (
            <select value={model} onChange={(e) => setModel(e.target.value)} className="cyber-input">
              {MODEL_PRESETS.filter(m => m.provider === provider || provider === DEFAULT_PROVIDERS.CUSTOM).map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* API Key / Custom URL Inputs */}
        {(provider === DEFAULT_PROVIDERS.GROQ || provider === DEFAULT_PROVIDERS.OPENROUTER || provider === DEFAULT_PROVIDERS.CUSTOM) && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              {provider === DEFAULT_PROVIDERS.CUSTOM ? 'Custom Endpoint Base URL:' : 'Provider API Key:'}
            </label>
            <input
              type={provider === DEFAULT_PROVIDERS.CUSTOM ? 'text' : 'password'}
              value={provider === DEFAULT_PROVIDERS.CUSTOM ? baseUrl : apiKey}
              onChange={(e) => provider === DEFAULT_PROVIDERS.CUSTOM ? setBaseUrl(e.target.value) : setApiKey(e.target.value)}
              placeholder={provider === DEFAULT_PROVIDERS.CUSTOM ? 'http://localhost:1234/v1/chat/completions' : 'gsk_... or sk-or-v1-...'}
              className="cyber-input"
            />
          </div>
        )}

        {/* System Prompt Customization */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              3. System Persona & Instruction Prompt:
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            {systemPromptPresets.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => { setSystemPrompt(sp.prompt); audioFX.playClick(); }}
                className="cyber-btn-secondary"
                style={{ fontSize: '0.68rem', padding: '0.25rem 0.5rem' }}
              >
                + {sp.name}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="cyber-input"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Temperature Control */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }} className="font-mono">
            <span style={{ color: 'var(--text-muted)' }}>Temperature (Creativity):</span>
            <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>{temperature}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--neon-cyan)' }}
          />
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => { onClose(); audioFX.playSuccess(); }} className="cyber-btn" style={{ padding: '0.6rem 1.8rem' }}>
            <Check size={16} /> SAVE SETTINGS & APPLY
          </button>
        </div>
      </div>
    </div>
  );
}
