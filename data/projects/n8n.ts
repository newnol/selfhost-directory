import type { Project } from "../types";

const project: Project = {
  slug: "n8n",
  name: "n8n",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/n8n.svg",
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
    demo: "https://demo.n8n.io",
  },
  summary: {
    vi: "Nền tảng tự động hoá workflow tự host, kết nối hàng trăm dịch vụ thay cho Zapier và Make.",
    en: "A self-hosted workflow automation platform connecting hundreds of services as an alternative to Zapier and Make.",
  },
  notes: {
    vi: "Sử dụng PostgreSQL cho production thay vì SQLite. Nên đặt queue mode với Redis nếu có nhiều workflow chạy đồng thời.",
    en: "Use PostgreSQL for production instead of SQLite. Enable queue mode with Redis for many concurrent workflows.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy bằng Docker Compose với PostgreSQL. Có thể thêm Redis cho queue mode.",
      steps: [
        "Tạo thư mục dữ liệu và file docker-compose.",
        "Cấu hình PostgreSQL làm database chính.",
        "Chạy container n8n với volume cho workflows và credentials.",
        "Tạo tài khoản admin và bắt đầu tạo workflows.",
        "Đặt webhook URL đúng nếu sử dụng webhook triggers.",
      ],
      backup:
        "Backup database PostgreSQL và thư mục .n8n chứa credentials đã mã hoá.",
    },
    en: {
      overview:
        "Run with Docker Compose using PostgreSQL. Optionally add Redis for queue mode.",
      steps: [
        "Create data directory and docker-compose file.",
        "Configure PostgreSQL as the main database.",
        "Run the n8n container with volumes for workflows and credentials.",
        "Create an admin account and start building workflows.",
        "Set the correct webhook URL if using webhook triggers.",
      ],
      backup:
        "Back up the PostgreSQL database and .n8n directory containing encrypted credentials.",
    },
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
    setupScript: "# No executable setup script; follow current official documentation.\n# Không có script cài đặt; xem tài liệu chính thức hiện hành.\n# https://docs.n8n.io",
  },
};
export default project;
