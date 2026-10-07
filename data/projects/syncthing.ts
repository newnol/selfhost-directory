import type { Project } from "../types";

// Legacy score is a neutral compatibility placeholder, not a rating.
const project: Project = {
  "slug": "syncthing",
  "name": "Syncthing",
  "categorySlug": "media",
  "category": "File Synchronization",
  "tags": [
    "files",
    "sync",
    "peer-to-peer"
  ],
  "stack": [
    "Go"
  ],
  "license": "MPL-2.0",
  "deploy": "Binary",
  "summary": {
    "vi": "Đồng bộ tệp liên tục giữa các thiết bị do bạn quản lý, không cần kho lưu trữ đám mây trung tâm.",
    "en": "Continuously synchronizes files between devices you control without requiring central cloud storage."
  },
  "notes": {
    "vi": "Cần cài đặt và ghép nối các thiết bị tham gia. Đồng bộ không thay thế sao lưu: việc xóa tệp cũng có thể được truyền sang thiết bị khác.",
    "en": "Install and pair each participating device. Synchronization is not a backup: file deletions can propagate to other devices."
  },
  "iconUrl": "https://avatars.githubusercontent.com/u/7628018?v=4",
  "requirements": "CPU/RAM/disk not verified; size for your workload. / CPU/RAM/đĩa chưa xác minh; chọn theo khối lượng sử dụng.",
  "structuredRequirements": {
    "provenance": {
      "kind": "estimate",
      "note": {"en": "Resource values are unknown, not measured or verified. Review official installation docs and test your workload.", "vi": "Chưa có số liệu tài nguyên được đo hoặc xác minh. Đọc tài liệu cài đặt chính thức và thử với nhu cầu thực tế; các mức CPU, RAM, ổ đĩa và kiến trúc vẫn chưa rõ."}
    }
  },
  "score": 0,
  "links": {
    "source": "https://github.com/syncthing/syncthing",
    "docs": "https://docs.syncthing.net/intro/getting-started.html"
  },
  "deployGuide": {
    "vi": {
      "overview": "Làm theo tài liệu chính thức; mục này không phải hướng dẫn triển khai đã kiểm thử.",
      "steps": [
        "Tải bản phát hành chính thức phù hợp với hệ điều hành của từng thiết bị.",
        "Chạy Syncthing, mở giao diện quản trị cục bộ và ghép nối bằng mã thiết bị.",
        "Chọn thư mục chia sẻ, xác nhận trên thiết bị còn lại và kiểm tra bằng tệp thử."
      ],
      "backup": "Duy trì bản sao lưu độc lập có lịch sử phiên bản; lưu cả cấu hình và danh tính thiết bị để phục hồi."
    },
    "en": {
      "overview": "Follow upstream documentation; this catalog is not a tested deployment recipe.",
      "steps": [
        "Download the official release for each device's operating system.",
        "Start Syncthing, open its local administration interface and pair devices using device IDs.",
        "Choose a shared folder, accept it on the other device and check synchronization with a test file."
      ],
      "backup": "Maintain independent versioned backups; retain configuration and device identity for recovery."
    }
  },
  "deploySnippets": {
    "dockerCompose": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://docs.syncthing.net/intro/getting-started.html",
    "setupScript": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://docs.syncthing.net/intro/getting-started.html"
  }
};

export default project;
