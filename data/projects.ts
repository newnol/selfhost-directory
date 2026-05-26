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
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const categories: Category[] = [
  {
    slug: "media",
    title: { vi: "Media & cá nhân", en: "Media & personal" },
    description: {
      vi: "Ảnh, video, file cá nhân và các dịch vụ thay thế cloud consumer.",
      en: "Photos, videos, personal files, and consumer cloud replacements."
    }
  },
  {
    slug: "monitoring",
    title: { vi: "Monitoring & vận hành", en: "Monitoring & operations" },
    description: {
      vi: "Theo dõi uptime, cảnh báo, status page và công cụ vận hành VPS.",
      en: "Uptime checks, alerts, status pages, and VPS operations tools."
    }
  },
  {
    slug: "security",
    title: { vi: "Bảo mật", en: "Security" },
    description: {
      vi: "Quản lý mật khẩu, secrets, danh tính và hardening hệ thống.",
      en: "Password managers, secrets, identity, and system hardening."
    }
  },
  {
    slug: "data-tools",
    title: { vi: "Data & internal tools", en: "Data & internal tools" },
    description: {
      vi: "Database UI, no-code tools, automation và app nội bộ.",
      en: "Database UIs, no-code tools, automation, and internal apps."
    }
  },
  {
    slug: "productivity",
    title: { vi: "Productivity & team", en: "Productivity & team" },
    description: {
      vi: "Quản lý dự án, tài liệu, wiki và workflow cho team nhỏ.",
      en: "Project management, docs, wikis, and workflows for small teams."
    }
  },
  {
    slug: "ai",
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
      vi: "Media server ma nguon mo, phat phim, nhac va anh ca nhan thay cho Plex.",
      en: "A free and open-source media server for streaming movies, music, and photos as a Plex alternative."
    },
    notes: {
      vi: "Ho tro hardware transcoding voi GPU. Nen mount thu muc media rieng va cau hinh thu vien truoc khi moi nguoi dung.",
      en: "Supports hardware transcoding with GPU. Mount media directories separately and configure libraries before inviting users."
    },
    deployGuide: {
      vi: {
        overview: "Chay mot container Docker duy nhat, mount thu muc media va cau hinh transcoding neu can.",
        steps: [
          "Tao thu muc luu tru media (phim, nhac, anh) tren host.",
          "Chay container Jellyfin voi volume mount cho media va config.",
          "Mo web UI, tao tai khoan admin va cau hinh thu vien media.",
          "Bat hardware transcoding trong Settings neu co GPU.",
          "Dat reverse proxy HTTPS neu truy cap tu internet."
        ],
        backup: "Backup thu muc config chua database va metadata. Media files nen co backup rieng."
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
      vi: "Nen tang dong bo va chia se file tu host, thay the Google Drive va Dropbox voi nhieu plugin mo rong.",
      en: "A self-hosted file sync and share platform, replacing Google Drive and Dropbox with extensive plugin support."
    },
    notes: {
      vi: "Cau hinh PHP va database can dung. Su dung PostgreSQL cho production, nen dat cron job va Redis de tang hieu nang.",
      en: "PHP and database configuration must be correct. Use PostgreSQL for production, set up cron jobs and Redis for better performance."
    },
    deployGuide: {
      vi: {
        overview: "Chay bang Docker Compose voi PostgreSQL va Redis. Can cau hinh domain va trusted_domains dung.",
        steps: [
          "Tao thu muc du lieu va cau hinh cho Nextcloud.",
          "Chay Docker Compose voi Nextcloud, PostgreSQL va Redis.",
          "Truy cap web UI, tao tai khoan admin va cau hinh trusted_domains.",
          "Cai dat cron job (system cron hoac webcron) de xu ly background tasks.",
          "Dat reverse proxy HTTPS va cau hinh overwrite.cli.url."
        ],
        backup: "Backup thu muc data, database PostgreSQL va file config.php. Nen test restore dinh ky."
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
      vi: "Nen tang dashboard va observability hang dau, ket noi nhieu nguon du lieu de hien thi metrics, logs va traces.",
      en: "A leading dashboard and observability platform connecting multiple data sources for metrics, logs, and traces."
    },
    notes: {
      vi: "Grafana chi la lop hien thi, can ket hop voi Prometheus, Loki hoac InfluxDB de co du lieu. Nen cau hinh authentication va gioi han quyen.",
      en: "Grafana is only the visualization layer. Pair it with Prometheus, Loki, or InfluxDB for data. Configure authentication and permissions carefully."
    },
    deployGuide: {
      vi: {
        overview: "Chay mot container Docker don gian. Ket noi data source sau khi cai dat.",
        steps: [
          "Tao thu muc data cho Grafana de luu dashboards va config.",
          "Chay container voi volume mount va port 3000.",
          "Dang nhap voi admin/admin va doi mat khau ngay lap tuc.",
          "Them data source (Prometheus, InfluxDB, hoac khac).",
          "Import hoac tao dashboards de hien thi metrics."
        ],
        backup: "Backup thu muc data va database SQLite (hoac PostgreSQL neu dung). Export dashboards quan trong ra JSON."
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
      vi: "Giam sat hieu nang server theo thoi gian thuc voi hang ngan metrics, cai dat nhanh va nhe.",
      en: "Real-time server performance monitoring with thousands of metrics, quick and lightweight to install."
    },
    notes: {
      vi: "Tu dong phat hien dich vu va thu thap metrics. Khong can cau hinh nhieu, nhung nen gioi han truy cap dashboard neu public.",
      en: "Auto-discovers services and collects metrics. Minimal configuration needed, but restrict dashboard access if public."
    },
    deployGuide: {
      vi: {
        overview: "Cai dat bang mot container Docker hoac script. Tu dong thu thap metrics cua host.",
        steps: [
          "Chay container Netdata voi quyen truy cap /proc, /sys va Docker socket.",
          "Mo dashboard tai port 19999 de xem metrics real-time.",
          "Cau hinh alarm notifications qua email, Slack hoac webhook.",
          "Tuy chinh retention va storage neu can luu metrics lau hon.",
          "Gioi han truy cap bang firewall hoac basic auth neu khong dung Netdata Cloud."
        ],
        backup: "Netdata luu metrics local. Backup thu muc config va custom dashboards. Metrics co the tai thu thap."
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
      vi: "Identity provider va SSO tu host, ho tro SAML, OAuth2, LDAP va nhieu giao thuc xac thuc.",
      en: "A self-hosted identity provider and SSO supporting SAML, OAuth2, LDAP, and many authentication protocols."
    },
    notes: {
      vi: "Can PostgreSQL va Redis. Cau hinh phuc tap hon cac app don gian nhung rat manh cho quan ly danh tinh tap trung.",
      en: "Requires PostgreSQL and Redis. More complex to configure than simple apps but powerful for centralized identity management."
    },
    deployGuide: {
      vi: {
        overview: "Chay bang Docker Compose voi PostgreSQL va Redis. Can cau hinh domain va secret key dung.",
        steps: [
          "Tao file .env voi secret key, domain va cau hinh email.",
          "Chay Docker Compose voi Authentik server, worker, PostgreSQL va Redis.",
          "Truy cap web UI tai port 9000, thiet lap mat khau admin.",
          "Cau hinh providers (OAuth2, SAML, LDAP) cho tung ung dung.",
          "Tao flows va policies de quan ly xac thuc va uy quyen."
        ],
        backup: "Backup database PostgreSQL va thu muc media. Redis chi luu cache nen khong bat buoc backup."
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
      AUTHENTIK_SECRET_KEY: "change-me-to-a-long-random-string"
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
      AUTHENTIK_SECRET_KEY: "change-me-to-a-long-random-string"
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
      AUTHENTIK_SECRET_KEY: "change-me-to-a-long-random-string"
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
      AUTHENTIK_SECRET_KEY: "change-me-to-a-long-random-string"
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
      vi: "Giao dien quan ly WireGuard VPN don gian, de tao va quan ly client qua web UI.",
      en: "A simple WireGuard VPN management UI for easily creating and managing VPN clients through a web interface."
    },
    notes: {
      vi: "Can quyen NET_ADMIN va SYS_MODULE. Cau hinh dung IP public va port UDP 51820 de client ket noi.",
      en: "Requires NET_ADMIN and SYS_MODULE capabilities. Configure the correct public IP and UDP port 51820 for client connections."
    },
    deployGuide: {
      vi: {
        overview: "Chay mot container Docker voi quyen dac biet de quan ly WireGuard. Can mo port UDP.",
        steps: [
          "Mo port UDP 51820 tren firewall va router.",
          "Chay container voi cap_add NET_ADMIN va SYS_MODULE.",
          "Cau hinh WG_HOST bang IP public hoac domain cua server.",
          "Dat mat khau admin qua PASSWORD_HASH.",
          "Tao client profiles va tai file config hoac scan QR code."
        ],
        backup: "Backup thu muc config chua WireGuard keys va client profiles."
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
      vi: "Nen tang tu dong hoa workflow tu host, ket noi hang tram dich vu thay cho Zapier va Make.",
      en: "A self-hosted workflow automation platform connecting hundreds of services as an alternative to Zapier and Make."
    },
    notes: {
      vi: "Su dung PostgreSQL cho production thay vi SQLite. Nen dat queue mode voi Redis neu co nhieu workflow chay dong thoi.",
      en: "Use PostgreSQL for production instead of SQLite. Enable queue mode with Redis for many concurrent workflows."
    },
    deployGuide: {
      vi: {
        overview: "Chay bang Docker Compose voi PostgreSQL. Co the them Redis cho queue mode.",
        steps: [
          "Tao thu muc du lieu va file docker-compose.",
          "Cau hinh PostgreSQL lam database chinh.",
          "Chay container n8n voi volume cho workflows va credentials.",
          "Tao tai khoan admin va bat dau tao workflows.",
          "Dat webhook URL dung neu su dung webhook triggers."
        ],
        backup: "Backup database PostgreSQL va thu muc .n8n chua credentials da ma hoa."
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
      vi: "Cong cu business intelligence tu host, tao bieu do va dashboard tu database ma khong can viet code.",
      en: "A self-hosted business intelligence tool for creating charts and dashboards from databases without writing code."
    },
    notes: {
      vi: "Mac dinh dung H2 embedded database. Nen chuyen sang PostgreSQL cho production de dam bao on dinh.",
      en: "Defaults to H2 embedded database. Switch to PostgreSQL for production stability."
    },
    deployGuide: {
      vi: {
        overview: "Chay mot container Docker don gian. Nen dung PostgreSQL lam metabase database cho production.",
        steps: [
          "Tao thu muc du lieu cho Metabase.",
          "Chay container voi bien moi truong cau hinh database backend.",
          "Truy cap web UI tai port 3000 va hoan thanh setup wizard.",
          "Ket noi data sources (PostgreSQL, MySQL, etc.) de truy van.",
          "Tao questions va dashboards, phan quyen cho team."
        ],
        backup: "Backup Metabase application database (PostgreSQL). Dashboards va questions deu nam trong database nay."
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
      vi: "Wiki va tai lieu cho team, giao dien dep va nhanh, thay the Notion voi du lieu tu host.",
      en: "A fast and beautiful team wiki and documentation tool, a self-hosted Notion alternative."
    },
    notes: {
      vi: "Can cau hinh SSO (OIDC hoac SAML) de dang nhap. Nen dung S3-compatible storage cho file uploads.",
      en: "Requires SSO configuration (OIDC or SAML) for login. Use S3-compatible storage for file uploads."
    },
    deployGuide: {
      vi: {
        overview: "Chay bang Docker Compose voi PostgreSQL, Redis va S3 storage. Bat buoc cau hinh SSO.",
        steps: [
          "Cau hinh SSO provider (Authentik, Keycloak, Google, etc.).",
          "Tao file .env voi database, Redis, S3 va SSO settings.",
          "Chay Docker Compose voi Outline, PostgreSQL va Redis.",
          "Truy cap web UI va dang nhap qua SSO provider.",
          "Tao collections va moi team members."
        ],
        backup: "Backup database PostgreSQL va S3 storage chua uploaded files."
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
      SECRET_KEY: "change-me-generate-with-openssl-rand-hex-32"
      UTILS_SECRET: "change-me-generate-with-openssl-rand-hex-32"
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
      SECRET_KEY: "change-me-generate-with-openssl-rand-hex-32"
      UTILS_SECRET: "change-me-generate-with-openssl-rand-hex-32"
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
      vi: "Ung dung quan ly cong viec tu host, ho tro kanban, list va calendar, thay the Todoist.",
      en: "A self-hosted task management app with kanban, list, and calendar views as a Todoist alternative."
    },
    notes: {
      vi: "Nhe va nhanh, phu hop cho ca nhan hoac team nho. Co the dung SQLite cho don gian hoac PostgreSQL cho production.",
      en: "Lightweight and fast, suitable for individuals or small teams. Use SQLite for simplicity or PostgreSQL for production."
    },
    deployGuide: {
      vi: {
        overview: "Chay mot container Docker duy nhat, frontend va API gom trong mot binary.",
        steps: [
          "Tao thu muc du lieu cho Vikunja.",
          "Chay container voi volume mount cho database va files.",
          "Truy cap web UI va tao tai khoan dau tien.",
          "Cau hinh mailer neu muon gui email thong bao.",
          "Tao projects, tasks va moi cong tac vien."
        ],
        backup: "Backup file database (SQLite hoac PostgreSQL) va thu muc files chua attachments."
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
      vi: "Chay cac mo hinh LLM tren may local hoac server rieng, ho tro nhieu model nhu Llama, Mistral, Gemma.",
      en: "Run LLM models locally on your own machine or server, supporting models like Llama, Mistral, and Gemma."
    },
    notes: {
      vi: "Tai nguyen phu thuoc vao kich thuoc model. Model 7B can toi thieu 8 GB RAM. GPU giup tang toc dang ke.",
      en: "Resource requirements depend on model size. 7B models need at least 8 GB RAM. GPU significantly improves speed."
    },
    deployGuide: {
      vi: {
        overview: "Chay mot container Docker don gian. Tai model sau khi khoi dong.",
        steps: [
          "Chay container Ollama voi volume luu tru models.",
          "Tai model dau tien bang lenh `ollama pull llama3.2`.",
          "Test bang `ollama run llama3.2` hoac goi API tai port 11434.",
          "Ket hop voi Open WebUI de co giao dien chat.",
          "Cau hinh GPU passthrough neu co NVIDIA GPU."
        ],
        backup: "Models co the tai lai. Backup thu muc cau hinh neu co custom Modelfiles."
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
      vi: "Cong cu observability cho LLM, theo doi traces, chi phi va chat luong cua ung dung AI.",
      en: "An LLM observability tool for tracing, cost tracking, and quality monitoring of AI applications."
    },
    notes: {
      vi: "Nen chay cung PostgreSQL rieng. Tich hop bang SDK vao ung dung AI de gui traces.",
      en: "Run with a dedicated PostgreSQL instance. Integrate via SDK into AI applications to send traces."
    },
    deployGuide: {
      vi: {
        overview: "Chay bang Docker Compose voi PostgreSQL. Tich hop SDK vao ung dung de bat dau thu thap traces.",
        steps: [
          "Tao file docker-compose voi Langfuse va PostgreSQL.",
          "Cau hinh bien moi truong: database, secret key va domain.",
          "Chay Docker Compose va truy cap web UI.",
          "Tao project va lay API keys.",
          "Tich hop Langfuse SDK vao ung dung AI de gui traces."
        ],
        backup: "Backup database PostgreSQL chua toan bo traces va project settings."
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
      NEXTAUTH_SECRET: "change-me-generate-with-openssl-rand-base64-32"
      SALT: "change-me-generate-with-openssl-rand-base64-32"
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
      NEXTAUTH_SECRET: "change-me-generate-with-openssl-rand-base64-32"
      SALT: "change-me-generate-with-openssl-rand-base64-32"
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
