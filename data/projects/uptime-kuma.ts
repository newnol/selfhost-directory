import type { Project } from "../types";

const project: Project = {
  slug: "uptime-kuma",
  name: "Uptime Kuma",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg",
  categorySlug: "monitoring",
  category: "Monitoring",
  tags: ["monitoring", "status-page", "vps"],
  stack: ["Node.js", "SQLite", "Docker"],
  license: "MIT",
  deploy: "Docker",
  requirements: "CPU / RAM / disk sizing not specified in the checked README",
  structuredRequirements: {
    "provenance": {
      "kind": "documented",
      "source": "https://github.com/louislam/uptime-kuma",
      "checkedAt": "2026-10-07",
      "note": {"en": "Official README requires local directory/volume storage: NFS is not supported. Non-Docker instructions specify Node >=20.4. No numeric CPU, RAM or disk sizing, or Docker architecture matrix stated here; all hardware fields remain unknown.", "vi": "Lưu dữ liệu trên thư mục hoặc volume cục bộ; Uptime Kuma không hỗ trợ NFS. README được kiểm tra không nêu mức CPU, RAM hay dung lượng tối thiểu. Số monitor và tần suất kiểm tra sẽ ảnh hưởng tải; hãy sao lưu volume dữ liệu và kiểm tra phiên bản trước khi nâng cấp."}
    }
  },
  score: 95,
  links: {
    source: "https://github.com/louislam/uptime-kuma",
    docs: "https://github.com/louislam/uptime-kuma/wiki",
    demo: "https://demo.uptime.kuma.pet",
  },
  summary: {
    vi: "Theo dõi uptime, latency và tạo status page cho website, API hoặc VPS.",
    en: "Monitor uptime, latency, and status pages for websites, APIs, and VPS services.",
  },
  notes: {
    vi: "Lưu dữ liệu trên thư mục hoặc volume cục bộ; Uptime Kuma không hỗ trợ NFS. README được kiểm tra không nêu mức CPU, RAM hay dung lượng tối thiểu. Số monitor và tần suất kiểm tra sẽ ảnh hưởng tải; hãy sao lưu volume dữ liệu và kiểm tra phiên bản trước khi nâng cấp.",
    en: "Use a local data directory or volume; Uptime Kuma does not support NFS. The checked README provides no CPU, RAM or disk minimum. Monitor count and polling frequency affect load; back up the data volume and review version-specific instructions before upgrading.",
  },
  deployGuide: {
    vi: {
      overview:
        "Cài nhanh bằng một container Docker, phù hợp để chạy trên VPS nhỏ.",
      steps: [
        "Tạo Docker volume riêng cho dữ liệu Uptime Kuma.",
        "Chạy container và map port nội bộ, ví dụ `3001:3001`.",
        "Tạo user admin trong lần mở đầu tiên.",
        "Thêm monitor HTTP/TCP/Ping cho website, API và dịch vụ quan trọng.",
        "Cấu hình notification qua Telegram, Discord, email hoặc webhook.",
      ],
      backup:
        "Backup volume `/app/data`, đặc biệt file SQLite chứa monitor và cấu hình alert.",
    },
    en: {
      overview: "Run it as a single Docker container, ideal for a small VPS.",
      steps: [
        "Create a dedicated Docker volume for Uptime Kuma data.",
        "Run the container and map the internal port, for example `3001:3001`.",
        "Create the admin user on first launch.",
        "Add HTTP, TCP, or Ping monitors for important websites, APIs, and services.",
        "Configure notifications via Telegram, Discord, email, or webhook.",
      ],
      backup:
        "Back up the `/app/data` volume, especially the SQLite file with monitors and alert settings.",
    },
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
    setupScript: "# No executable setup script; follow current official documentation.\n# Không có script cài đặt; xem tài liệu chính thức hiện hành.\n# https://github.com/louislam/uptime-kuma/wiki",
  },
};
export default project;
