import type { Project } from "../types";

// Legacy score is a neutral compatibility placeholder, not a rating.
const project: Project = {
  "slug": "beszel",
  "name": "Beszel",
  "categorySlug": "monitoring",
  "category": "Server Monitoring",
  "tags": [
    "monitoring",
    "docker-stats",
    "alerts"
  ],
  "stack": [
    "Go"
  ],
  "license": "MIT",
  "deploy": "Docker Compose",
  "summary": {
    "vi": "Theo dõi máy chủ với lịch sử số liệu, thống kê container Docker và cảnh báo qua mô hình hub và agent.",
    "en": "Server monitoring with historical metrics, Docker container statistics and alerts using a hub-and-agent model."
  },
  "notes": {
    "vi": "Cần triển khai hub và agent cho các máy cần theo dõi. Rà soát quyền truy cập của agent và cấu hình Docker nếu bật thống kê container; mức dùng tài nguyên phụ thuộc số hệ thống và thời gian giữ dữ liệu.",
    "en": "Deploy a hub and agents on monitored machines. Review agent permissions and Docker access when enabling container statistics; resource use depends on system count and data retention."
  },
  "iconUrl": "https://avatars.githubusercontent.com/u/8519632?v=4",
  "requirements": "CPU/RAM/disk not verified; size for your workload. / CPU/RAM/đĩa chưa xác minh; chọn theo khối lượng sử dụng.",
  "structuredRequirements": {
    "provenance": {
      "kind": "estimate",
      "note": {"en": "Resource values are unknown, not measured or verified. Review official installation docs and test your workload.", "vi": "Chưa có số liệu tài nguyên được đo hoặc xác minh. Đọc tài liệu cài đặt chính thức và thử với nhu cầu thực tế; các mức CPU, RAM, ổ đĩa và kiến trúc vẫn chưa rõ."}
    }
  },
  "score": 0,
  "links": {
    "source": "https://github.com/henrygd/beszel",
    "docs": "https://beszel.dev/guide/getting-started"
  },
  "deployGuide": {
    "vi": {
      "overview": "Làm theo tài liệu chính thức; mục này không phải hướng dẫn triển khai đã kiểm thử.",
      "steps": [
        "Làm theo hướng dẫn chính thức để khởi chạy hub với dữ liệu bền vững.",
        "Tạo tài khoản quản trị và dùng hộp thoại Add System để lấy cấu hình agent cho từng máy.",
        "Triển khai agent theo hướng dẫn, xác nhận kết nối rồi cấu hình ngưỡng cảnh báo."
      ],
      "backup": "Sao lưu dữ liệu và cấu hình hub theo tài liệu; giữ cấu hình agent, bảo vệ thông tin xác thực và thử khôi phục hub."
    },
    "en": {
      "overview": "Follow upstream documentation; this catalog is not a tested deployment recipe.",
      "steps": [
        "Follow official instructions to start the hub with persistent storage.",
        "Create an administrator account and use Add System to obtain each machine's agent configuration.",
        "Deploy the agent as instructed, confirm connectivity and configure alert thresholds."
      ],
      "backup": "Back up hub data and configuration following upstream docs; retain agent configuration, protect credentials and test hub restoration."
    }
  },
  "deploySnippets": {
    "dockerCompose": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://beszel.dev/guide/getting-started",
    "setupScript": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://beszel.dev/guide/getting-started"
  }
};

export default project;
