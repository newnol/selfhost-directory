import type { Locale } from "@/lib/i18n";

export type Project = {
  slug: string;
  name: string;
  iconUrl: string;
  categorySlug: string;
  category: string;
  tags: string[];
  stack: string[];
  license: string;
  deploy: "Docker" | "Docker Compose" | "Helm" | "Binary";
  requirements: string;
  score: number;
  links: {
    source: string;
    docs: string;
    demo?: string;
  };
  summary: Record<Locale, string>;
  notes: Record<Locale, string>;
  deployGuide: Record<
    Locale,
    {
      overview: string;
      steps: string[];
      backup: string;
    }
  >;
  deploySnippets: {
    dockerCompose: string;
    setupScript: string;
  };
};

export type Category = {
  slug: string;
  icon: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const categories: Category[] = [
  {
    slug: "media",
    icon: "\uD83C\uDFAC",
    title: { vi: "Media & cá nhân", en: "Media & personal" },
    description: {
      vi: "Ảnh, video, file cá nhân và các dịch vụ thay thế cloud consumer.",
      en: "Photos, videos, personal files, and consumer cloud replacements."
    }
  },
  {
    slug: "monitoring",
    icon: "\uD83D\uDCCA",
    title: { vi: "Monitoring & vận hành", en: "Monitoring & operations" },
    description: {
      vi: "Theo dõi uptime, cảnh báo, status page và công cụ vận hành VPS.",
      en: "Uptime checks, alerts, status pages, and VPS operations tools."
    }
  },
  {
    slug: "security",
    icon: "\uD83D\uDD12",
    title: { vi: "Bảo mật", en: "Security" },
    description: {
      vi: "Quản lý mật khẩu, secrets, danh tính và hardening hệ thống.",
      en: "Password managers, secrets, identity, and system hardening."
    }
  },
  {
    slug: "data-tools",
    icon: "\uD83D\uDDC4\uFE0F",
    title: { vi: "Data & internal tools", en: "Data & internal tools" },
    description: {
      vi: "Database UI, no-code tools, automation và app nội bộ.",
      en: "Database UIs, no-code tools, automation, and internal apps."
    }
  },
  {
    slug: "productivity",
    icon: "\u2705",
    title: { vi: "Productivity & team", en: "Productivity & team" },
    description: {
      vi: "Quản lý dự án, tài liệu, wiki và workflow cho team nhỏ.",
      en: "Project management, docs, wikis, and workflows for small teams."
    }
  },
  {
    slug: "ai",
    icon: "\uD83E\uDD16",
    title: { vi: "AI & LLM", en: "AI & LLM" },
    description: {
      vi: "Giao diện AI, LLM gateway, model local và công cụ AI tự host.",
      en: "AI chat UIs, LLM gateways, local models, and self-hosted AI tools."
    }
  }
];

export const projects: Project[] = [
  {
    slug: "immich",
    name: "Immich",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/immich.svg",
    categorySlug: "media",
    category: "Photos",
    tags: ["google-photos", "media", "backup"],
    stack: ["TypeScript", "PostgreSQL", "Redis", "Docker"],
    license: "AGPL-3.0",
    deploy: "Docker Compose",
    requirements: "2 CPU, 4 GB RAM, SSD storage",
    score: 92,
    links: {
      source: "https://github.com/immich-app/immich",
      docs: "https://immich.app/docs/overview/introduction",
      demo: "https://demo.immich.app"
    },
    summary: {
      vi: "Thư viện ảnh tự host, phù hợp để thay Google Photos cho cá nhân hoặc gia đình.",
      en: "A self-hosted photo and video backup app, suitable as a Google Photos alternative."
    },
    notes: {
      vi: "Nên chạy bằng Docker Compose chính thức, chuẩn bị dung lượng lưu trữ và chiến lược backup trước khi import ảnh lớn.",
      en: "Use the official Docker Compose setup and plan storage plus backups before importing a large photo library."
    },
    deployGuide: {
      vi: {
        overview: "Triển khai bằng Docker Compose chính thức, ưu tiên máy có SSD và backup ổn định.",
        steps: [
          "Tạo thư mục app, tải file compose và `.env` từ tài liệu Immich.",
          "Cấu hình `UPLOAD_LOCATION`, `DB_PASSWORD` và domain public nếu dùng reverse proxy.",
          "Chạy `docker compose up -d`, mở web UI, tạo tài khoản admin đầu tiên.",
          "Đặt Caddy/Nginx phía trước với HTTPS nếu public ra internet.",
          "Import ảnh theo từng đợt nhỏ và theo dõi dung lượng storage."
        ],
        backup: "Backup thư mục upload và database PostgreSQL. Không chỉ backup container image."
      },
      en: {
        overview: "Deploy with the official Docker Compose stack, preferably on SSD-backed storage with planned backups.",
        steps: [
          "Create an app directory, then download the official compose and `.env` files.",
          "Configure `UPLOAD_LOCATION`, `DB_PASSWORD`, and the public domain if using a reverse proxy.",
          "Run `docker compose up -d`, open the web UI, and create the first admin account.",
          "Put Caddy or Nginx in front with HTTPS before exposing it publicly.",
          "Import photos in batches and monitor storage growth."
        ],
        backup: "Back up the upload directory and PostgreSQL database. Container images are not enough."
      }
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
echo "Immich is running on http://SERVER_IP:2283"`
    }
  },
  {
    slug: "uptime-kuma",
    name: "Uptime Kuma",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg",
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
      demo: "https://demo.uptime.kuma.pet"
    },
    summary: {
      vi: "Theo dõi uptime, latency và tạo status page cho website, API hoặc VPS.",
      en: "Monitor uptime, latency, and status pages for websites, APIs, and VPS services."
    },
    notes: {
      vi: "Rất nhẹ, dễ cài, hợp làm project self-host đầu tiên. Nhớ backup file SQLite hoặc volume Docker.",
      en: "Lightweight and beginner-friendly. Back up the SQLite database or Docker volume regularly."
    },
    deployGuide: {
      vi: {
        overview: "Cài nhanh bằng một container Docker, phù hợp để chạy trên VPS nhỏ.",
        steps: [
          "Tạo Docker volume riêng cho dữ liệu Uptime Kuma.",
          "Chạy container và map port nội bộ, ví dụ `3001:3001`.",
          "Tạo user admin trong lần mở đầu tiên.",
          "Thêm monitor HTTP/TCP/Ping cho website, API và dịch vụ quan trọng.",
          "Cấu hình notification qua Telegram, Discord, email hoặc webhook."
        ],
        backup: "Backup volume `/app/data`, đặc biệt file SQLite chứa monitor và cấu hình alert."
      },
      en: {
        overview: "Run it as a single Docker container, ideal for a small VPS.",
        steps: [
          "Create a dedicated Docker volume for Uptime Kuma data.",
          "Run the container and map the internal port, for example `3001:3001`.",
          "Create the admin user on first launch.",
          "Add HTTP, TCP, or Ping monitors for important websites, APIs, and services.",
          "Configure notifications via Telegram, Discord, email, or webhook."
        ],
        backup: "Back up the `/app/data` volume, especially the SQLite file with monitors and alert settings."
      }
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
echo "Uptime Kuma is running on http://SERVER_IP:3001"`
    }
  },
  {
    slug: "vaultwarden",
    name: "Vaultwarden",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/vaultwarden.svg",
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
      docs: "https://github.com/dani-garcia/vaultwarden/wiki"
    },
    summary: {
      vi: "Server Bitwarden-compatible nhẹ, phổ biến cho cá nhân và team nhỏ.",
      en: "A lightweight Bitwarden-compatible server for personal use and small teams."
    },
    notes: {
      vi: "Nên bật HTTPS, cấu hình domain rõ ràng, backup database, và cân nhắc tắt đăng ký công khai.",
      en: "Run behind HTTPS, configure the domain carefully, back up the database, and consider disabling open signups."
    },
    deployGuide: {
      vi: {
        overview: "Triển khai container nhẹ, nhưng phải coi đây là dịch vụ nhạy cảm và bảo mật kỹ.",
        steps: [
          "Tạo volume riêng để lưu database và attachments.",
          "Chạy container Vaultwarden phía sau reverse proxy có HTTPS.",
          "Đặt `DOMAIN` đúng URL public để email và client hoạt động ổn định.",
          "Tắt đăng ký công khai bằng `SIGNUPS_ALLOWED=false` sau khi tạo user.",
          "Bật 2FA cho tài khoản và giới hạn truy cập admin token."
        ],
        backup: "Backup volume dữ liệu thường xuyên và kiểm tra restore định kỳ vì đây là kho mật khẩu."
      },
      en: {
        overview: "Deploy as a lightweight container, but treat it as a sensitive service with strict security.",
        steps: [
          "Create a dedicated volume for the database and attachments.",
          "Run Vaultwarden behind a reverse proxy with HTTPS.",
          "Set `DOMAIN` to the correct public URL so emails and clients work reliably.",
          "Disable open signup with `SIGNUPS_ALLOWED=false` after creating users.",
          "Enable 2FA and tightly restrict admin token access."
        ],
        backup: "Back up the data volume regularly and test restores because this stores passwords."
      }
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
echo "Vaultwarden is running on http://SERVER_IP:8080"`
    }
  },
  {
    slug: "nocodb",
    name: "NocoDB",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/nocodb.svg",
    categorySlug: "data-tools",
    category: "Database UI",
    tags: ["airtable", "database", "no-code"],
    stack: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
    license: "AGPL-3.0",
    deploy: "Docker Compose",
    requirements: "1-2 CPU, 1 GB RAM",
    score: 84,
    links: {
      source: "https://github.com/nocodb/nocodb",
      docs: "https://docs.nocodb.com",
      demo: "https://app.nocodb.com"
    },
    summary: {
      vi: "Giao diện bảng tính/no-code trên database, thường dùng như lựa chọn thay Airtable.",
      en: "A spreadsheet-like no-code interface on top of databases, often used as an Airtable alternative."
    },
    notes: {
      vi: "Phù hợp quản lý dữ liệu vận hành nhẹ. Với production nên dùng PostgreSQL thay vì SQLite.",
      en: "Good for lightweight operational data. Prefer PostgreSQL over SQLite in production."
    },
    deployGuide: {
      vi: {
        overview: "Nên chạy bằng Docker Compose với PostgreSQL riêng cho production nhỏ.",
        steps: [
          "Tạo database PostgreSQL cho NocoDB hoặc dùng managed Postgres.",
          "Cấu hình biến `NC_DB` theo connection string của database.",
          "Chạy container NocoDB và đặt reverse proxy/HTTPS.",
          "Tạo workspace đầu tiên, kết nối database nguồn nếu cần.",
          "Phân quyền user trước khi đưa team vào dùng."
        ],
        backup: "Backup database NocoDB và các database nguồn mà NocoDB kết nối tới."
      },
      en: {
        overview: "Use Docker Compose with a dedicated PostgreSQL database for small production deployments.",
        steps: [
          "Create a PostgreSQL database for NocoDB or use managed Postgres.",
          "Configure `NC_DB` with the database connection string.",
          "Run the NocoDB container behind HTTPS.",
          "Create the first workspace and connect source databases if needed.",
          "Set user permissions before inviting the team."
        ],
        backup: "Back up the NocoDB database and any source databases connected to it."
      }
    },
    deploySnippets: {
      dockerCompose: `services:
  nocodb:
    image: nocodb/nocodb:latest
    container_name: nocodb
    environment:
      NC_DB: "pg://postgres:5432?u=nocodb&p=CHANGEME_db_password&d=nocodb" # CHANGE THIS
    volumes:
      - ./data:/usr/app/data
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: nocodb_postgres
    environment:
      POSTGRES_USER: nocodb
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: nocodb
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped`,
      setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/nocodb
sudo chown "$USER":"$USER" /opt/nocodb
cd /opt/nocodb

cat > docker-compose.yml <<'COMPOSE'
services:
  nocodb:
    image: nocodb/nocodb:latest
    container_name: nocodb
    environment:
      NC_DB: "pg://postgres:5432?u=nocodb&p=CHANGEME_db_password&d=nocodb" # CHANGE THIS
    volumes:
      - ./data:/usr/app/data
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: nocodb_postgres
    environment:
      POSTGRES_USER: nocodb
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: nocodb
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "NocoDB is running on http://SERVER_IP:8080"`
    }
  },
  {
    slug: "plane",
    name: "Plane",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/plane.svg",
    categorySlug: "productivity",
    category: "Project Management",
    tags: ["linear", "jira", "issues"],
    stack: ["TypeScript", "Python", "PostgreSQL", "Redis"],
    license: "AGPL-3.0",
    deploy: "Docker Compose",
    requirements: "2 CPU, 4 GB RAM",
    score: 82,
    links: {
      source: "https://github.com/makeplane/plane",
      docs: "https://docs.plane.so"
    },
    summary: {
      vi: "Quản lý issue, sprint và roadmap, phù hợp thay Linear/Jira cho team nhỏ.",
      en: "Issue, sprint, and roadmap management, suitable as a Linear or Jira alternative for small teams."
    },
    notes: {
      vi: "Nhiều service hơn các app nhỏ, nên kiểm tra tài nguyên VPS và backup database định kỳ.",
      en: "It runs more services than small apps, so check VPS resources and schedule database backups."
    },
    deployGuide: {
      vi: {
        overview: "Plane cần nhiều service hơn, nên dùng Docker Compose chính thức và VPS tối thiểu 4 GB RAM.",
        steps: [
          "Clone repo hoặc tải bundle self-hosted chính thức.",
          "Cấu hình `.env` gồm domain, secret key, database, Redis và object storage nếu dùng.",
          "Chạy migration/setup theo tài liệu trước khi mở cho user.",
          "Đặt reverse proxy HTTPS cho web và API.",
          "Tạo workspace, kiểm tra email/invite nếu bật tính năng mời thành viên."
        ],
        backup: "Backup PostgreSQL, Redis nếu có dữ liệu queue quan trọng, và object storage attachments."
      },
      en: {
        overview: "Plane runs multiple services, so use the official Docker Compose setup and at least 4 GB RAM.",
        steps: [
          "Clone the repo or download the official self-hosted bundle.",
          "Configure `.env` for domain, secrets, database, Redis, and object storage if used.",
          "Run migrations/setup from the docs before inviting users.",
          "Put HTTPS reverse proxy in front of the web and API services.",
          "Create a workspace and verify email/invite flows if enabled."
        ],
        backup: "Back up PostgreSQL, Redis if queue state matters, and object storage attachments."
      }
    },
    deploySnippets: {
      dockerCompose: `services:
  plane:
    image: makeplane/plane-frontend:stable
    container_name: plane_frontend
    ports:
      - "3000:3000"
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: plane_postgres
    environment:
      POSTGRES_USER: plane
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: plane
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: plane_redis
    restart: unless-stopped`,
      setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/plane
sudo chown "$USER":"$USER" /opt/plane
cd /opt/plane

cat > docker-compose.yml <<'COMPOSE'
services:
  plane:
    image: makeplane/plane-frontend:stable
    container_name: plane_frontend
    ports:
      - "3000:3000"
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: plane_postgres
    environment:
      POSTGRES_USER: plane
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: plane
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: plane_redis
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Plane starter stack is running on http://SERVER_IP:3000"`
    }
  },
  {
    slug: "open-webui",
    name: "Open WebUI",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/open-webui.svg",
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
      docs: "https://docs.openwebui.com"
    },
    summary: {
      vi: "Giao diện chat AI tự host, dùng được với Ollama hoặc nhiều provider LLM.",
      en: "A self-hosted AI chat interface for Ollama and multiple LLM providers."
    },
    notes: {
      vi: "Nếu chạy model local, tài nguyên phụ thuộc vào model/GPU. Nếu chỉ gọi API ngoài thì VPS nhỏ vẫn ổn.",
      en: "Local models depend on model size and GPU. For external APIs, a small VPS is usually enough."
    },
    deployGuide: {
      vi: {
        overview: "Có thể chạy một container đơn giản, hoặc ghép với Ollama/LiteLLM nếu muốn hệ AI đầy đủ hơn.",
        steps: [
          "Chọn backend: Ollama local, LiteLLM gateway, hoặc API provider bên ngoài.",
          "Chạy container Open WebUI với volume `/app/backend/data`.",
          "Cấu hình biến môi trường cho provider hoặc endpoint Ollama/LiteLLM.",
          "Tạo admin user đầu tiên và kiểm tra quyền đăng ký.",
          "Đặt HTTPS nếu cho team truy cập từ internet."
        ],
        backup: "Backup volume backend data và database nếu chuyển sang PostgreSQL."
      },
      en: {
        overview: "Run it as a single container, or pair it with Ollama/LiteLLM for a fuller AI stack.",
        steps: [
          "Choose a backend: local Ollama, LiteLLM gateway, or external API provider.",
          "Run Open WebUI with a persistent `/app/backend/data` volume.",
          "Configure environment variables for the provider or Ollama/LiteLLM endpoint.",
          "Create the first admin user and review signup permissions.",
          "Put HTTPS in front if a team will access it from the internet."
        ],
        backup: "Back up the backend data volume and database if you move to PostgreSQL."
      }
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
echo "Open WebUI is running on http://SERVER_IP:3000"`
    }
  },
  {
    slug: "jellyfin",
    name: "Jellyfin",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/jellyfin.svg",
    categorySlug: "media",
    category: "Media Server",
    tags: ["plex", "media", "streaming"],
    stack: ["C#", "Docker"],
    license: "GPL-2.0",
    deploy: "Docker",
    requirements: "2 CPU, 2 GB RAM",
    score: 89,
    links: {
      source: "https://github.com/jellyfin/jellyfin",
      docs: "https://jellyfin.org/docs/",
      demo: "https://demo.jellyfin.org/web/"
    },
    summary: {
      vi: "Media server mã nguồn mở, phát phim, nhạc và ảnh cá nhân thay cho Plex.",
      en: "A free and open-source media server for streaming movies, music, and photos as a Plex alternative."
    },
    notes: {
      vi: "Hỗ trợ hardware transcoding với GPU. Nên mount thư mục media riêng và cấu hình thư viện trước khi mời người dùng.",
      en: "Supports hardware transcoding with GPU. Mount media directories separately and configure libraries before inviting users."
    },
    deployGuide: {
      vi: {
        overview: "Chạy một container Docker duy nhất, mount thư mục media và cấu hình transcoding nếu cần.",
        steps: [
          "Tạo thư mục lưu trữ media (phim, nhạc, ảnh) trên host.",
          "Chạy container Jellyfin với volume mount cho media và config.",
          "Mở web UI, tạo tài khoản admin và cấu hình thư viện media.",
          "Bật hardware transcoding trong Settings nếu có GPU.",
          "Đặt reverse proxy HTTPS nếu truy cập từ internet."
        ],
        backup: "Backup thư mục config chứa database và metadata. Media files nên có backup riêng."
      },
      en: {
        overview: "Run a single Docker container, mount media directories, and configure transcoding if needed.",
        steps: [
          "Create media storage directories (movies, music, photos) on the host.",
          "Run the Jellyfin container with volume mounts for media and config.",
          "Open the web UI, create an admin account, and configure media libraries.",
          "Enable hardware transcoding in Settings if a GPU is available.",
          "Put an HTTPS reverse proxy in front for internet access."
        ],
        backup: "Back up the config directory containing the database and metadata. Media files need separate backup."
      }
    },
    deploySnippets: {
      dockerCompose: `services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    volumes:
      - ./config:/config
      - ./cache:/cache
      - /path/to/media:/media:ro
    ports:
      - "8096:8096"
    environment:
      JELLYFIN_PublishedServerUrl: "http://SERVER_IP:8096"
    restart: unless-stopped`,
      setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/jellyfin
sudo chown "$USER":"$USER" /opt/jellyfin
cd /opt/jellyfin

cat > docker-compose.yml <<'COMPOSE'
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    volumes:
      - ./config:/config
      - ./cache:/cache
      - /path/to/media:/media:ro
    ports:
      - "8096:8096"
    environment:
      JELLYFIN_PublishedServerUrl: "http://SERVER_IP:8096"
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Jellyfin is running on http://SERVER_IP:8096"`
    }
  },
  {
    slug: "nextcloud",
    name: "Nextcloud",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/nextcloud.svg",
    categorySlug: "media",
    category: "File Sync & Share",
    tags: ["google-drive", "dropbox", "files"],
    stack: ["PHP", "PostgreSQL", "Docker"],
    license: "AGPL-3.0",
    deploy: "Docker Compose",
    requirements: "2 CPU, 2 GB RAM",
    score: 86,
    links: {
      source: "https://github.com/nextcloud/server",
      docs: "https://docs.nextcloud.com",
      demo: "https://try.nextcloud.com"
    },
    summary: {
      vi: "Nền tảng đồng bộ và chia sẻ file tự host, thay thế Google Drive và Dropbox với nhiều plugin mở rộng.",
      en: "A self-hosted file sync and share platform, replacing Google Drive and Dropbox with extensive plugin support."
    },
    notes: {
      vi: "Cấu hình PHP và database cần đúng. Sử dụng PostgreSQL cho production, nên đặt cron job và Redis để tăng hiệu năng.",
      en: "PHP and database configuration must be correct. Use PostgreSQL for production, set up cron jobs and Redis for better performance."
    },
    deployGuide: {
      vi: {
        overview: "Chạy bằng Docker Compose với PostgreSQL và Redis. Cần cấu hình domain và trusted_domains đúng.",
        steps: [
          "Tạo thư mục dữ liệu và cấu hình cho Nextcloud.",
          "Chạy Docker Compose với Nextcloud, PostgreSQL và Redis.",
          "Truy cập web UI, tạo tài khoản admin và cấu hình trusted_domains.",
          "Cài đặt cron job (system cron hoặc webcron) để xử lý background tasks.",
          "Đặt reverse proxy HTTPS và cấu hình overwrite.cli.url."
        ],
        backup: "Backup thư mục data, database PostgreSQL và file config.php. Nên test restore định kỳ."
      },
      en: {
        overview: "Run with Docker Compose using PostgreSQL and Redis. Domain and trusted_domains must be configured correctly.",
        steps: [
          "Create data and config directories for Nextcloud.",
          "Run Docker Compose with Nextcloud, PostgreSQL, and Redis.",
          "Access the web UI, create an admin account, and configure trusted_domains.",
          "Set up cron jobs (system cron or webcron) for background tasks.",
          "Put HTTPS reverse proxy in front and configure overwrite.cli.url."
        ],
        backup: "Back up the data directory, PostgreSQL database, and config.php. Test restores regularly."
      }
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
echo "Nextcloud is running on http://SERVER_IP:8080"`
    }
  },
  {
    slug: "grafana",
    name: "Grafana",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/grafana.svg",
    categorySlug: "monitoring",
    category: "Dashboards & Observability",
    tags: ["monitoring", "dashboards", "observability"],
    stack: ["Go", "TypeScript", "Docker"],
    license: "AGPL-3.0",
    deploy: "Docker",
    requirements: "1 CPU, 1 GB RAM",
    score: 91,
    links: {
      source: "https://github.com/grafana/grafana",
      docs: "https://grafana.com/docs/grafana/latest/",
      demo: "https://play.grafana.org"
    },
    summary: {
      vi: "Nền tảng dashboard và observability hàng đầu, kết nối nhiều nguồn dữ liệu để hiển thị metrics, logs và traces.",
      en: "A leading dashboard and observability platform connecting multiple data sources for metrics, logs, and traces."
    },
    notes: {
      vi: "Grafana chỉ là lớp hiển thị, cần kết hợp với Prometheus, Loki hoặc InfluxDB để có dữ liệu. Nên cấu hình authentication và giới hạn quyền.",
      en: "Grafana is only the visualization layer. Pair it with Prometheus, Loki, or InfluxDB for data. Configure authentication and permissions carefully."
    },
    deployGuide: {
      vi: {
        overview: "Chạy một container Docker đơn giản. Kết nối data source sau khi cài đặt.",
        steps: [
          "Tạo thư mục data cho Grafana để lưu dashboards và config.",
          "Chạy container với volume mount và port 3000.",
          "Đăng nhập với admin/admin và đổi mật khẩu ngay lập tức.",
          "Thêm data source (Prometheus, InfluxDB, hoặc khác).",
          "Import hoặc tạo dashboards để hiển thị metrics."
        ],
        backup: "Backup thư mục data và database SQLite (hoặc PostgreSQL nếu dùng). Export dashboards quan trọng ra JSON."
      },
      en: {
        overview: "Run a simple Docker container. Connect data sources after installation.",
        steps: [
          "Create a data directory for Grafana to store dashboards and config.",
          "Run the container with volume mount and port 3000.",
          "Log in with admin/admin and change the password immediately.",
          "Add data sources (Prometheus, InfluxDB, or others).",
          "Import or create dashboards to visualize metrics."
        ],
        backup: "Back up the data directory and SQLite database (or PostgreSQL if used). Export important dashboards as JSON."
      }
    },
    deploySnippets: {
      dockerCompose: `services:
  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    volumes:
      - ./data:/var/lib/grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: "CHANGEME_admin_password" # CHANGE THIS
    restart: unless-stopped`,
      setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/grafana
sudo chown "$USER":"$USER" /opt/grafana
cd /opt/grafana

cat > docker-compose.yml <<'COMPOSE'
services:
  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    volumes:
      - ./data:/var/lib/grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: "CHANGEME_admin_password" # CHANGE THIS
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Grafana is running on http://SERVER_IP:3000"`
    }
  },
  {
    slug: "netdata",
    name: "Netdata",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/netdata.svg",
    categorySlug: "monitoring",
    category: "Real-time Monitoring",
    tags: ["monitoring", "metrics", "real-time"],
    stack: ["C", "Python", "Docker"],
    license: "GPL-3.0",
    deploy: "Docker",
    requirements: "1 CPU, 512 MB RAM",
    score: 87,
    links: {
      source: "https://github.com/netdata/netdata",
      docs: "https://learn.netdata.cloud",
      demo: "https://app.netdata.cloud"
    },
    summary: {
      vi: "Giám sát hiệu năng server theo thời gian thực với hàng nghìn metrics, cài đặt nhanh và nhẹ.",
      en: "Real-time server performance monitoring with thousands of metrics, quick and lightweight to install."
    },
    notes: {
      vi: "Tự động phát hiện dịch vụ và thu thập metrics. Không cần cấu hình nhiều, nhưng nên giới hạn truy cập dashboard nếu public.",
      en: "Auto-discovers services and collects metrics. Minimal configuration needed, but restrict dashboard access if public."
    },
    deployGuide: {
      vi: {
        overview: "Cài đặt bằng một container Docker hoặc script. Tự động thu thập metrics của host.",
        steps: [
          "Chạy container Netdata với quyền truy cập /proc, /sys và Docker socket.",
          "Mở dashboard tại port 19999 để xem metrics real-time.",
          "Cấu hình alarm notifications qua email, Slack hoặc webhook.",
          "Tuỳ chỉnh retention và storage nếu cần lưu metrics lâu hơn.",
          "Giới hạn truy cập bằng firewall hoặc basic auth nếu không dùng Netdata Cloud."
        ],
        backup: "Netdata lưu metrics local. Backup thư mục config và custom dashboards. Metrics có thể tái thu thập."
      },
      en: {
        overview: "Install with a single Docker container or script. Automatically collects host metrics.",
        steps: [
          "Run the Netdata container with access to /proc, /sys, and Docker socket.",
          "Open the dashboard at port 19999 to see real-time metrics.",
          "Configure alarm notifications via email, Slack, or webhook.",
          "Customize retention and storage if you need longer metric history.",
          "Restrict access with firewall or basic auth if not using Netdata Cloud."
        ],
        backup: "Netdata stores metrics locally. Back up config and custom dashboards. Metrics can be re-collected."
      }
    },
    deploySnippets: {
      dockerCompose: `services:
  netdata:
    image: netdata/netdata:stable
    container_name: netdata
    hostname: netdata-server
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    volumes:
      - ./config:/etc/netdata
      - ./lib:/var/lib/netdata
      - ./cache:/var/cache/netdata
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - "19999:19999"
    restart: unless-stopped`,
      setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/netdata
sudo chown "$USER":"$USER" /opt/netdata
cd /opt/netdata

cat > docker-compose.yml <<'COMPOSE'
services:
  netdata:
    image: netdata/netdata:stable
    container_name: netdata
    hostname: netdata-server
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    volumes:
      - ./config:/etc/netdata
      - ./lib:/var/lib/netdata
      - ./cache:/var/cache/netdata
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - "19999:19999"
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Netdata is running on http://SERVER_IP:19999"`
    }
  },
  {
    slug: "authentik",
    name: "Authentik",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/authentik.svg",
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
      docs: "https://docs.goauthentik.io"
    },
    summary: {
      vi: "Identity provider và SSO tự host, hỗ trợ SAML, OAuth2, LDAP và nhiều giao thức xác thực.",
      en: "A self-hosted identity provider and SSO supporting SAML, OAuth2, LDAP, and many authentication protocols."
    },
    notes: {
      vi: "Cần PostgreSQL và Redis. Cấu hình phức tạp hơn các app đơn giản nhưng rất mạnh cho quản lý danh tính tập trung.",
      en: "Requires PostgreSQL and Redis. More complex to configure than simple apps but powerful for centralized identity management."
    },
    deployGuide: {
      vi: {
        overview: "Chạy bằng Docker Compose với PostgreSQL và Redis. Cần cấu hình domain và secret key đúng.",
        steps: [
          "Tạo file .env với secret key, domain và cấu hình email.",
          "Chạy Docker Compose với Authentik server, worker, PostgreSQL và Redis.",
          "Truy cập web UI tại port 9000, thiết lập mật khẩu admin.",
          "Cấu hình providers (OAuth2, SAML, LDAP) cho từng ứng dụng.",
          "Tạo flows và policies để quản lý xác thực và uỷ quyền."
        ],
        backup: "Backup database PostgreSQL và thư mục media. Redis chỉ lưu cache nên không bắt buộc backup."
      },
      en: {
        overview: "Run with Docker Compose using PostgreSQL and Redis. Domain and secret key must be configured correctly.",
        steps: [
          "Create .env file with secret key, domain, and email configuration.",
          "Run Docker Compose with Authentik server, worker, PostgreSQL, and Redis.",
          "Access the web UI at port 9000 and set the admin password.",
          "Configure providers (OAuth2, SAML, LDAP) for each application.",
          "Create flows and policies to manage authentication and authorization."
        ],
        backup: "Back up the PostgreSQL database and media directory. Redis only stores cache so backup is optional."
      }
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
echo "Authentik is running on http://SERVER_IP:9000"`
    }
  },
  {
    slug: "wg-easy",
    name: "WG-Easy",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/wireguard.svg",
    categorySlug: "security",
    category: "VPN",
    tags: ["vpn", "wireguard", "networking"],
    stack: ["Node.js", "Docker"],
    license: "Custom",
    deploy: "Docker",
    requirements: "1 CPU, 256 MB RAM",
    score: 88,
    links: {
      source: "https://github.com/wg-easy/wg-easy",
      docs: "https://github.com/wg-easy/wg-easy/wiki"
    },
    summary: {
      vi: "Giao diện quản lý WireGuard VPN đơn giản, dễ tạo và quản lý client qua web UI.",
      en: "A simple WireGuard VPN management UI for easily creating and managing VPN clients through a web interface."
    },
    notes: {
      vi: "Cần quyền NET_ADMIN và SYS_MODULE. Cấu hình đúng IP public và port UDP 51820 để client kết nối.",
      en: "Requires NET_ADMIN and SYS_MODULE capabilities. Configure the correct public IP and UDP port 51820 for client connections."
    },
    deployGuide: {
      vi: {
        overview: "Chạy một container Docker với quyền đặc biệt để quản lý WireGuard. Cần mở port UDP.",
        steps: [
          "Mở port UDP 51820 trên firewall và router.",
          "Chạy container với cap_add NET_ADMIN và SYS_MODULE.",
          "Cấu hình WG_HOST bằng IP public hoặc domain của server.",
          "Đặt mật khẩu admin qua PASSWORD_HASH.",
          "Tạo client profiles và tải file config hoặc scan QR code."
        ],
        backup: "Backup thư mục config chứa WireGuard keys và client profiles."
      },
      en: {
        overview: "Run a single Docker container with special capabilities for WireGuard management. Open UDP port.",
        steps: [
          "Open UDP port 51820 on the firewall and router.",
          "Run the container with NET_ADMIN and SYS_MODULE capabilities.",
          "Set WG_HOST to the server public IP or domain.",
          "Set admin password via PASSWORD_HASH.",
          "Create client profiles and download config files or scan QR codes."
        ],
        backup: "Back up the config directory containing WireGuard keys and client profiles."
      }
    },
    deploySnippets: {
      dockerCompose: `services:
  wg-easy:
    image: ghcr.io/wg-easy/wg-easy:latest
    container_name: wg-easy
    environment:
      WG_HOST: "YOUR_SERVER_IP"
      PASSWORD_HASH: "$$2y$$10$$your_bcrypt_hash_here"
      WG_DEFAULT_DNS: "1.1.1.1"
    volumes:
      - ./config:/etc/wireguard
    ports:
      - "51820:51820/udp"
      - "51821:51821/tcp"
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
      - net.ipv4.ip_forward=1
    restart: unless-stopped`,
      setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/wg-easy
sudo chown "$USER":"$USER" /opt/wg-easy
cd /opt/wg-easy

cat > docker-compose.yml <<'COMPOSE'
services:
  wg-easy:
    image: ghcr.io/wg-easy/wg-easy:latest
    container_name: wg-easy
    environment:
      WG_HOST: "YOUR_SERVER_IP"
      PASSWORD_HASH: "$$2y$$10$$your_bcrypt_hash_here"
      WG_DEFAULT_DNS: "1.1.1.1"
    volumes:
      - ./config:/etc/wireguard
    ports:
      - "51820:51820/udp"
      - "51821:51821/tcp"
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
      - net.ipv4.ip_forward=1
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "WG-Easy is running on http://SERVER_IP:51821"`
    }
  },
  {
    slug: "n8n",
    name: "n8n",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/n8n.svg",
    categorySlug: "data-tools",
    category: "Workflow Automation",
    tags: ["zapier", "automation", "workflow"],
    stack: ["TypeScript", "Node.js", "PostgreSQL"],
    license: "Sustainable Use License",
    deploy: "Docker Compose",
    requirements: "2 CPU, 2 GB RAM",
    score: 87,
    links: {
      source: "https://github.com/n8n-io/n8n",
      docs: "https://docs.n8n.io",
      demo: "https://demo.n8n.io"
    },
    summary: {
      vi: "Nền tảng tự động hoá workflow tự host, kết nối hàng trăm dịch vụ thay cho Zapier và Make.",
      en: "A self-hosted workflow automation platform connecting hundreds of services as an alternative to Zapier and Make."
    },
    notes: {
      vi: "Sử dụng PostgreSQL cho production thay vì SQLite. Nên đặt queue mode với Redis nếu có nhiều workflow chạy đồng thời.",
      en: "Use PostgreSQL for production instead of SQLite. Enable queue mode with Redis for many concurrent workflows."
    },
    deployGuide: {
      vi: {
        overview: "Chạy bằng Docker Compose với PostgreSQL. Có thể thêm Redis cho queue mode.",
        steps: [
          "Tạo thư mục dữ liệu và file docker-compose.",
          "Cấu hình PostgreSQL làm database chính.",
          "Chạy container n8n với volume cho workflows và credentials.",
          "Tạo tài khoản admin và bắt đầu tạo workflows.",
          "Đặt webhook URL đúng nếu sử dụng webhook triggers."
        ],
        backup: "Backup database PostgreSQL và thư mục .n8n chứa credentials đã mã hoá."
      },
      en: {
        overview: "Run with Docker Compose using PostgreSQL. Optionally add Redis for queue mode.",
        steps: [
          "Create data directory and docker-compose file.",
          "Configure PostgreSQL as the main database.",
          "Run the n8n container with volumes for workflows and credentials.",
          "Create an admin account and start building workflows.",
          "Set the correct webhook URL if using webhook triggers."
        ],
        backup: "Back up the PostgreSQL database and .n8n directory containing encrypted credentials."
      }
    },
    deploySnippets: {
      dockerCompose: `services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: CHANGEME_db_password # CHANGE THIS
      N8N_HOST: "n8n.example.com"
      WEBHOOK_URL: "https://n8n.example.com/"
    volumes:
      - ./data:/home/node/.n8n
    ports:
      - "5678:5678"
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: n8n_postgres
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: n8n
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped`,
      setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/n8n
sudo chown "$USER":"$USER" /opt/n8n
cd /opt/n8n

cat > docker-compose.yml <<'COMPOSE'
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: CHANGEME_db_password # CHANGE THIS
      N8N_HOST: "n8n.example.com"
      WEBHOOK_URL: "https://n8n.example.com/"
    volumes:
      - ./data:/home/node/.n8n
    ports:
      - "5678:5678"
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: n8n_postgres
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: n8n
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "n8n is running on http://SERVER_IP:5678"`
    }
  },
  {
    slug: "metabase",
    name: "Metabase",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/metabase.svg",
    categorySlug: "data-tools",
    category: "Business Intelligence",
    tags: ["analytics", "bi", "dashboards"],
    stack: ["Clojure", "Java", "Docker"],
    license: "AGPL-3.0",
    deploy: "Docker",
    requirements: "2 CPU, 2 GB RAM",
    score: 88,
    links: {
      source: "https://github.com/metabase/metabase",
      docs: "https://www.metabase.com/docs/latest/",
      demo: "https://www.metabase.com/demo"
    },
    summary: {
      vi: "Công cụ business intelligence tự host, tạo biểu đồ và dashboard từ database mà không cần viết code.",
      en: "A self-hosted business intelligence tool for creating charts and dashboards from databases without writing code."
    },
    notes: {
      vi: "Mặc định dùng H2 embedded database. Nên chuyển sang PostgreSQL cho production để đảm bảo ổn định.",
      en: "Defaults to H2 embedded database. Switch to PostgreSQL for production stability."
    },
    deployGuide: {
      vi: {
        overview: "Chạy một container Docker đơn giản. Nên dùng PostgreSQL làm metabase database cho production.",
        steps: [
          "Tạo thư mục dữ liệu cho Metabase.",
          "Chạy container với biến môi trường cấu hình database backend.",
          "Truy cập web UI tại port 3000 và hoàn thành setup wizard.",
          "Kết nối data sources (PostgreSQL, MySQL, etc.) để truy vấn.",
          "Tạo questions và dashboards, phân quyền cho team."
        ],
        backup: "Backup Metabase application database (PostgreSQL). Dashboards và questions đều nằm trong database này."
      },
      en: {
        overview: "Run a simple Docker container. Use PostgreSQL as the Metabase application database for production.",
        steps: [
          "Create a data directory for Metabase.",
          "Run the container with environment variables for database backend.",
          "Access the web UI at port 3000 and complete the setup wizard.",
          "Connect data sources (PostgreSQL, MySQL, etc.) for querying.",
          "Create questions and dashboards, set permissions for the team."
        ],
        backup: "Back up the Metabase application database (PostgreSQL). All dashboards and questions are stored there."
      }
    },
    deploySnippets: {
      dockerCompose: `services:
  metabase:
    image: metabase/metabase:latest
    container_name: metabase
    environment:
      MB_DB_TYPE: postgres
      MB_DB_HOST: postgres
      MB_DB_PORT: "5432"
      MB_DB_DBNAME: metabase
      MB_DB_USER: metabase
      MB_DB_PASS: CHANGEME_db_password # CHANGE THIS
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: metabase_postgres
    environment:
      POSTGRES_USER: metabase
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: metabase
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped`,
      setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/metabase
sudo chown "$USER":"$USER" /opt/metabase
cd /opt/metabase

cat > docker-compose.yml <<'COMPOSE'
services:
  metabase:
    image: metabase/metabase:latest
    container_name: metabase
    environment:
      MB_DB_TYPE: postgres
      MB_DB_HOST: postgres
      MB_DB_PORT: "5432"
      MB_DB_DBNAME: metabase
      MB_DB_USER: metabase
      MB_DB_PASS: CHANGEME_db_password # CHANGE THIS
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: metabase_postgres
    environment:
      POSTGRES_USER: metabase
      POSTGRES_PASSWORD: CHANGEME_db_password # CHANGE THIS
      POSTGRES_DB: metabase
    volumes:
      - ./postgres:/var/lib/postgresql/data
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Metabase is running on http://SERVER_IP:3000"`
    }
  },
  {
    slug: "outline",
    name: "Outline",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/outline.svg",
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
      docs: "https://docs.getoutline.com"
    },
    summary: {
      vi: "Wiki và tài liệu cho team, giao diện đẹp và nhanh, thay thế Notion với dữ liệu tự host.",
      en: "A fast and beautiful team wiki and documentation tool, a self-hosted Notion alternative."
    },
    notes: {
      vi: "Cần cấu hình SSO (OIDC hoặc SAML) để đăng nhập. Nên dùng S3-compatible storage cho file uploads.",
      en: "Requires SSO configuration (OIDC or SAML) for login. Use S3-compatible storage for file uploads."
    },
    deployGuide: {
      vi: {
        overview: "Chạy bằng Docker Compose với PostgreSQL, Redis và S3 storage. Bắt buộc cấu hình SSO.",
        steps: [
          "Cấu hình SSO provider (Authentik, Keycloak, Google, etc.).",
          "Tạo file .env với database, Redis, S3 và SSO settings.",
          "Chạy Docker Compose với Outline, PostgreSQL và Redis.",
          "Truy cập web UI và đăng nhập qua SSO provider.",
          "Tạo collections và mời team members."
        ],
        backup: "Backup database PostgreSQL và S3 storage chứa uploaded files."
      },
      en: {
        overview: "Run with Docker Compose using PostgreSQL, Redis, and S3 storage. SSO configuration is required.",
        steps: [
          "Configure an SSO provider (Authentik, Keycloak, Google, etc.).",
          "Create .env file with database, Redis, S3, and SSO settings.",
          "Run Docker Compose with Outline, PostgreSQL, and Redis.",
          "Access the web UI and log in through the SSO provider.",
          "Create collections and invite team members."
        ],
        backup: "Back up the PostgreSQL database and S3 storage containing uploaded files."
      }
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
echo "Outline is running on http://SERVER_IP:3000"`
    }
  },
  {
    slug: "vikunja",
    name: "Vikunja",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/vikunja.svg",
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
      demo: "https://try.vikunja.io"
    },
    summary: {
      vi: "Ứng dụng quản lý công việc tự host, hỗ trợ kanban, list và calendar, thay thế Todoist.",
      en: "A self-hosted task management app with kanban, list, and calendar views as a Todoist alternative."
    },
    notes: {
      vi: "Nhẹ và nhanh, phù hợp cho cá nhân hoặc team nhỏ. Có thể dùng SQLite cho đơn giản hoặc PostgreSQL cho production.",
      en: "Lightweight and fast, suitable for individuals or small teams. Use SQLite for simplicity or PostgreSQL for production."
    },
    deployGuide: {
      vi: {
        overview: "Chạy một container Docker duy nhất, frontend và API gộp trong một binary.",
        steps: [
          "Tạo thư mục dữ liệu cho Vikunja.",
          "Chạy container với volume mount cho database và files.",
          "Truy cập web UI và tạo tài khoản đầu tiên.",
          "Cấu hình mailer nếu muốn gửi email thông báo.",
          "Tạo projects, tasks và mời cộng tác viên."
        ],
        backup: "Backup file database (SQLite hoặc PostgreSQL) và thư mục files chứa attachments."
      },
      en: {
        overview: "Run a single Docker container with frontend and API bundled in one binary.",
        steps: [
          "Create a data directory for Vikunja.",
          "Run the container with volume mounts for database and files.",
          "Access the web UI and create the first account.",
          "Configure mailer if email notifications are needed.",
          "Create projects, tasks, and invite collaborators."
        ],
        backup: "Back up the database file (SQLite or PostgreSQL) and files directory containing attachments."
      }
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
echo "Vikunja is running on http://SERVER_IP:3456"`
    }
  },
  {
    slug: "ollama",
    name: "Ollama",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/ollama.svg",
    categorySlug: "ai",
    category: "Local LLM",
    tags: ["llm", "ai", "local"],
    stack: ["Go", "Docker"],
    license: "MIT",
    deploy: "Docker",
    requirements: "2 CPU, 4 GB RAM (depends on model)",
    score: 90,
    links: {
      source: "https://github.com/ollama/ollama",
      docs: "https://ollama.com/library"
    },
    summary: {
      vi: "Chạy các mô hình LLM trên máy local hoặc server riêng, hỗ trợ nhiều model như Llama, Mistral, Gemma.",
      en: "Run LLM models locally on your own machine or server, supporting models like Llama, Mistral, and Gemma."
    },
    notes: {
      vi: "Tài nguyên phụ thuộc vào kích thước model. Model 7B cần tối thiểu 8 GB RAM. GPU giúp tăng tốc đáng kể.",
      en: "Resource requirements depend on model size. 7B models need at least 8 GB RAM. GPU significantly improves speed."
    },
    deployGuide: {
      vi: {
        overview: "Chạy một container Docker đơn giản. Tải model sau khi khởi động.",
        steps: [
          "Chạy container Ollama với volume lưu trữ models.",
          "Tải model đầu tiên bằng lệnh `ollama pull llama3.2`.",
          "Test bằng `ollama run llama3.2` hoặc gọi API tại port 11434.",
          "Kết hợp với Open WebUI để có giao diện chat.",
          "Cấu hình GPU passthrough nếu có NVIDIA GPU."
        ],
        backup: "Models có thể tải lại. Backup thư mục cấu hình nếu có custom Modelfiles."
      },
      en: {
        overview: "Run a simple Docker container. Pull models after startup.",
        steps: [
          "Run the Ollama container with a volume for model storage.",
          "Pull the first model with `ollama pull llama3.2`.",
          "Test with `ollama run llama3.2` or call the API at port 11434.",
          "Pair with Open WebUI for a chat interface.",
          "Configure GPU passthrough if an NVIDIA GPU is available."
        ],
        backup: "Models can be re-downloaded. Back up the config directory if you have custom Modelfiles."
      }
    },
    deploySnippets: {
      dockerCompose: `services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    volumes:
      - ./models:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped`,
      setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/ollama
sudo chown "$USER":"$USER" /opt/ollama
cd /opt/ollama

cat > docker-compose.yml <<'COMPOSE'
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    volumes:
      - ./models:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Ollama is running on http://SERVER_IP:11434"
echo "Pull a model with: docker exec ollama ollama pull llama3.2"`
    }
  },
  {
    slug: "langfuse",
    name: "Langfuse",
    iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/langfuse.svg",
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
      demo: "https://cloud.langfuse.com"
    },
    summary: {
      vi: "Công cụ observability cho LLM, theo dõi traces, chi phí và chất lượng của ứng dụng AI.",
      en: "An LLM observability tool for tracing, cost tracking, and quality monitoring of AI applications."
    },
    notes: {
      vi: "Nên chạy cùng PostgreSQL riêng. Tích hợp bằng SDK vào ứng dụng AI để gửi traces.",
      en: "Run with a dedicated PostgreSQL instance. Integrate via SDK into AI applications to send traces."
    },
    deployGuide: {
      vi: {
        overview: "Chạy bằng Docker Compose với PostgreSQL. Tích hợp SDK vào ứng dụng để bắt đầu thu thập traces.",
        steps: [
          "Tạo file docker-compose với Langfuse và PostgreSQL.",
          "Cấu hình biến môi trường: database, secret key và domain.",
          "Chạy Docker Compose và truy cập web UI.",
          "Tạo project và lấy API keys.",
          "Tích hợp Langfuse SDK vào ứng dụng AI để gửi traces."
        ],
        backup: "Backup database PostgreSQL chứa toàn bộ traces và project settings."
      },
      en: {
        overview: "Run with Docker Compose using PostgreSQL. Integrate the SDK into applications to collect traces.",
        steps: [
          "Create docker-compose file with Langfuse and PostgreSQL.",
          "Configure environment variables: database, secret key, and domain.",
          "Run Docker Compose and access the web UI.",
          "Create a project and obtain API keys.",
          "Integrate Langfuse SDK into AI applications to send traces."
        ],
        backup: "Back up the PostgreSQL database containing all traces and project settings."
      }
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
echo "Langfuse is running on http://SERVER_IP:3000"`
    }
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const useCases = [
  {
    slug: "google-photos",
    title: { vi: "Thay th\u1EBF Google Photos", en: "Google Photos alternatives" },
    description: {
      vi: "L\u01B0u \u1EA3nh, video v\u00E0 th\u01B0 vi\u1EC7n gia \u0111\u00ECnh tr\u00EAn h\u1EA1 t\u1EA7ng c\u1EE7a b\u1EA1n.",
      en: "Keep photos, videos, and family libraries on infrastructure you control."
    },
    projectSlugs: ["immich"]
  },
  {
    slug: "google-drive",
    title: { vi: "Thay th\u1EBF Google Drive", en: "Google Drive alternatives" },
    description: {
      vi: "L\u01B0u tr\u1EEF, \u0111\u1ED3ng b\u1ED9 v\u00E0 chia s\u1EBB file tr\u00EAn server ri\u00EAng thay v\u00EC d\u00F9ng cloud b\u00EAn th\u1EE9 ba.",
      en: "Store, sync, and share files on your own server instead of third-party cloud storage."
    },
    projectSlugs: ["nextcloud"]
  },
  {
    slug: "plex",
    title: { vi: "Thay th\u1EBF Plex", en: "Plex alternatives" },
    description: {
      vi: "Stream phim, nh\u1EA1c v\u00E0 media c\u00E1 nh\u00E2n m\u00E0 kh\u00F4ng ph\u1EE5 thu\u1ED9c d\u1ECBch v\u1EE5 tr\u1EA3 ph\u00ED.",
      en: "Stream movies, music, and personal media without relying on paid services."
    },
    projectSlugs: ["jellyfin"]
  },
  {
    slug: "airtable",
    title: { vi: "Thay th\u1EBF Airtable", en: "Airtable alternatives" },
    description: {
      vi: "Qu\u1EA3n l\u00FD d\u1EEF li\u1EC7u d\u1EA1ng b\u1EA3ng cho v\u1EADn h\u00E0nh, CRM nh\u1ECF ho\u1EB7c internal tools.",
      en: "Manage tabular data for operations, lightweight CRM, and internal tools."
    },
    projectSlugs: ["nocodb"]
  },
  {
    slug: "zapier",
    title: { vi: "Thay th\u1EBF Zapier", en: "Zapier alternatives" },
    description: {
      vi: "T\u1EF1 \u0111\u1ED9ng h\u00F3a workflow, k\u1EBFt n\u1ED1i c\u00E1c d\u1ECBch v\u1EE5 m\u00E0 kh\u00F4ng c\u1EA7n tr\u1EA3 ph\u00ED theo s\u1ED1 l\u01B0\u1EE3ng task.",
      en: "Automate workflows and connect services without paying per task execution."
    },
    projectSlugs: ["n8n"]
  },
  {
    slug: "notion",
    title: { vi: "Thay th\u1EBF Notion", en: "Notion alternatives" },
    description: {
      vi: "Wiki, t\u00E0i li\u1EC7u v\u00E0 c\u01A1 s\u1EDF ki\u1EBFn th\u1EE9c cho team, l\u01B0u tr\u1EEF tr\u00EAn h\u1EA1 t\u1EA7ng ri\u00EAng.",
      en: "Team wikis, docs, and knowledge bases hosted on your own infrastructure."
    },
    projectSlugs: ["outline"]
  },
  {
    slug: "linear-jira",
    title: { vi: "Thay th\u1EBF Linear/Jira", en: "Linear/Jira alternatives" },
    description: {
      vi: "Qu\u1EA3n l\u00FD issue, sprint v\u00E0 roadmap m\u00E0 v\u1EABn gi\u1EEF d\u1EEF li\u1EC7u trong h\u1EC7 th\u1ED1ng ri\u00EAng.",
      en: "Manage issues, sprints, and roadmaps while keeping data on your own stack."
    },
    projectSlugs: ["plane", "vikunja"]
  },
  {
    slug: "vps-monitoring",
    title: { vi: "Monitor VPS v\u00E0 website", en: "VPS and website monitoring" },
    description: {
      vi: "Theo d\u00F5i uptime, c\u1EA3nh b\u00E1o downtime v\u00E0 c\u00F4ng b\u1ED1 status page.",
      en: "Track uptime, alert on downtime, and publish status pages."
    },
    projectSlugs: ["uptime-kuma", "grafana", "netdata"]
  },
  {
    slug: "chatgpt",
    title: { vi: "Thay th\u1EBF ChatGPT", en: "ChatGPT alternatives" },
    description: {
      vi: "Ch\u1EA1y AI chat v\u00E0 LLM tr\u00EAn server ri\u00EAng, b\u1EA3o m\u1EADt d\u1EEF li\u1EC7u v\u00E0 kh\u00F4ng gi\u1EDBi h\u1EA1n s\u1EED d\u1EE5ng.",
      en: "Run AI chat and LLMs on your own server for data privacy and unlimited usage."
    },
    projectSlugs: ["open-webui", "ollama"]
  }
];
