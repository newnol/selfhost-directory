import type { Project } from "../types";

// Legacy score is a neutral compatibility placeholder, not a rating.
const project: Project = {
  "slug": "searxng",
  "name": "SearXNG",
  "categorySlug": "data-tools",
  "category": "Metasearch",
  "tags": [
    "search",
    "metasearch",
    "privacy"
  ],
  "stack": [
    "Python"
  ],
  "license": "AGPL-3.0",
  "deploy": "Docker",
  "summary": {
    "vi": "Công cụ siêu tìm kiếm tự lưu trữ, tổng hợp kết quả từ nhiều dịch vụ và cơ sở dữ liệu tìm kiếm.",
    "en": "A self-hosted metasearch engine aggregating results from multiple search services and databases."
  },
  "notes": {
    "vi": "Kết quả phụ thuộc các nguồn tìm kiếm bên ngoài; nguồn có thể giới hạn hoặc chặn truy vấn. Đọc hướng dẫn cập nhật và kiểm soát truy cập trước khi mở dịch vụ công khai.",
    "en": "Results depend on external search engines, which may rate-limit or block requests. Read upgrade and access-control guidance before exposing a public instance."
  },
  "iconUrl": "https://avatars.githubusercontent.com/u/80454229?v=4",
  "requirements": "CPU/RAM/disk not verified; size for your workload. / CPU/RAM/đĩa chưa xác minh; chọn theo khối lượng sử dụng.",
  "structuredRequirements": {
    "provenance": {
      "kind": "estimate",
      "note": {"en": "Resource values are unknown, not measured or verified. Review official installation docs and test your workload.", "vi": "Chưa có số liệu tài nguyên được đo hoặc xác minh. Đọc tài liệu cài đặt chính thức và thử với nhu cầu thực tế; các mức CPU, RAM, ổ đĩa và kiến trúc vẫn chưa rõ."}
    }
  },
  "score": 0,
  "links": {
    "source": "https://github.com/searxng/searxng",
    "docs": "https://docs.searxng.org/admin/installation-docker.html"
  },
  "deployGuide": {
    "vi": {
      "overview": "Làm theo tài liệu chính thức; mục này không phải hướng dẫn triển khai đã kiểm thử.",
      "steps": [
        "Làm theo hướng dẫn container chính thức và chọn phiên bản triển khai.",
        "Cấu hình settings.yml, bí mật ứng dụng và nguồn tìm kiếm theo tài liệu.",
        "Kiểm tra truy vấn thử, TLS và biện pháp giới hạn truy cập trước khi cho người khác sử dụng."
      ],
      "backup": "Sao lưu settings.yml, bí mật ứng dụng và cấu hình proxy/container; kiểm tra việc tạo lại dịch vụ từ cấu hình đã lưu."
    },
    "en": {
      "overview": "Follow upstream documentation; this catalog is not a tested deployment recipe.",
      "steps": [
        "Follow official container installation instructions and select a deployment version.",
        "Configure settings.yml, application secrets and search engines as documented.",
        "Test sample queries, TLS and access limits before making the instance available to others."
      ],
      "backup": "Back up settings.yml, application secrets and proxy/container configuration; test recreating the service from retained configuration."
    }
  },
  "deploySnippets": {
    "dockerCompose": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://docs.searxng.org/admin/installation-docker.html",
    "setupScript": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://docs.searxng.org/admin/installation-docker.html"
  }
};

export default project;
