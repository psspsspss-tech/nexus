import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Copy, Check, Sparkles, Bot, User, Volume2, RefreshCw, ChevronDown, ChevronRight, Sliders, Play } from 'lucide-react';
import { streamAIResponse } from '../utils/aiEngine';
import { audioFX } from '../utils/audioFX';

export default function ChatAgent({
  currentPersona,
  speechOn,
  provider,
  model,
  apiKey,
  baseUrl,
  systemPrompt,
  temperature,
  onOpenSettings,
  onRunInTerminal
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: "Greetings, Operator. I am your **No-Limit Open-Source AI Agent**. How can I assist with your code creation, terminal execution, or security audit today?",
      thought: null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedThoughts, setExpandedThoughts] = useState({});
  const chatEndRef = useRef(null);

  const quickPrompts = [
    "Write a complete Python TCP port scanner script",
    "Explain Nmap Stealth Scan flags (-sS -sV -O)",
    "Generate Bash script to monitor desktop RAM & CPU",
    "How to decode Base64 payload in Linux terminal?",
    "Write an open-source web scraper script in JS/Node"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const toggleThought = (msgId) => {
    setExpandedThoughts(prev => ({ ...prev, [msgId]: !prev[msgId] }));
    audioFX.playClick();
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    audioFX.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const parseThoughtAndText = (rawContent) => {
    const thoughtMatch = rawContent.match(/<thought>([\s\S]*?)<\/thought>/);
    let thought = null;
    let mainText = rawContent;

    if (thoughtMatch) {
      thought = thoughtMatch[1].trim();
      mainText = rawContent.replace(/<thought>[\s\S]*?<\/thought>/, '').trim();
    }

    // Extract code block if present
    const codeMatch = mainText.match(/```(?:\w+)?\n([\s\S]*?)```/);
    let code = null;
    if (codeMatch) {
      code = codeMatch[1].trim();
    }

    return { thought, mainText, code };
  };

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim() || isStreaming) return;

    audioFX.playClick();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    const agentMsgId = Date.now() + 1;
    setMessages(prev => [
      ...prev,
      {
        id: agentMsgId,
        sender: 'agent',
        rawText: '',
        text: '',
        thought: null,
        code: null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    audioFX.playScan();

    streamAIResponse({
      provider,
      model,
      apiKey,
      baseUrl,
      systemPrompt,
      messages: newMessages,
      temperature,
      onChunk: (accumulatedText) => {
        const { thought, mainText, code } = parseThoughtAndText(accumulatedText);
        setMessages(prev =>
          prev.map(m =>
            m.id === agentMsgId
              ? { ...m, rawText: accumulatedText, text: mainText, thought, code }
              : m
          )
        );
      },
      onComplete: (finalText) => {
        setIsStreaming(false);
        const { mainText } = parseThoughtAndText(finalText);
        if (speechOn) audioFX.speak(mainText);
      },
      onError: (err) => {
        setIsStreaming(false);
        console.error("AI Error:", err);
      }
    });
  };

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
      {/* Agent Bar Header */}
      <div style={{ padding: '0.8rem 1.25rem', borderBottom: '1px solid rgba(0,243,255,0.15)', background: 'rgba(7,9,14,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,243,255,0.15)', border: '1px solid var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color="var(--neon-cyan)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 className="font-display glow-cyan" style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>
                AGENT STREAM // {model.toUpperCase()}
              </h3>
              <span className="badge badge-purple">{provider.toUpperCase()}</span>
            </div>
            <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Open-Source Uncensored Engine • Agentic Mode Active
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onOpenSettings}
            className="cyber-btn"
            style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
          >
            <Sliders size={13} /> MODEL SETTINGS
          </button>
          <button 
            onClick={() => {
              setMessages([{
                id: Date.now(),
                sender: 'agent',
                text: "Chat stream reset. Ready for next prompt.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }]);
              audioFX.playClick();
            }}
            className="cyber-btn-secondary" 
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
          >
            <RefreshCw size={13} /> CLEAR
          </button>
        </div>
      </div>

      {/* Message History List */}
      <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '0.9rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%'
            }}
          >
            {msg.sender === 'agent' && (
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0, 243, 255, 0.15)', border: '1px solid var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={18} color="var(--neon-cyan)" />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
              {/* Agent Reasoning Thought Accordion */}
              {msg.thought && (
                <div style={{ borderRadius: '8px', background: 'rgba(157, 0, 255, 0.08)', border: '1px solid rgba(157, 0, 255, 0.3)', overflow: 'hidden' }}>
                  <button
                    onClick={() => toggleThought(msg.id)}
                    style={{ width: '100%', padding: '0.4rem 0.8rem', background: 'transparent', border: 'none', color: 'var(--neon-purple)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                  >
                    {expandedThoughts[msg.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <Sparkles size={13} />
                    <span>AGENT REASONING TRACE (&lt;thought&gt;)</span>
                  </button>
                  {expandedThoughts[msg.id] && (
                    <div className="font-mono" style={{ padding: '0.6rem 0.8rem', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(157,0,255,0.2)', background: '#05070a', whiteSpace: 'pre-wrap' }}>
                      {msg.thought}
                    </div>
                  )}
                </div>
              )}

              {/* Main Message Card */}
              <div
                style={{
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, rgba(157, 0, 255, 0.2), rgba(0, 243, 255, 0.15))'
                    : 'rgba(13, 17, 26, 0.85)',
                  border: msg.sender === 'user' ? '1px solid var(--neon-purple)' : '1px solid rgba(0, 243, 255, 0.2)',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '0.9rem 1.1rem',
                  boxShadow: msg.sender === 'user' ? 'var(--shadow-neon-purple)' : '0 4px 12px rgba(0,0,0,0.3)',
                  color: 'var(--text-main)'
                }}
              >
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {msg.text || (isStreaming && msg.sender === 'agent' ? '...' : '')}
                </p>

                {msg.code && (
                  <div style={{ marginTop: '0.8rem', background: '#05070a', borderRadius: '8px', border: '1px solid rgba(0, 255, 102, 0.3)', overflow: 'hidden' }}>
                    <div style={{ background: 'rgba(0, 255, 102, 0.08)', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 255, 102, 0.2)' }}>
                      <span className="font-mono glow-green" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        Code / Execution Script
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {onRunInTerminal && (
                          <button
                            onClick={() => {
                              onRunInTerminal(msg.code);
                              audioFX.playSuccess();
                            }}
                            className="cyber-btn"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                          >
                            <Play size={11} /> RUN IN TERMINAL
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(msg.code, msg.id)}
                          className="cyber-btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check size={12} color="var(--neon-green)" /> COPIED!
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> COPY
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <pre className="font-mono" style={{ margin: 0, padding: '0.9rem', fontSize: '0.82rem', color: 'var(--neon-green)', overflowX: 'auto' }}>
                      {msg.code}
                    </pre>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', padding: '0 0.3rem' }}>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  {msg.time}
                </span>
                {msg.sender === 'agent' && msg.text && (
                  <button
                    onClick={() => audioFX.speak(msg.text)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    title="Read text aloud"
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(157, 0, 255, 0.2)', border: '1px solid var(--neon-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={18} color="var(--neon-purple)" />
              </div>
            )}
          </div>
        ))}

        {isStreaming && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--neon-cyan)', fontSize: '0.8rem' }} className="font-mono">
            <Sparkles size={14} className="animate-pulse-glow" />
            <span>Generating stream from {model}...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ padding: '0.5rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(7,9,14,0.4)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="cyber-btn-secondary"
            style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', padding: '0.3rem 0.7rem' }}
          >
            + {qp}
          </button>
        ))}
      </div>

      {/* Chat Input Field */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(0, 243, 255, 0.15)', background: 'rgba(13, 17, 26, 0.95)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask ${model} for code, terminal commands, or agentic automation...`}
          className="cyber-input"
        />
        <button
          onClick={() => handleSend()}
          disabled={isStreaming}
          className="cyber-btn"
          style={{ height: '44px', padding: '0 1.5rem', flexShrink: 0, opacity: isStreaming ? 0.6 : 1 }}
        >
          <Send size={16} /> SEND
        </button>
      </div>
    </div>
  );
}
