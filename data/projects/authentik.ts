import type { Project } from "../types";

const project: Project = {
  slug: "authentik",
  name: "Authentik",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/authentik.svg",
  categorySlug: "security",
  category: "Identity Provider",
  tags: ["sso", "identity", "authentication"],
  stack: ["Python", "TypeScript", "PostgreSQL", "Redis"],
  license: "MIT",
  deploy: "Docker Compose",
  requirements: "2 CPU, 2 GB RAM",
  score: 85,
  links: {
    source: "https://github.com/goauthentik/authentik",
    docs: "https://docs.goauthentik.io",
  },
  summary: {
    vi: "Identity provider và SSO tự host, hỗ trợ SAML, OAuth2, LDAP và nhiều giao thức xác thực.",
    en: "A self-hosted identity provider and SSO supporting SAML, OAuth2, LDAP, and many authentication protocols.",
  },
  notes: {
    vi: "Cần PostgreSQL và Redis. Cấu hình phức tạp hơn các app đơn giản nhưng rất mạnh cho quản lý danh tính tập trung.",
    en: "Requires PostgreSQL and Redis. More complex to configure than simple apps but powerful for centralized identity management.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy bằng Docker Compose với PostgreSQL và Redis. Cần cấu hình domain và secret key đúng.",
      steps: [
        "Tạo file .env với secret key, domain và cấu hình email.",
        "Chạy Docker Compose với Authentik server, worker, PostgreSQL và Redis.",
        "Truy cập web UI tại port 9000, thiết lập mật khẩu admin.",
        "Cấu hình providers (OAuth2, SAML, LDAP) cho từng ứng dụng.",
        "Tạo flows và policies để quản lý xác thực và uỷ quyền.",
      ],
      backup:
        "Backup database PostgreSQL và thư mục media. Redis chỉ lưu cache nên không bắt buộc backup.",
    },
    en: {
      overview:
        "Run with Docker Compose using PostgreSQL and Redis. Domain and secret key must be configured correctly.",
      steps: [
        "Create .env file with secret key, domain, and email configuration.",
        "Run Docker Compose with Authentik server, worker, PostgreSQL, and Redis.",
        "Access the web UI at port 9000 and set the admin password.",
        "Configure providers (OAuth2, SAML, LDAP) for each application.",
        "Create flows and policies to manage authentication and authorization.",
      ],
      backup:
        "Back up the PostgreSQL database and media directory. Redis only stores cache so backup is optional.",
    },
  },
  deploySnippets: {
    dockerCompose: `services:
  authentik-server:
    image: ghcr.io/goauthentik/server:latest
    container_name: authentik_server
    command: server
    environment:
      AUTHENTIK_SECRET_KEY: "change-me-to-a-long-random-string" # CHANGE THIS
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgres
      AUTHENTIK_POSTGRESQL__USER: authentik
      AUTHENTIK_POSTGRESQL__PASSWORD: CHANGEME_db_password # CHANGE THIS
      AUTHENTIK_POSTGRESQL__NAME: authentik
    ports:
      - "9000:9000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  authentik-worker:
    image: ghcr.io/goauthentik/server:latest
    container_name: authentik_worker
    command: worker
    environment:
      AUTHENTIK_SECRET_KEY: "change-me-to-a-long-random-string" # CHANGE THIS
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgres
      AUTHENTIK_POSTGRESQL__USER: authentik
      AUTHENTIK_POSTGRESQL__PASSWORD: CHANGEME_db_password # CHANGE THIS
      AUTHENTIK_POSTGRESQL__NAME: authentik
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: authentik_postgres
    environment:
      POSTGRES_USER: authentik
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: authentik
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: authentik_redis
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/authentik
sudo chown "$USER":"$USER" /opt/authentik
cd /opt/authentik

cat > docker-compose.yml <<'COMPOSE'
services:
  authentik-server:
    image: ghcr.io/goauthentik/server:latest
    container_name: authentik_server
    command: server
    environment:
      AUTHENTIK_SECRET_KEY: "change-me-to-a-long-random-string" # CHANGE THIS
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgres
      AUTHENTIK_POSTGRESQL__USER: authentik
      AUTHENTIK_POSTGRESQL__PASSWORD: CHANGEME_db_password # CHANGE THIS
      AUTHENTIK_POSTGRESQL__NAME: authentik
    ports:
      - "9000:9000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  authentik-worker:
    image: ghcr.io/goauthentik/server:latest
    container_name: authentik_worker
    command: worker
    environment:
      AUTHENTIK_SECRET_KEY: "change-me-to-a-long-random-string" # CHANGE THIS
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgres
      AUTHENTIK_POSTGRESQL__USER: authentik
      AUTHENTIK_POSTGRESQL__PASSWORD: CHANGEME_db_password # CHANGE THIS
      AUTHENTIK_POSTGRESQL__NAME: authentik
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: authentik_postgres
    environment:
      POSTGRES_USER: authentik
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: authentik
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: authentik_redis
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Authentik is running on http://SERVER_IP:9000"`,
  },
};
export default project;
