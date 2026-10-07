import type { Project } from "../types";

// Legacy score is a neutral compatibility placeholder, not a rating.
const project: Project = {
  "slug": "memos",
  "name": "Memos",
  "categorySlug": "productivity",
  "category": "Notes",
  "tags": [
    "notes",
    "markdown",
    "timeline"
  ],
  "stack": [
    "Go"
  ],
  "license": "MIT",
  "deploy": "Docker",
  "summary": {
    "vi": "Ghi chú Markdown theo dòng thời gian, tìm lại bằng tìm kiếm hoặc thẻ và chọn phạm vi chia sẻ cho từng ghi chú.",
    "en": "Timeline-based Markdown notes with search, tags and per-memo sharing choices."
  },
  "notes": {
    "vi": "Có thể đính kèm hình ảnh và tệp. Đọc yêu cầu nâng cấp trước khi đổi phiên bản; giữ dữ liệu ứng dụng ngoài container và kiểm tra quyền riêng tư của ghi chú.",
    "en": "Notes can include images and files. Read upgrade requirements before changing versions; persist application data outside the container and review memo visibility."
  },
  "iconUrl": "https://avatars.githubusercontent.com/u/95764151?v=4",
  "requirements": "CPU/RAM/disk not verified; size for your workload. / CPU/RAM/đĩa chưa xác minh; chọn theo khối lượng sử dụng.",
  "structuredRequirements": {
    "provenance": {
      "kind": "estimate",
      "note": {"en": "Resource values are unknown, not measured or verified. Review official installation docs and test your workload.", "vi": "Chưa có số liệu tài nguyên được đo hoặc xác minh. Đọc tài liệu cài đặt chính thức và thử với nhu cầu thực tế; các mức CPU, RAM, ổ đĩa và kiến trúc vẫn chưa rõ."}
    }
  },
  "score": 0,
  "links": {
    "source": "https://github.com/usememos/memos",
    "docs": "https://usememos.com/docs/deploy"
  },
  "deployGuide": {
    "vi": {
      "overview": "Làm theo tài liệu chính thức; mục này không phải hướng dẫn triển khai đã kiểm thử.",
      "steps": [
        "Đọc hướng dẫn triển khai và chọn bản phát hành ổn định từ dự án.",
        "Cấu hình thư mục dữ liệu bền vững theo hướng dẫn Docker chính thức.",
        "Tạo tài khoản, viết ghi chú thử và kiểm tra quyền truy cập trước khi chia sẻ."
      ],
      "backup": "Sao lưu cơ sở dữ liệu, tệp đính kèm và cấu hình; có thể xuất thêm ghi chú và thử khôi phục trước khi nâng cấp."
    },
    "en": {
      "overview": "Follow upstream documentation; this catalog is not a tested deployment recipe.",
      "steps": [
        "Read the deployment guide and choose an upstream stable release.",
        "Configure persistent application storage following official Docker instructions.",
        "Create an account, write a test memo and check visibility before sharing."
      ],
      "backup": "Back up the database, attachments and configuration; optionally export memos and test restoration before upgrades."
    }
  },
  "deploySnippets": {
    "dockerCompose": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://usememos.com/docs/deploy",
    "setupScript": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://usememos.com/docs/deploy"
  }
};

export default project;
