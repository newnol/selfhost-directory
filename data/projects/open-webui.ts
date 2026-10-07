import type { Project } from "../types";

const project: Project = {
  slug: "open-webui",
  name: "Open WebUI",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/open-webui.svg",
  categorySlug: "ai",
  category: "AI",
  tags: ["ai", "ollama", "chat"],
  stack: ["Python", "Svelte", "SQLite/PostgreSQL", "Docker"],
  license: "BSD-3-Clause",
  deploy: "Docker",
  requirements: "2 CPU, 2 GB RAM without local model",
  score: 88,
  links: {
    source: "https://github.com/open-webui/open-webui",
    docs: "https://docs.openwebui.com",
  },
  summary: {
    vi: "Giao diện chat AI tự host, dùng được với Ollama hoặc nhiều provider LLM.",
    en: "A self-hosted AI chat interface for Ollama and multiple LLM providers.",
  },
  notes: {
    vi: "Nếu chạy model local, tài nguyên phụ thuộc vào model/GPU. Nếu chỉ gọi API ngoài thì VPS nhỏ vẫn ổn.",
    en: "Local models depend on model size and GPU. For external APIs, a small VPS is usually enough.",
  },
  deployGuide: {
    vi: {
      overview:
        "Có thể chạy một container đơn giản, hoặc ghép với Ollama/LiteLLM nếu muốn hệ AI đầy đủ hơn.",
      steps: [
        "Chọn backend: Ollama local, LiteLLM gateway, hoặc API provider bên ngoài.",
        "Chạy container Open WebUI với volume `/app/backend/data`.",
        "Cấu hình biến môi trường cho provider hoặc endpoint Ollama/LiteLLM.",
        "Tạo admin user đầu tiên và kiểm tra quyền đăng ký.",
        "Đặt HTTPS nếu cho team truy cập từ internet.",
      ],
      backup:
        "Backup volume backend data và database nếu chuyển sang PostgreSQL.",
    },
    en: {
      overview:
        "Run it as a single container, or pair it with Ollama/LiteLLM for a fuller AI stack.",
      steps: [
        "Choose a backend: local Ollama, LiteLLM gateway, or external API provider.",
        "Run Open WebUI with a persistent `/app/backend/data` volume.",
        "Configure environment variables for the provider or Ollama/LiteLLM endpoint.",
        "Create the first admin user and review signup permissions.",
        "Put HTTPS in front if a team will access it from the internet.",
      ],
      backup:
        "Back up the backend data volume and database if you move to PostgreSQL.",
    },
  },
  deploySnippets: {
    dockerCompose: `services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    volumes:
      - ./data:/app/backend/data
    ports:
      - "3000:8080"
    environment:
      WEBUI_AUTH: "true"
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/open-webui
sudo chown "$USER":"$USER" /opt/open-webui
cd /opt/open-webui

cat > docker-compose.yml <<'COMPOSE'
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    volumes:
      - ./data:/app/backend/data
    ports:
      - "3000:8080"
    environment:
      WEBUI_AUTH: "true"
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Open WebUI is running on http://SERVER_IP:3000"`,
  },
};
export default project;
