import type { Project } from "../types";

const project: Project = {
  slug: "wg-easy",
  name: "WG-Easy",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/wireguard.svg",
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
    docs: "https://github.com/wg-easy/wg-easy/wiki",
  },
  summary: {
    vi: "Giao diện quản lý WireGuard VPN đơn giản, dễ tạo và quản lý client qua web UI.",
    en: "A simple WireGuard VPN management UI for easily creating and managing VPN clients through a web interface.",
  },
  notes: {
    vi: "Cần quyền NET_ADMIN và SYS_MODULE. Cấu hình đúng IP public và port UDP 51820 để client kết nối.",
    en: "Requires NET_ADMIN and SYS_MODULE capabilities. Configure the correct public IP and UDP port 51820 for client connections.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy một container Docker với quyền đặc biệt để quản lý WireGuard. Cần mở port UDP.",
      steps: [
        "Mở port UDP 51820 trên firewall và router.",
        "Chạy container với cap_add NET_ADMIN và SYS_MODULE.",
        "Cấu hình WG_HOST bằng IP public hoặc domain của server.",
        "Đặt mật khẩu admin qua PASSWORD_HASH.",
        "Tạo client profiles và tải file config hoặc scan QR code.",
      ],
      backup: "Backup thư mục config chứa WireGuard keys và client profiles.",
    },
    en: {
      overview:
        "Run a single Docker container with special capabilities for WireGuard management. Open UDP port.",
      steps: [
        "Open UDP port 51820 on the firewall and router.",
        "Run the container with NET_ADMIN and SYS_MODULE capabilities.",
        "Set WG_HOST to the server public IP or domain.",
        "Set admin password via PASSWORD_HASH.",
        "Create client profiles and download config files or scan QR codes.",
      ],
      backup:
        "Back up the config directory containing WireGuard keys and client profiles.",
    },
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
    setupScript: "# No executable setup script; follow current official documentation.\n# Không có script cài đặt; xem tài liệu chính thức hiện hành.\n# https://github.com/wg-easy/wg-easy/wiki",
  },
};
export default project;
