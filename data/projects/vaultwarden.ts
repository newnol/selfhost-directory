import type { Project } from "../types";

const project: Project = {
  slug: "vaultwarden",
  name: "Vaultwarden",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/vaultwarden.svg",
  categorySlug: "security",
  category: "Password Manager",
  tags: ["passwords", "security", "bitwarden"],
  stack: ["Rust", "SQLite", "Docker"],
  license: "AGPL-3.0",
  deploy: "Docker",
  requirements: "1 CPU, 512 MB RAM",
  score: 90,
  links: {
    source: "https://github.com/dani-garcia/vaultwarden",
    docs: "https://github.com/dani-garcia/vaultwarden/wiki",
  },
  summary: {
    vi: "Server Bitwarden-compatible nhẹ, phổ biến cho cá nhân và team nhỏ.",
    en: "A lightweight Bitwarden-compatible server for personal use and small teams.",
  },
  notes: {
    vi: "Nên bật HTTPS, cấu hình domain rõ ràng, backup database, và cân nhắc tắt đăng ký công khai.",
    en: "Run behind HTTPS, configure the domain carefully, back up the database, and consider disabling open signups.",
  },
  deployGuide: {
    vi: {
      overview:
        "Triển khai container nhẹ, nhưng phải coi đây là dịch vụ nhạy cảm và bảo mật kỹ.",
      steps: [
        "Tạo volume riêng để lưu database và attachments.",
        "Chạy container Vaultwarden phía sau reverse proxy có HTTPS.",
        "Đặt `DOMAIN` đúng URL public để email và client hoạt động ổn định.",
        "Tắt đăng ký công khai bằng `SIGNUPS_ALLOWED=false` sau khi tạo user.",
        "Bật 2FA cho tài khoản và giới hạn truy cập admin token.",
      ],
      backup:
        "Backup volume dữ liệu thường xuyên và kiểm tra restore định kỳ vì đây là kho mật khẩu.",
    },
    en: {
      overview:
        "Deploy as a lightweight container, but treat it as a sensitive service with strict security.",
      steps: [
        "Create a dedicated volume for the database and attachments.",
        "Run Vaultwarden behind a reverse proxy with HTTPS.",
        "Set `DOMAIN` to the correct public URL so emails and clients work reliably.",
        "Disable open signup with `SIGNUPS_ALLOWED=false` after creating users.",
        "Enable 2FA and tightly restrict admin token access.",
      ],
      backup:
        "Back up the data volume regularly and test restores because this stores passwords.",
    },
  },
  deploySnippets: {
    dockerCompose: `services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    environment:
      DOMAIN: "https://vault.example.com"
      SIGNUPS_ALLOWED: "false"
    volumes:
      - ./data:/data
    ports:
      - "8080:80"
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/vaultwarden
sudo chown "$USER":"$USER" /opt/vaultwarden
cd /opt/vaultwarden

cat > docker-compose.yml <<'COMPOSE'
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    environment:
      DOMAIN: "https://vault.example.com"
      SIGNUPS_ALLOWED: "false"
    volumes:
      - ./data:/data
    ports:
      - "8080:80"
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Vaultwarden is running on http://SERVER_IP:8080"`,
  },
};
export default project;
