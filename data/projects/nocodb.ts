import type { Project } from "../types";

const project: Project = {
  slug: "nocodb",
  name: "NocoDB",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/nocodb.svg",
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
    demo: "https://app.nocodb.com",
  },
  summary: {
    vi: "Giao diện bảng tính/no-code trên database, thường dùng như lựa chọn thay Airtable.",
    en: "A spreadsheet-like no-code interface on top of databases, often used as an Airtable alternative.",
  },
  notes: {
    vi: "Phù hợp quản lý dữ liệu vận hành nhẹ. Với production nên dùng PostgreSQL thay vì SQLite.",
    en: "Good for lightweight operational data. Prefer PostgreSQL over SQLite in production.",
  },
  deployGuide: {
    vi: {
      overview:
        "Nên chạy bằng Docker Compose với PostgreSQL riêng cho production nhỏ.",
      steps: [
        "Tạo database PostgreSQL cho NocoDB hoặc dùng managed Postgres.",
        "Cấu hình biến `NC_DB` theo connection string của database.",
        "Chạy container NocoDB và đặt reverse proxy/HTTPS.",
        "Tạo workspace đầu tiên, kết nối database nguồn nếu cần.",
        "Phân quyền user trước khi đưa team vào dùng.",
      ],
      backup:
        "Backup database NocoDB và các database nguồn mà NocoDB kết nối tới.",
    },
    en: {
      overview:
        "Use Docker Compose with a dedicated PostgreSQL database for small production deployments.",
      steps: [
        "Create a PostgreSQL database for NocoDB or use managed Postgres.",
        "Configure `NC_DB` with the database connection string.",
        "Run the NocoDB container behind HTTPS.",
        "Create the first workspace and connect source databases if needed.",
        "Set user permissions before inviting the team.",
      ],
      backup:
        "Back up the NocoDB database and any source databases connected to it.",
    },
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
    setupScript: "# No executable setup script; follow current official documentation.\n# Không có script cài đặt; xem tài liệu chính thức hiện hành.\n# https://docs.nocodb.com",
  },
};
export default project;
