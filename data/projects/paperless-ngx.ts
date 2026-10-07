import type { Project } from "../types";

// Legacy score is a neutral compatibility placeholder, not a rating.
const project: Project = {
  "slug": "paperless-ngx",
  "name": "Paperless-ngx",
  "categorySlug": "productivity",
  "category": "Document Management",
  "tags": [
    "documents",
    "ocr",
    "archive"
  ],
  "stack": [
    "Python",
    "Django",
    "Angular"
  ],
  "license": "GPL-3.0",
  "deploy": "Docker Compose",
  "summary": {
    "vi": "Lưu trữ, nhận dạng văn bản và tìm kiếm tài liệu số hóa trong kho tài liệu tự lưu trữ.",
    "en": "Archives, recognizes text in and searches digitized documents in a self-hosted document library."
  },
  "notes": {
    "vi": "Tài liệu chính thức khuyến nghị Docker và PostgreSQL cho cài đặt mới. Nhu cầu tài nguyên phụ thuộc lượng tài liệu và tác vụ OCR; chưa xác minh ngưỡng CPU, RAM hoặc dung lượng đĩa.",
    "en": "Official documentation recommends Docker and PostgreSQL for new installations. Resource use depends on document volume and OCR work; CPU, RAM and disk thresholds are not verified here."
  },
  "iconUrl": "https://avatars.githubusercontent.com/u/99562962?v=4",
  "requirements": "CPU/RAM/disk not verified; size for your workload. / CPU/RAM/đĩa chưa xác minh; chọn theo khối lượng sử dụng.",
  "structuredRequirements": {
    "provenance": {
      "kind": "estimate",
      "note": {"en": "Resource values are unknown, not measured or verified. Review official installation docs and test your workload.", "vi": "Chưa có số liệu tài nguyên được đo hoặc xác minh. Đọc tài liệu cài đặt chính thức và thử với nhu cầu thực tế; các mức CPU, RAM, ổ đĩa và kiến trúc vẫn chưa rõ."}
    }
  },
  "score": 0,
  "links": {
    "source": "https://github.com/paperless-ngx/paperless-ngx",
    "docs": "https://docs.paperless-ngx.com/setup/"
  },
  "deployGuide": {
    "vi": {
      "overview": "Làm theo tài liệu chính thức; mục này không phải hướng dẫn triển khai đã kiểm thử.",
      "steps": [
        "Cài Docker và Docker Compose; lấy mẫu Compose và các tệp môi trường từ kho mã chính thức.",
        "Chọn cơ sở dữ liệu, cấu hình thư mục consume/media và thông tin đăng nhập trước khi khởi động.",
        "Tạo tài khoản quản trị, rồi tài khoản sử dụng hằng ngày; nhập một tài liệu thử và kiểm tra OCR."
      ],
      "backup": "Theo hướng dẫn sao lưu chính thức, giữ cơ sở dữ liệu, dữ liệu tài liệu và cấu hình cùng nhau; kiểm tra khả năng khôi phục trước khi nâng cấp."
    },
    "en": {
      "overview": "Follow upstream documentation; this catalog is not a tested deployment recipe.",
      "steps": [
        "Install Docker and Docker Compose; obtain the Compose template and environment files from upstream.",
        "Choose the database and configure consume/media paths and credentials before starting.",
        "Create an administrator and a separate daily-use account; import a test document and check OCR."
      ],
      "backup": "Follow upstream backup instructions, retaining the database, document data and configuration together; test restoration before upgrades."
    }
  },
  "deploySnippets": {
    "dockerCompose": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://docs.paperless-ngx.com/setup/",
    "setupScript": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://docs.paperless-ngx.com/setup/"
  }
};

export default project;
