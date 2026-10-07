import type { Project } from "../types";

// Legacy score is a neutral compatibility placeholder, not a rating.
const project: Project = {
  "slug": "file-browser",
  lifecycle: "archived",
  "name": "File Browser",
  "categorySlug": "media",
  "category": "File Management",
  "tags": [
    "files",
    "web-ui",
    "archived"
  ],
  "stack": [
    "Go",
    "Vue"
  ],
  "license": "Apache-2.0",
  "deploy": "Docker",
  "summary": {
    "vi": "Giao diện web để tải lên, xem trước và quản lý tệp trong một thư mục trên máy chủ. Dự án đã ngừng bảo trì.",
    "en": "A web interface to upload, preview and manage files in a server directory. The project is no longer maintained."
  },
  "notes": {
    "vi": "Kho mã đã được lưu trữ và dự án ngừng bảo trì từ 2026-09-01; không còn bản vá bảo mật. Không công khai trực tiếp ra Internet. Giữ chức năng chạy lệnh ở trạng thái tắt và dùng lớp xác thực riêng phía trước dịch vụ.",
    "en": "The repository was archived on 2026-09-01; there will be no further security fixes. Do not expose it directly to the internet. Keep the command runner disabled and put independent authentication in front of the service."
  },
  "iconUrl": "https://avatars.githubusercontent.com/u/35781395?v=4",
  "requirements": "CPU/RAM/disk not verified; size for your workload. / CPU/RAM/đĩa chưa xác minh; chọn theo khối lượng sử dụng.",
  "structuredRequirements": {
    "provenance": {
      "kind": "estimate",
      "note": {"en": "Resource values are unknown, not measured or verified. Review official installation docs and test your workload.", "vi": "Chưa có số liệu tài nguyên được đo hoặc xác minh. Đọc tài liệu cài đặt chính thức và thử với nhu cầu thực tế; các mức CPU, RAM, ổ đĩa và kiến trúc vẫn chưa rõ."}
    }
  },
  "score": 0,
  "links": {
    "source": "https://github.com/filebrowser/filebrowser",
    "docs": "https://github.com/filebrowser/filebrowser/tree/master/docs"
  },
  "deployGuide": {
    "vi": {
      "overview": "Làm theo tài liệu chính thức; mục này không phải hướng dẫn triển khai đã kiểm thử.",
      "steps": [
        "Đọc cảnh báo bảo mật trong README trước khi cân nhắc sử dụng phần mềm đã ngừng bảo trì.",
        "Nếu vẫn sử dụng, làm theo tài liệu chính thức; chạy container không đặc quyền và chỉ gắn thư mục cần phục vụ.",
        "Giữ chức năng chạy lệnh tắt; đặt dịch vụ sau proxy có TLS và xác thực riêng."
      ],
      "backup": "Sao lưu tệp được phục vụ cùng cơ sở dữ liệu và cấu hình File Browser; thử khôi phục trong môi trường cô lập."
    },
    "en": {
      "overview": "Follow upstream documentation; this catalog is not a tested deployment recipe.",
      "steps": [
        "Read the README security warnings before considering this unmaintained software.",
        "If continuing to use it, follow upstream documentation; run an unprivileged container and mount only the directory to serve.",
        "Keep command execution disabled; place the service behind a proxy with TLS and independent authentication."
      ],
      "backup": "Back up the served files together with the File Browser database and configuration; test restoration in isolation."
    }
  },
  "deploySnippets": {
    "dockerCompose": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://github.com/filebrowser/filebrowser/tree/master/docs",
    "setupScript": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://github.com/filebrowser/filebrowser/tree/master/docs"
  }
};

export default project;
