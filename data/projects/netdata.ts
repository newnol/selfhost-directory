import type { Project } from "../types";

const project: Project = {
  slug: "netdata",
  name: "Netdata",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/netdata.svg",
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
    demo: "https://app.netdata.cloud",
  },
  summary: {
    vi: "Giám sát hiệu năng server theo thời gian thực với hàng nghìn metrics, cài đặt nhanh và nhẹ.",
    en: "Real-time server performance monitoring with thousands of metrics, quick and lightweight to install.",
  },
  notes: {
    vi: "Tự động phát hiện dịch vụ và thu thập metrics. Không cần cấu hình nhiều, nhưng nên giới hạn truy cập dashboard nếu public.",
    en: "Auto-discovers services and collects metrics. Minimal configuration needed, but restrict dashboard access if public.",
  },
  deployGuide: {
    vi: {
      overview:
        "Cài đặt bằng một container Docker hoặc script. Tự động thu thập metrics của host.",
      steps: [
        "Chạy container Netdata với quyền truy cập /proc, /sys và Docker socket.",
        "Mở dashboard tại port 19999 để xem metrics real-time.",
        "Cấu hình alarm notifications qua email, Slack hoặc webhook.",
        "Tuỳ chỉnh retention và storage nếu cần lưu metrics lâu hơn.",
        "Giới hạn truy cập bằng firewall hoặc basic auth nếu không dùng Netdata Cloud.",
      ],
      backup:
        "Netdata lưu metrics local. Backup thư mục config và custom dashboards. Metrics có thể tái thu thập.",
    },
    en: {
      overview:
        "Install with a single Docker container or script. Automatically collects host metrics.",
      steps: [
        "Run the Netdata container with access to /proc, /sys, and Docker socket.",
        "Open the dashboard at port 19999 to see real-time metrics.",
        "Configure alarm notifications via email, Slack, or webhook.",
        "Customize retention and storage if you need longer metric history.",
        "Restrict access with firewall or basic auth if not using Netdata Cloud.",
      ],
      backup:
        "Netdata stores metrics locally. Back up config and custom dashboards. Metrics can be re-collected.",
    },
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
echo "Netdata is running on http://SERVER_IP:19999"`,
  },
};
export default project;
