import type { Project } from "../types";

const project: Project = {
  slug: "outline",
  name: "Outline",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/outline.svg",
  categorySlug: "productivity",
  category: "Team Wiki & Docs",
  tags: ["notion", "wiki", "docs"],
  stack: ["TypeScript", "Node.js", "PostgreSQL", "Redis"],
  license: "BSL-1.1",
  deploy: "Docker Compose",
  requirements: "2 CPU, 2 GB RAM",
  score: 84,
  links: {
    source: "https://github.com/outline/outline",
    docs: "https://docs.getoutline.com",
  },
  summary: {
    vi: "Wiki và tài liệu cho team, giao diện đẹp và nhanh, thay thế Notion với dữ liệu tự host.",
    en: "A fast and beautiful team wiki and documentation tool, a self-hosted Notion alternative.",
  },
  notes: {
    vi: "Cần cấu hình SSO (OIDC hoặc SAML) để đăng nhập. Nên dùng S3-compatible storage cho file uploads.",
    en: "Requires SSO configuration (OIDC or SAML) for login. Use S3-compatible storage for file uploads.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy bằng Docker Compose với PostgreSQL, Redis và S3 storage. Bắt buộc cấu hình SSO.",
      steps: [
        "Cấu hình SSO provider (Authentik, Keycloak, Google, etc.).",
        "Tạo file .env với database, Redis, S3 và SSO settings.",
        "Chạy Docker Compose với Outline, PostgreSQL và Redis.",
        "Truy cập web UI và đăng nhập qua SSO provider.",
        "Tạo collections và mời team members.",
      ],
      backup: "Backup database PostgreSQL và S3 storage chứa uploaded files.",
    },
    en: {
      overview:
        "Run with Docker Compose using PostgreSQL, Redis, and S3 storage. SSO configuration is required.",
      steps: [
        "Configure an SSO provider (Authentik, Keycloak, Google, etc.).",
        "Create .env file with database, Redis, S3, and SSO settings.",
        "Run Docker Compose with Outline, PostgreSQL, and Redis.",
        "Access the web UI and log in through the SSO provider.",
        "Create collections and invite team members.",
      ],
      backup:
        "Back up the PostgreSQL database and S3 storage containing uploaded files.",
    },
  },
  deploySnippets: {
    dockerCompose: `services:
  outline:
    image: outlinewiki/outline:latest
    container_name: outline
    environment:
      DATABASE_URL: "postgres://outline:CHANGEME_db_password@postgres:5432/outline" # CHANGE THIS
      REDIS_URL: "redis://redis:6379"
      URL: "https://docs.example.com"
      SECRET_KEY: "change-me-generate-with-openssl-rand-hex-32" # CHANGE THIS
      UTILS_SECRET: "change-me-generate-with-openssl-rand-hex-32" # CHANGE THIS
      OIDC_CLIENT_ID: "outline"
      OIDC_CLIENT_SECRET: "your-oidc-secret"
      OIDC_AUTH_URI: "https://auth.example.com/authorize"
      OIDC_TOKEN_URI: "https://auth.example.com/token"
      OIDC_USERINFO_URI: "https://auth.example.com/userinfo"
      OIDC_DISPLAY_NAME: "SSO Login"
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: outline_postgres
    environment:
      POSTGRES_USER: outline
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: outline
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: outline_redis
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/outline
sudo chown "$USER":"$USER" /opt/outline
cd /opt/outline

cat > docker-compose.yml <<'COMPOSE'
services:
  outline:
    image: outlinewiki/outline:latest
    container_name: outline
    environment:
      DATABASE_URL: "postgres://outline:CHANGEME_db_password@postgres:5432/outline" # CHANGE THIS
      REDIS_URL: "redis://redis:6379"
      URL: "https://docs.example.com"
      SECRET_KEY: "change-me-generate-with-openssl-rand-hex-32" # CHANGE THIS
      UTILS_SECRET: "change-me-generate-with-openssl-rand-hex-32" # CHANGE THIS
      OIDC_CLIENT_ID: "outline"
      OIDC_CLIENT_SECRET: "your-oidc-secret"
      OIDC_AUTH_URI: "https://auth.example.com/authorize"
      OIDC_TOKEN_URI: "https://auth.example.com/token"
      OIDC_USERINFO_URI: "https://auth.example.com/userinfo"
      OIDC_DISPLAY_NAME: "SSO Login"
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: outline_postgres
    environment:
      POSTGRES_USER: outline
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: outline
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: outline_redis
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Outline is running on http://SERVER_IP:3000"`,
  },
};
export default project;
