import type { Project } from "../types";

const project: Project = {
  slug: "grafana",
  name: "Grafana",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/grafana.svg",
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
    demo: "https://play.grafana.org",
  },
  summary: {
    vi: "Nền tảng dashboard và observability hàng đầu, kết nối nhiều nguồn dữ liệu để hiển thị metrics, logs và traces.",
    en: "A leading dashboard and observability platform connecting multiple data sources for metrics, logs, and traces.",
  },
  notes: {
    vi: "Grafana chỉ là lớp hiển thị, cần kết hợp với Prometheus, Loki hoặc InfluxDB để có dữ liệu. Nên cấu hình authentication và giới hạn quyền.",
    en: "Grafana is only the visualization layer. Pair it with Prometheus, Loki, or InfluxDB for data. Configure authentication and permissions carefully.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy một container Docker đơn giản. Kết nối data source sau khi cài đặt.",
      steps: [
        "Tạo thư mục data cho Grafana để lưu dashboards và config.",
        "Chạy container với volume mount và port 3000.",
        "Đăng nhập với admin/admin và đổi mật khẩu ngay lập tức.",
        "Thêm data source (Prometheus, InfluxDB, hoặc khác).",
        "Import hoặc tạo dashboards để hiển thị metrics.",
      ],
      backup:
        "Backup thư mục data và database SQLite (hoặc PostgreSQL nếu dùng). Export dashboards quan trọng ra JSON.",
    },
    en: {
      overview:
        "Run a simple Docker container. Connect data sources after installation.",
      steps: [
        "Create a data directory for Grafana to store dashboards and config.",
        "Run the container with volume mount and port 3000.",
        "Log in with admin/admin and change the password immediately.",
        "Add data sources (Prometheus, InfluxDB, or others).",
        "Import or create dashboards to visualize metrics.",
      ],
      backup:
        "Back up the data directory and SQLite database (or PostgreSQL if used). Export important dashboards as JSON.",
    },
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
echo "Grafana is running on http://SERVER_IP:3000"`,
  },
};
export default project;
