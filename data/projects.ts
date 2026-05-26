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
      DB_PASSWORD: immich_password
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
      POSTGRES_PASSWORD: immich_password
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
      DB_PASSWORD: immich_password
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
      POSTGRES_PASSWORD: immich_password
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
      NC_DB: "pg://postgres:5432?u=nocodb&p=nocodb_password&d=nocodb"
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
      POSTGRES_PASSWORD: nocodb_password
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
      NC_DB: "pg://postgres:5432?u=nocodb&p=nocodb_password&d=nocodb"
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
      POSTGRES_PASSWORD: nocodb_password
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
      POSTGRES_PASSWORD: plane_password
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
      POSTGRES_PASSWORD: plane_password
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
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const useCases = [
  {
    slug: "google-photos",
    title: { vi: "Thay thế Google Photos", en: "Google Photos alternatives" },
    description: {
      vi: "Lưu ảnh, video và thư viện gia đình trên hạ tầng của bạn.",
      en: "Keep photos, videos, and family libraries on infrastructure you control."
    },
    projectSlugs: ["immich"]
  },
  {
    slug: "airtable",
    title: { vi: "Thay thế Airtable", en: "Airtable alternatives" },
    description: {
      vi: "Quản lý dữ liệu dạng bảng cho vận hành, CRM nhỏ hoặc internal tools.",
      en: "Manage tabular data for operations, lightweight CRM, and internal tools."
    },
    projectSlugs: ["nocodb"]
  },
  {
    slug: "linear-jira",
    title: { vi: "Thay thế Linear/Jira", en: "Linear/Jira alternatives" },
    description: {
      vi: "Quản lý issue, sprint và roadmap mà vẫn giữ dữ liệu trong hệ thống riêng.",
      en: "Manage issues, sprints, and roadmaps while keeping data on your own stack."
    },
    projectSlugs: ["plane"]
  },
  {
    slug: "vps-monitoring",
    title: { vi: "Monitor VPS và website", en: "VPS and website monitoring" },
    description: {
      vi: "Theo dõi uptime, cảnh báo downtime và công bố status page.",
      en: "Track uptime, alert on downtime, and publish status pages."
    },
    projectSlugs: ["uptime-kuma"]
  }
];
