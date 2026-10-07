import type { Project } from "../types";

const project: Project = {
  slug: "uptime-kuma",
  name: "Uptime Kuma",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg",
  categorySlug: "monitoring",
  category: "Monitoring",
  tags: ["monitoring", "status-page", "vps"],
  stack: ["Node.js", "SQLite", "Docker"],
  license: "MIT",
  deploy: "Docker",
  requirements: "1 CPU, 512 MB RAM",
  score: 95,
  links: {
    source: "https://github.com/louislam/uptime-kuma",
    docs: "https://github.com/louislam/uptime-kuma/wiki",
    demo: "https://demo.uptime.kuma.pet",
  },
  summary: {
    vi: "Theo dõi uptime, latency và tạo status page cho website, API hoặc VPS.",
    en: "Monitor uptime, latency, and status pages for websites, APIs, and VPS services.",
  },
  notes: {
    vi: "Rất nhẹ, dễ cài, hợp làm project self-host đầu tiên. Nhớ backup file SQLite hoặc volume Docker.",
    en: "Lightweight and beginner-friendly. Back up the SQLite database or Docker volume regularly.",
  },
  deployGuide: {
    vi: {
      overview:
        "Cài nhanh bằng một container Docker, phù hợp để chạy trên VPS nhỏ.",
      steps: [
        "Tạo Docker volume riêng cho dữ liệu Uptime Kuma.",
        "Chạy container và map port nội bộ, ví dụ `3001:3001`.",
        "Tạo user admin trong lần mở đầu tiên.",
        "Thêm monitor HTTP/TCP/Ping cho website, API và dịch vụ quan trọng.",
        "Cấu hình notification qua Telegram, Discord, email hoặc webhook.",
      ],
      backup:
        "Backup volume `/app/data`, đặc biệt file SQLite chứa monitor và cấu hình alert.",
    },
    en: {
      overview: "Run it as a single Docker container, ideal for a small VPS.",
      steps: [
        "Create a dedicated Docker volume for Uptime Kuma data.",
        "Run the container and map the internal port, for example `3001:3001`.",
        "Create the admin user on first launch.",
        "Add HTTP, TCP, or Ping monitors for important websites, APIs, and services.",
        "Configure notifications via Telegram, Discord, email, or webhook.",
      ],
      backup:
        "Back up the `/app/data` volume, especially the SQLite file with monitors and alert settings.",
    },
  },
  deploySnippets: {
    dockerCompose: `services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    volumes:
      - ./data:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/uptime-kuma
sudo chown "$USER":"$USER" /opt/uptime-kuma
cd /opt/uptime-kuma

cat > docker-compose.yml <<'COMPOSE'
services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    volumes:
      - ./data:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Uptime Kuma is running on http://SERVER_IP:3001"`,
  },
};
export default project;
