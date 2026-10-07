import type { Project } from "../types";

const project: Project = {
  slug: "ollama",
  name: "Ollama",
  iconUrl:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/ollama.svg",
  categorySlug: "ai",
  category: "Local LLM",
  tags: ["llm", "ai", "local"],
  stack: ["Go", "Docker"],
  license: "MIT",
  deploy: "Docker",
  requirements: "2 CPU, 4 GB RAM (depends on model)",
  score: 90,
  links: {
    source: "https://github.com/ollama/ollama",
    docs: "https://ollama.com/library",
  },
  summary: {
    vi: "Chạy các mô hình LLM trên máy local hoặc server riêng, hỗ trợ nhiều model như Llama, Mistral, Gemma.",
    en: "Run LLM models locally on your own machine or server, supporting models like Llama, Mistral, and Gemma.",
  },
  notes: {
    vi: "Tài nguyên phụ thuộc vào kích thước model. Model 7B cần tối thiểu 8 GB RAM. GPU giúp tăng tốc đáng kể.",
    en: "Resource requirements depend on model size. 7B models need at least 8 GB RAM. GPU significantly improves speed.",
  },
  deployGuide: {
    vi: {
      overview:
        "Chạy một container Docker đơn giản. Tải model sau khi khởi động.",
      steps: [
        "Chạy container Ollama với volume lưu trữ models.",
        "Tải model đầu tiên bằng lệnh `ollama pull llama3.2`.",
        "Test bằng `ollama run llama3.2` hoặc gọi API tại port 11434.",
        "Kết hợp với Open WebUI để có giao diện chat.",
        "Cấu hình GPU passthrough nếu có NVIDIA GPU.",
      ],
      backup:
        "Models có thể tải lại. Backup thư mục cấu hình nếu có custom Modelfiles.",
    },
    en: {
      overview: "Run a simple Docker container. Pull models after startup.",
      steps: [
        "Run the Ollama container with a volume for model storage.",
        "Pull the first model with `ollama pull llama3.2`.",
        "Test with `ollama run llama3.2` or call the API at port 11434.",
        "Pair with Open WebUI for a chat interface.",
        "Configure GPU passthrough if an NVIDIA GPU is available.",
      ],
      backup:
        "Models can be re-downloaded. Back up the config directory if you have custom Modelfiles.",
    },
  },
  deploySnippets: {
    dockerCompose: `services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    volumes:
      - ./models:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped`,
    setupScript: `#!/usr/bin/env bash
set -euo pipefail

sudo mkdir -p /opt/ollama
sudo chown "$USER":"$USER" /opt/ollama
cd /opt/ollama

cat > docker-compose.yml <<'COMPOSE'
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    volumes:
      - ./models:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped
COMPOSE

docker compose up -d
echo "Ollama is running on http://SERVER_IP:11434"
echo "Pull a model with: docker exec ollama ollama pull llama3.2"`,
  },
};
export default project;
