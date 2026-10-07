import type { Project } from "../types";

// Legacy score is a neutral compatibility placeholder, not a rating.
const project: Project = {
  "slug": "stirling-pdf",
  "name": "Stirling PDF",
  "categorySlug": "productivity",
  "category": "PDF Tools",
  "tags": [
    "pdf",
    "ocr",
    "conversion"
  ],
  "stack": [
    "TypeScript"
  ],
  "license": "MIT with directory-specific license exceptions (open-core)",
  "deploy": "Docker",
  "summary": {
    "vi": "Bộ công cụ PDF có thể tự triển khai để gộp, tách, chuyển đổi và xử lý tài liệu qua giao diện web hoặc API.",
    "en": "A self-hostable PDF toolkit for merging, splitting, converting and processing documents through a web interface or API."
  },
  "notes": {
    "vi": "Dự án theo mô hình open-core: giấy phép MIT không áp dụng cho mọi thư mục. Kiểm tra LICENSE và điều khoản của phiên bản sử dụng; tính năng và mức dùng tài nguyên khác nhau giữa các bản triển khai.",
    "en": "The project is open-core: MIT does not cover every directory. Review LICENSE and the terms for your selected edition; features and resource use vary by deployment."
  },
  "iconUrl": "https://avatars.githubusercontent.com/u/139791695?v=4",
  "requirements": "CPU/RAM/disk not verified; size for your workload. / CPU/RAM/đĩa chưa xác minh; chọn theo khối lượng sử dụng.",
  "structuredRequirements": {
    "provenance": {
      "kind": "estimate",
      "note": {"en": "Resource values are unknown, not measured or verified. Review official installation docs and test your workload.", "vi": "Chưa có số liệu tài nguyên được đo hoặc xác minh. Đọc tài liệu cài đặt chính thức và thử với nhu cầu thực tế; các mức CPU, RAM, ổ đĩa và kiến trúc vẫn chưa rõ."}
    }
  },
  "score": 0,
  "links": {
    "source": "https://github.com/Stirling-Tools/Stirling-PDF",
    "docs": "https://docs.stirlingpdf.com/"
  },
  "deployGuide": {
    "vi": {
      "overview": "Làm theo tài liệu chính thức; mục này không phải hướng dẫn triển khai đã kiểm thử.",
      "steps": [
        "Đọc tài liệu về phiên bản và giấy phép để chọn bản triển khai phù hợp.",
        "Làm theo hướng dẫn Docker chính thức; cấu hình lưu trữ và kiểm soát truy cập cho tài liệu nhạy cảm.",
        "Kiểm tra các tác vụ PDF cần dùng bằng tài liệu không nhạy cảm trước khi đưa vào sử dụng."
      ],
      "backup": "Sao lưu cấu hình và dữ liệu bền vững được tài liệu phiên bản yêu cầu; giữ bản sao riêng của tài liệu gốc."
    },
    "en": {
      "overview": "Follow upstream documentation; this catalog is not a tested deployment recipe.",
      "steps": [
        "Read the edition and licensing documentation to choose a suitable deployment.",
        "Follow official Docker instructions; configure storage and access controls for sensitive documents.",
        "Test the PDF operations you need using non-sensitive documents before adoption."
      ],
      "backup": "Back up configuration and persistent data required by your edition's documentation; keep independent copies of source documents."
    }
  },
  "deploySnippets": {
    "dockerCompose": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://docs.stirlingpdf.com/",
    "setupScript": "# Unverified: documentation reference only; no executable deployment is supplied.\n# Chưa kiểm thử: chỉ tham chiếu tài liệu; không cung cấp lệnh triển khai.\n# Official instructions: https://docs.stirlingpdf.com/"
  }
};

export default project;
