import type { Project } from "../types";

const project: Project = {
  slug: "vikunja",
  name: "Vikunja",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/vikunja.svg",
  categorySlug: "productivity",
  category: "Task Management",
  tags: ["todoist", "tasks", "kanban"],
  stack: ["Go", "Vue.js", "SQLite/PostgreSQL"],
  license: "AGPL-3.0",
  deploy: "Docker",
  requirements: "1 CPU, 512 MB RAM",
  score: 79,
  links: {
    source: "https://github.com/go-vikunja/vikunja",
    docs: "https://vikunja.io/docs/",
    demo: "https://try.vikunja.io",
  },
  summary: {
    vi: "Ứng dụng quản lý công việc tự host, hỗ trợ kanban, list và calendar, thay thế Todoist.",
    en: "A self-hosted task management app with kanban, list, and calendar views as a Todoist alternative.",
  },
  notes: {
    vi: "Nhẹ và nhanh, phù hợp cho cá nhân hoặc team nhỏ. Có thể dùng SQLite cho đơn giản hoặc PostgreSQL cho production.",
    en: "Lightweight and fast, suitable for individuals or small teams. Use SQLite for simplicity or PostgreSQL for production.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy một container Docker duy nhất, frontend và API gộp trong một binary.",
      steps: [
        "Tạo thư mục dữ liệu cho Vikunja.",
        "Chạy container với volume mount cho database và files.",
        "Truy cập web UI và tạo tài khoản đầu tiên.",
        "Cấu hình mailer nếu muốn gửi email thông báo.",
        "Tạo projects, tasks và mời cộng tác viên.",
      ],
      backup:
        "Backup file database (SQLite hoặc PostgreSQL) và thư mục files chứa attachments.",
    },
    en: {
      overview:
        "Run a single Docker container with frontend and API bundled in one binary.",
      steps: [
        "Create a data directory for Vikunja.",
        "Run the container with volume mounts for database and files.",
        "Access the web UI and create the first account.",
        "Configure mailer if email notifications are needed.",
        "Create projects, tasks, and invite collaborators.",
      ],
      backup:
        "Back up the database file (SQLite or PostgreSQL) and files directory containing attachments.",
    },
  },
  deploySnippets: {
    dockerCompose: `services:
  vikunja:
    image: vikunja/vikunja:latest
    container_name: vikunja
    volumes:
      - ./files:/app/vikunja/files
      - ./db:/app/vikunja/db
    ports:
      - "3456:3456"
    environment:
      VIKUNJA_SERVICE_PUBLICURL: "http://SERVER_IP:3456"
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/vikunja
sudo chown "$USER":"$USER" /opt/vikunja
cd /opt/vikunja

cat > docker-compose.yml <<'COMPOSE'
services:
  vikunja:
    image: vikunja/vikunja:latest
    container_name: vikunja
    volumes:
      - ./files:/app/vikunja/files
      - ./db:/app/vikunja/db
    ports:
      - "3456:3456"
    environment:
      VIKUNJA_SERVICE_PUBLICURL: "http://SERVER_IP:3456"
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Vikunja is running on http://SERVER_IP:3456"`,
  },
};
export default project;
