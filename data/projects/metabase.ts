import type { Project } from "../types";

const project: Project = {
  slug: "metabase",
  name: "Metabase",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/metabase.svg",
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
    demo: "https://www.metabase.com/demo",
  },
  summary: {
    vi: "Công cụ business intelligence tự host, tạo biểu đồ và dashboard từ database mà không cần viết code.",
    en: "A self-hosted business intelligence tool for creating charts and dashboards from databases without writing code.",
  },
  notes: {
    vi: "Mặc định dùng H2 embedded database. Nên chuyển sang PostgreSQL cho production để đảm bảo ổn định.",
    en: "Defaults to H2 embedded database. Switch to PostgreSQL for production stability.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy một container Docker đơn giản. Nên dùng PostgreSQL làm metabase database cho production.",
      steps: [
        "Tạo thư mục dữ liệu cho Metabase.",
        "Chạy container với biến môi trường cấu hình database backend.",
        "Truy cập web UI tại port 3000 và hoàn thành setup wizard.",
        "Kết nối data sources (PostgreSQL, MySQL, etc.) để truy vấn.",
        "Tạo questions và dashboards, phân quyền cho team.",
      ],
      backup:
        "Backup Metabase application database (PostgreSQL). Dashboards và questions đều nằm trong database này.",
    },
    en: {
      overview:
        "Run a simple Docker container. Use PostgreSQL as the Metabase application database for production.",
      steps: [
        "Create a data directory for Metabase.",
        "Run the container with environment variables for database backend.",
        "Access the web UI at port 3000 and complete the setup wizard.",
        "Connect data sources (PostgreSQL, MySQL, etc.) for querying.",
        "Create questions and dashboards, set permissions for the team.",
      ],
      backup:
        "Back up the Metabase application database (PostgreSQL). All dashboards and questions are stored there.",
    },
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
echo "Metabase is running on http://SERVER_IP:3000"`,
  },
};
export default project;
