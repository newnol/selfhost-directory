import type { Project } from "../types";

const project: Project = {
  slug: "open-webui",
  name: "Open WebUI",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/open-webui.svg",
  categorySlug: "ai",
  category: "AI",
  tags: ["ai", "ollama", "chat"],
  stack: ["Python", "Svelte", "SQLite/PostgreSQL", "Docker"],
  license: "BSD-3-Clause",
  deploy: "Docker",
  requirements: "amd64 / arm64 documented; model backend sized separately",
  structuredRequirements: {
    "provenance": {
      "kind": "documented",
      "source": "https://docs.openwebui.com/getting-started/quick-start/",
      "checkedAt": "2026-10-07",
      "note": {"en": "Official quick start documents Linux x86_64 and ARM64 support (mapped to amd64/arm64), not a verified image manifest. No universal numeric host CPU/RAM/disk floor is recorded from this page. Standard image bundles speech-to-text and embedding models; slim externalizes optional features. Model backend capacity and image download sizes are not whole-host thresholds.", "vi": "Open WebUI hỗ trợ Linux x86_64 và ARM64, nhưng CPU, RAM và ổ đĩa còn phụ thuộc số người dùng và tính năng bật lên. Tính riêng backend model, embeddings và nhận dạng giọng nói; image tiêu chuẩn có kèm model phụ trợ. Kích thước tải image không phải dung lượng ổ đĩa tối thiểu cho máy."}
    },
    "architectures": [
      "amd64",
      "arm64"
    ]
  },
  score: 88,
  links: {
    source: "https://github.com/open-webui/open-webui",
    docs: "https://docs.openwebui.com",
  },
  summary: {
    vi: "Giao diện chat AI tự host, dùng được với Ollama hoặc nhiều provider LLM.",
    en: "A self-hosted AI chat interface for Ollama and multiple LLM providers.",
  },
  notes: {
    vi: "Open WebUI hỗ trợ Linux x86_64 và ARM64, nhưng CPU, RAM và ổ đĩa còn phụ thuộc số người dùng và tính năng bật lên. Tính riêng backend model, embeddings và nhận dạng giọng nói; image tiêu chuẩn có kèm model phụ trợ. Kích thước tải image không phải dung lượng ổ đĩa tối thiểu cho máy.",
    en: "Open WebUI documents Linux x86_64 and ARM64 support, but CPU, RAM and disk needs depend on users and enabled features. Size model backends, embeddings and speech recognition separately; the standard image bundles auxiliary models. Image download size is not a host disk minimum.",
  },
  deployGuide: {
    vi: {
      overview:
        "Có thể chạy một container đơn giản, hoặc ghép với Ollama/LiteLLM nếu muốn hệ AI đầy đủ hơn.",
      steps: [
        "Chọn backend: Ollama local, LiteLLM gateway, hoặc API provider bên ngoài.",
        "Chạy container Open WebUI với volume `/app/backend/data`.",
        "Cấu hình biến môi trường cho provider hoặc endpoint Ollama/LiteLLM.",
        "Tạo admin user đầu tiên và kiểm tra quyền đăng ký.",
        "Đặt HTTPS nếu cho team truy cập từ internet.",
      ],
      backup:
        "Backup volume backend data và database nếu chuyển sang PostgreSQL.",
    },
    en: {
      overview:
        "Run it as a single container, or pair it with Ollama/LiteLLM for a fuller AI stack.",
      steps: [
        "Choose a backend: local Ollama, LiteLLM gateway, or external API provider.",
        "Run Open WebUI with a persistent `/app/backend/data` volume.",
        "Configure environment variables for the provider or Ollama/LiteLLM endpoint.",
        "Create the first admin user and review signup permissions.",
        "Put HTTPS in front if a team will access it from the internet.",
      ],
      backup:
        "Back up the backend data volume and database if you move to PostgreSQL.",
    },
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
    setupScript: "# No executable setup script; follow current official documentation.\n# Không có script cài đặt; xem tài liệu chính thức hiện hành.\n# https://docs.openwebui.com",
  },
};
export default project;
