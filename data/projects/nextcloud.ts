import type { Project } from "../types";

const project: Project = {
  slug: "nextcloud",
  name: "Nextcloud",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/nextcloud.svg",
  categorySlug: "media",
  category: "File Sync & Share",
  tags: ["google-drive", "dropbox", "files"],
  stack: ["PHP", "PostgreSQL", "Docker"],
  license: "AGPL-3.0",
  deploy: "Docker Compose",
  requirements: "2 CPU, 2 GB RAM",
  structuredRequirements: {
    "provenance": {
      "kind": "documented",
      "source": "https://docs.nextcloud.com/server/stable/admin_manual/installation/system_requirements.html",
      "checkedAt": "2026-10-07",
      "note": "Nextcloud 35 stable manual: 128MB minimum / 512MB recommended RAM per process; updater needs 256MB. These are NOT total host or Compose stack requirements, so host RAM thresholds remain unknown. Users, apps and activity change sizing; database memory is additional. 64-bit CPU/OS/PHP is recommended, not an amd64/arm64 image support declaration; CPU, disk and image architectures remain unknown."
    }
  },
  score: 86,
  links: {
    source: "https://github.com/nextcloud/server",
    docs: "https://docs.nextcloud.com",
    demo: "https://try.nextcloud.com",
  },
  summary: {
    vi: "Nền tảng đồng bộ và chia sẻ file tự host, thay thế Google Drive và Dropbox với nhiều plugin mở rộng.",
    en: "A self-hosted file sync and share platform, replacing Google Drive and Dropbox with extensive plugin support.",
  },
  notes: {
    vi: "Cấu hình PHP và database cần đúng. Sử dụng PostgreSQL cho production, nên đặt cron job và Redis để tăng hiệu năng.",
    en: "PHP and database configuration must be correct. Use PostgreSQL for production, set up cron jobs and Redis for better performance.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy bằng Docker Compose với PostgreSQL và Redis. Cần cấu hình domain và trusted_domains đúng.",
      steps: [
        "Tạo thư mục dữ liệu và cấu hình cho Nextcloud.",
        "Chạy Docker Compose với Nextcloud, PostgreSQL và Redis.",
        "Truy cập web UI, tạo tài khoản admin và cấu hình trusted_domains.",
        "Cài đặt cron job (system cron hoặc webcron) để xử lý background tasks.",
        "Đặt reverse proxy HTTPS và cấu hình overwrite.cli.url.",
      ],
      backup:
        "Backup thư mục data, database PostgreSQL và file config.php. Nên test restore định kỳ.",
    },
    en: {
      overview:
        "Run with Docker Compose using PostgreSQL and Redis. Domain and trusted_domains must be configured correctly.",
      steps: [
        "Create data and config directories for Nextcloud.",
        "Run Docker Compose with Nextcloud, PostgreSQL, and Redis.",
        "Access the web UI, create an admin account, and configure trusted_domains.",
        "Set up cron jobs (system cron or webcron) for background tasks.",
        "Put HTTPS reverse proxy in front and configure overwrite.cli.url.",
      ],
      backup:
        "Back up the data directory, PostgreSQL database, and config.php. Test restores regularly.",
    },
  },
  deploySnippets: {
    dockerCompose: `services:
  nextcloud:
    image: nextcloud:stable
    container_name: nextcloud
    volumes:
      - ./html:/var/www/html
      - ./data:/var/www/html/data
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_DB: nextcloud
      POSTGRES_USER: nextcloud
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      REDIS_HOST: redis
    ports:
      - "8080:80"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: nextcloud_postgres
    environment:
      POSTGRES_USER: nextcloud
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: nextcloud
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: nextcloud_redis
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/nextcloud
sudo chown "$USER":"$USER" /opt/nextcloud
cd /opt/nextcloud

cat > docker-compose.yml <<'COMPOSE'
services:
  nextcloud:
    image: nextcloud:stable
    container_name: nextcloud
    volumes:
      - ./html:/var/www/html
      - ./data:/var/www/html/data
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_DB: nextcloud
      POSTGRES_USER: nextcloud
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      REDIS_HOST: redis
    ports:
      - "8080:80"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: nextcloud_postgres
    environment:
      POSTGRES_USER: nextcloud
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: nextcloud
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: nextcloud_redis
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Nextcloud is running on http://SERVER_IP:8080"`,
  },
};
export default project;
