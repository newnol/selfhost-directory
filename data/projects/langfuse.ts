import type { Project } from "../types";

const project: Project = {
  slug: "langfuse",
  name: "Langfuse",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/langfuse.svg",
  categorySlug: "ai",
  category: "LLM Observability",
  tags: ["llm", "observability", "tracing"],
  stack: ["TypeScript", "PostgreSQL", "Docker"],
  license: "MIT",
  deploy: "Docker Compose",
  requirements: "2 CPU, 2 GB RAM",
  score: 80,
  links: {
    source: "https://github.com/langfuse/langfuse",
    docs: "https://langfuse.com/docs",
    demo: "https://cloud.langfuse.com",
  },
  summary: {
    vi: "Công cụ observability cho LLM, theo dõi traces, chi phí và chất lượng của ứng dụng AI.",
    en: "An LLM observability tool for tracing, cost tracking, and quality monitoring of AI applications.",
  },
  notes: {
    vi: "Nên chạy cùng PostgreSQL riêng. Tích hợp bằng SDK vào ứng dụng AI để gửi traces.",
    en: "Run with a dedicated PostgreSQL instance. Integrate via SDK into AI applications to send traces.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy bằng Docker Compose với PostgreSQL. Tích hợp SDK vào ứng dụng để bắt đầu thu thập traces.",
      steps: [
        "Tạo file docker-compose với Langfuse và PostgreSQL.",
        "Cấu hình biến môi trường: database, secret key và domain.",
        "Chạy Docker Compose và truy cập web UI.",
        "Tạo project và lấy API keys.",
        "Tích hợp Langfuse SDK vào ứng dụng AI để gửi traces.",
      ],
      backup:
        "Backup database PostgreSQL chứa toàn bộ traces và project settings.",
    },
    en: {
      overview:
        "Run with Docker Compose using PostgreSQL. Integrate the SDK into applications to collect traces.",
      steps: [
        "Create docker-compose file with Langfuse and PostgreSQL.",
        "Configure environment variables: database, secret key, and domain.",
        "Run Docker Compose and access the web UI.",
        "Create a project and obtain API keys.",
        "Integrate Langfuse SDK into AI applications to send traces.",
      ],
      backup:
        "Back up the PostgreSQL database containing all traces and project settings.",
    },
  },
  deploySnippets: {
    dockerCompose: `services:
  langfuse:
    image: langfuse/langfuse:latest
    container_name: langfuse
    environment:
      DATABASE_URL: "postgresql://langfuse:CHANGEME_db_password@postgres:5432/langfuse" # CHANGE THIS
      NEXTAUTH_URL: "http://SERVER_IP:3000"
      NEXTAUTH_SECRET: "change-me-generate-with-openssl-rand-base64-32" # CHANGE THIS
      SALT: "change-me-generate-with-openssl-rand-base64-32" # CHANGE THIS
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: langfuse_postgres
    environment:
      POSTGRES_USER: langfuse
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: langfuse
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/langfuse
sudo chown "$USER":"$USER" /opt/langfuse
cd /opt/langfuse

cat > docker-compose.yml <<'COMPOSE'
services:
  langfuse:
    image: langfuse/langfuse:latest
    container_name: langfuse
    environment:
      DATABASE_URL: "postgresql://langfuse:CHANGEME_db_password@postgres:5432/langfuse" # CHANGE THIS
      NEXTAUTH_URL: "http://SERVER_IP:3000"
      NEXTAUTH_SECRET: "change-me-generate-with-openssl-rand-base64-32" # CHANGE THIS
      SALT: "change-me-generate-with-openssl-rand-base64-32" # CHANGE THIS
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: langfuse_postgres
    environment:
      POSTGRES_USER: langfuse
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: langfuse
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Langfuse is running on http://SERVER_IP:3000"`,
  },
};
export default project;
