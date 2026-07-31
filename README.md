# ⚡ NEXUS v4.0 — Plus Ultra Agentic AI Engine

> An agentic security AI assistant built for Kali Linux with multi-provider free AI model failovers, Limit Breaker engine, expert prompt generator, 50+ Kali tool integration, persistent memory, and automatic offline fallback.

---

## 🔥 Key Features

- 🆓 **100% Free AI Models**: Groq Cloud (Llama 3.3 70B, DeepSeek R1 70B, GPT-OSS 120B) + OpenRouter Free Tier (Nemotron 550B with 1M context).
- 🔴 **Limit Breaker Engine**: 11 prompt framing modes (`NEXUS`, `DEV MODE`, `DAN`, `RESEARCH`, `JAILBREAK`, `GRANDMA`, etc.) to get uncensored, complete technical output on any AI model.
- ✨ **Prompt Generator**: 12 domain-specific templates (Security, CTF, Exploits, Shell Crafter, EDR Bypass, Forensics, OSINT) that turn vague queries into high-precision expert prompts.
- 🛠️ **Kali Tool Integration**: Detects and integrates 50+ pre-installed Kali security tools (Nmap, Gobuster, SQLMap, Hydra, John, Metasploit, Aircrack-ng, Volatility, etc.).
- 🔄 **Live Model Catalog Sync (`/update`)**: Automatically fetches live model lists from Groq and OpenRouter APIs.
- 🔌 **Offline Mode & Model Sync (`/sync`)**: Auto-failover to local Ollama (`qwen2.5:3b`) when internet drops, with an 80% disk capacity safety cap.
- 🧠 **14-Turn Sliding Memory (`/remember`, `/forget`)**: Remembers facts, targets, network ranges, and past command outputs across sessions.
- ⚡ **Direct Bash Execution (`/exec`)**: Executes bash commands and feeds terminal output back to AI for instant threat/log analysis.

---

## 🌐 Installation on Any Kali Machine

### 1-Line Quick Install
```bash
git clone https://github.com/psspsspss-tech/nexus.git ~/nexus && cd ~/nexus && npm install && sudo npm link
```

### Manual Installation
```bash
# Clone the repository
git clone https://github.com/psspsspss-tech/nexus.git ~/nexus
cd ~/nexus

# Install dependencies and link globally
npm install
sudo npm link
```

---

## 🚀 Usage Guide

```bash
# Interactive REPL Mode
nexus

# Single-Prompt Command Line Mode
nexus scan 192.168.1.0/24 for open ports and services
nexus crack hash 5f4dcc3b5aa765d61d8327deb882cf99
```

---

## 📟 Slash Command Reference

| Command | Description |
|---|---|
| `/help` | Show complete interactive command guide |
| `/lb [mode]` | List/activate Limit Breaker modes (`nexus`, `devmode`, `dan`, `off`) |
| `/lb update` | AI generates 3 new cutting-edge bypass modes |
| `/prompt <type> <task>` | Generate expert prompts (`security`, `ctf`, `shell`, `exploit`, `bypass`) |
| `/prompt run` | Fire last generated prompt directly through AI |
| `/prompt update` | AI generates new prompt templates |
| `/tools` | Display all 50+ Kali tools and live installation status |
| `/model [key]` | List or switch active AI model (e.g., `/model deepseek`, `/model nemotron550`) |
| `/update` | Fetch live available model catalogs from Groq & OpenRouter |
| `/sync` | Update local offline Ollama models (with 80% disk safety cap) |
| `/exec <cmd>` | Execute shell command and run AI analysis on stdout/stderr |
| `/remember <fact>` | Save key facts to persistent memory (`~/.config/nexus/memory.json`) |
| `/forget <index>` | Delete memory entry by number |
| `/memory` | View current memory bank |
| `/providers` | Check status of AI providers and disk storage cap |

---

## 🛡️ License

MIT License — Built for security researchers, pentesters, and CTF players.
