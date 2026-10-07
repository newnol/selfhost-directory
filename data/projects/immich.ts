import type { Project } from "../types";

const project: Project = {
  slug: "immich",
  name: "Immich",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/immich.svg",
  categorySlug: "media",
  category: "Photos",
  tags: ["google-photos", "media", "backup"],
  stack: ["TypeScript", "PostgreSQL", "Redis", "Docker"],
  license: "AGPL-3.0",
  deploy: "Docker Compose",
  requirements: "2 CPU, 4 GB RAM, SSD storage",
  structuredRequirements: {
    "minimum": {
      "cpu": 2,
      "ramGiB": 6
    },
    "recommended": {
      "cpu": 4,
      "ramGiB": 8
    },
    "architectures": [
      "amd64",
      "arm64"
    ],
    "provenance": {
      "kind": "documented",
      "source": "https://docs.immich.app/install/requirements/",
      "checkedAt": "2026-10-07",
      "note": "Upstream: 2 cores / 6GB minimum, 4 cores / 8GB recommended. GB conservatively rounded up to whole GiB, not a measured workload. Standard stack with machine learning; 4GB only with ML disabled. v3 amd64 ML requires x86-64-v2 (not checked). Local SSD for Postgres, never a network share; library overhead 10–20%. Disk depends on library size and remains unknown."
    }
  },
  score: 92,
  links: {
    source: "https://github.com/immich-app/immich",
    docs: "https://immich.app/docs/overview/introduction",
    demo: "https://demo.immich.app",
  },
  summary: {
    vi: "Thư viện ảnh tự host, phù hợp để thay Google Photos cho cá nhân hoặc gia đình.",
    en: "A self-hosted photo and video backup app, suitable as a Google Photos alternative.",
  },
  notes: {
    vi: "Nên chạy bằng Docker Compose chính thức, chuẩn bị dung lượng lưu trữ và chiến lược backup trước khi import ảnh lớn.",
    en: "Use the official Docker Compose setup and plan storage plus backups before importing a large photo library.",
  },
  deployGuide: {
    vi: {
      overview:
        "Triển khai bằng Docker Compose chính thức, ưu tiên máy có SSD và backup ổn định.",
      steps: [
        "Tạo thư mục app, tải file compose và `.env` từ tài liệu Immich.",
        "Cấu hình `UPLOAD_LOCATION`, `DB_PASSWORD` và domain public nếu dùng reverse proxy.",
        "Chạy `docker compose up -d`, mở web UI, tạo tài khoản admin đầu tiên.",
        "Đặt Caddy/Nginx phía trước với HTTPS nếu public ra internet.",
        "Import ảnh theo từng đợt nhỏ và theo dõi dung lượng storage.",
      ],
      backup:
        "Backup thư mục upload và database PostgreSQL. Không chỉ backup container image.",
    },
    en: {
      overview:
        "Deploy with the official Docker Compose stack, preferably on SSD-backed storage with planned backups.",
      steps: [
        "Create an app directory, then download the official compose and `.env` files.",
        "Configure `UPLOAD_LOCATION`, `DB_PASSWORD`, and the public domain if using a reverse proxy.",
        "Run `docker compose up -d`, open the web UI, and create the first admin account.",
        "Put Caddy or Nginx in front with HTTPS before exposing it publicly.",
        "Import photos in batches and monitor storage growth.",
      ],
      backup:
        "Back up the upload directory and PostgreSQL database. Container images are not enough.",
    },
  },
  deploySnippets: {
    dockerCompose: `name: immich
services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    container_name: immich_server
    volumes:
      - ./library:/usr/src/app/upload
      - /etc/localtime:/etc/localtime:ro
    environment:
      DB_HOSTNAME: database
      DB_USERNAME: postgres
      DB_PASSWORD: CHANGEME_db_password # CHANGE THIS
      DB_DATABASE_NAME: immich
      REDIS_HOSTNAME: redis
    ports:
      - "2283:2283"
    depends_on:
      - redis
      - database
    restart: unless-stopped

  redis:
    image: docker.io/redis:7-alpine
    container_name: immich_redis
    restart: unless-stopped

  database:
    image: docker.io/tensorchord/pgvecto-rs:pg14-v0.2.0
    container_name: immich_postgres
    environment:
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_USER: postgres
      POSTGRES_DB: immich
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/immich
sudo chown "$USER":"$USER" /opt/immich
cd /opt/immich

cat > docker-compose.yml <<'COMPOSE'
name: immich
services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    container_name: immich_server
    volumes:
      - ./library:/usr/src/app/upload
      - /etc/localtime:/etc/localtime:ro
    environment:
      DB_HOSTNAME: database
      DB_USERNAME: postgres
      DB_PASSWORD: CHANGEME_db_password # CHANGE THIS
      DB_DATABASE_NAME: immich
      REDIS_HOSTNAME: redis
    ports:
      - "2283:2283"
    depends_on:
      - redis
      - database
    restart: unless-stopped

  redis:
    image: docker.io/redis:7-alpine
    container_name: immich_redis
    restart: unless-stopped

  database:
    image: docker.io/tensorchord/pgvecto-rs:pg14-v0.2.0
    container_name: immich_postgres
    environment:
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_USER: postgres
      POSTGRES_DB: immich
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Immich is running on http://SERVER_IP:2283"`,
  },
};
export default project;
