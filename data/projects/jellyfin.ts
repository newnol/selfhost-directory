import type { Project } from "../types";

const project: Project = {
  slug: "jellyfin",
  name: "Jellyfin",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/jellyfin.svg",
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
    demo: "https://demo.jellyfin.org/web/",
  },
  summary: {
    vi: "Media server mã nguồn mở, phát phim, nhạc và ảnh cá nhân thay cho Plex.",
    en: "A free and open-source media server for streaming movies, music, and photos as a Plex alternative.",
  },
  notes: {
    vi: "Hỗ trợ hardware transcoding với GPU. Nên mount thư mục media riêng và cấu hình thư viện trước khi mời người dùng.",
    en: "Supports hardware transcoding with GPU. Mount media directories separately and configure libraries before inviting users.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy một container Docker duy nhất, mount thư mục media và cấu hình transcoding nếu cần.",
      steps: [
        "Tạo thư mục lưu trữ media (phim, nhạc, ảnh) trên host.",
        "Chạy container Jellyfin với volume mount cho media và config.",
        "Mở web UI, tạo tài khoản admin và cấu hình thư viện media.",
        "Bật hardware transcoding trong Settings nếu có GPU.",
        "Đặt reverse proxy HTTPS nếu truy cập từ internet.",
      ],
      backup:
        "Backup thư mục config chứa database và metadata. Media files nên có backup riêng.",
    },
    en: {
      overview:
        "Run a single Docker container, mount media directories, and configure transcoding if needed.",
      steps: [
        "Create media storage directories (movies, music, photos) on the host.",
        "Run the Jellyfin container with volume mounts for media and config.",
        "Open the web UI, create an admin account, and configure media libraries.",
        "Enable hardware transcoding in Settings if a GPU is available.",
        "Put an HTTPS reverse proxy in front for internet access.",
      ],
      backup:
        "Back up the config directory containing the database and metadata. Media files need separate backup.",
    },
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
echo "Jellyfin is running on http://SERVER_IP:8096"`,
  },
};
export default project;
