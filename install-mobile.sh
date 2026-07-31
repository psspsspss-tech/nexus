#!/usr/bin/env bash
# ⚡ NEXUS MOBILE INSTALLER (Termux / NetHunter Pro / Android ARM64)

set -e

echo "📱 Installing NEXUS AI Engine for Mobile..."

# Detect OS / Environment
if command -v termux-info >/dev/null 2>&1; then
    ENV_TYPE="Termux"
    echo "✔ Detected Termux environment"
    pkg update -y
    pkg install -y nodejs git nmap
elif [ -f /etc/debian_version ] || command -v apt >/dev/null 2>&1; then
    ENV_TYPE="Kali NetHunter"
    echo "✔ Detected Kali NetHunter / Linux environment"
    sudo apt update
    sudo apt install -y nodejs npm git nmap
else
    echo "✔ General Linux / ARM environment detected"
fi

# Install NPM dependencies
echo "📦 Installing npm dependencies..."
npm install

# Setup executable symlink
BIN_DIR="$HOME/.local/bin"
mkdir -p "$BIN_DIR"
ln -sf "$(pwd)/bin/nexus.js" "$BIN_DIR/nexus"
chmod +x "$(pwd)/bin/nexus.js"

# Add ~/.local/bin to PATH if missing
SHELL_CONFIG=""
if [ -n "$ZSH_VERSION" ] || [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
fi

if [ -n "$SHELL_CONFIG" ]; then
    if ! grep -q 'export PATH="$HOME/.local/bin:$PATH"' "$SHELL_CONFIG"; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$SHELL_CONFIG"
        echo "✔ Added ~/.local/bin to $SHELL_CONFIG"
    fi
fi

echo ""
echo "✅ NEXUS Mobile Installation Complete!"
echo "🚀 Launch by typing: nexus"
