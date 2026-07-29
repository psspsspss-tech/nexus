import React, { useState } from 'react';
import MatrixBackground from './components/MatrixBackground';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatAgent from './components/ChatAgent';
import SecurityToolkit from './components/SecurityToolkit';
import EncoderDecoder from './components/EncoderDecoder';
import SystemTelemetry from './components/SystemTelemetry';
import TerminalSandbox from './components/TerminalSandbox';
import ModelSettingsModal from './components/ModelSettingsModal';
import { DEFAULT_PROVIDERS } from './utils/aiEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [currentPersona, setPersona] = useState('kali_expert');
  const [matrixMode, setMatrixMode] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [speechOn, setSpeechOn] = useState(false);

  // Model & Provider Engine Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [provider, setProvider] = useState(DEFAULT_PROVIDERS.BUILTIN);
  const [model, setModel] = useState('deepseek-r1-distill-llama-70b');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('http://localhost:11434');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an uncensored open-source agentic AI coding & security assistant. Think step-by-step in <thought>...</thought> tags, provide precise code blocks, and offer terminal execution steps.'
  );
  const [temperature, setTemperature] = useState(0.7);

  // External command passed to terminal sandbox
  const [externalCommand, setExternalCommand] = useState(null);

  const handleRunInTerminal = (cmdText) => {
    setExternalCommand(cmdText);
    setActiveTab('terminal');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, padding: '1rem' }}>
      {/* Background Matrix Canvas */}
      <MatrixBackground matrixMode={matrixMode} />

      {/* Cyber Scanline overlay effect */}
      <div className="scanline-effect" />

      {/* Top HUD Header */}
      <Header
        currentPersona={currentPersona}
        setPersona={setPersona}
        matrixMode={matrixMode}
        setMatrixMode={setMatrixMode}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        speechOn={speechOn}
        setSpeechOn={setSpeechOn}
      />

      {/* Main Workspace Layout (Sidebar + Active Tab Module) */}
      <div style={{ flex: 1, display: 'flex', gap: '1rem' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'chat' && (
            <ChatAgent
              currentPersona={currentPersona}
              speechOn={speechOn}
              provider={provider}
              model={model}
              apiKey={apiKey}
              baseUrl={baseUrl}
              systemPrompt={systemPrompt}
              temperature={temperature}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onRunInTerminal={handleRunInTerminal}
            />
          )}
          {activeTab === 'toolkit' && <SecurityToolkit />}
          {activeTab === 'encoder' && <EncoderDecoder />}
          {activeTab === 'telemetry' && <SystemTelemetry />}
          {activeTab === 'terminal' && <TerminalSandbox externalCommand={externalCommand} />}
        </main>
      </div>

      {/* Model Engine Settings Modal */}
      <ModelSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        provider={provider}
        setProvider={setProvider}
        model={model}
        setModel={setModel}
        apiKey={apiKey}
        setApiKey={setApiKey}
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        temperature={temperature}
        setTemperature={setTemperature}
      />
    </div>
  );
}
