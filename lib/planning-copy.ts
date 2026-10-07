export const planningCopy = {
  en: {
    calculator: "Hardware compatibility",
    check: "Check compatibility",
    unknown:
      "Unknown — resource or architecture evidence is missing. Check upstream docs.",
    minimum: "Meets recorded minimum only; not a deployment guarantee.",
    recommended:
      "Meets recorded recommended resources; not a deployment guarantee.",
    "below-minimum": "Below recorded minimum resources.",
    "architecture-mismatch":
      "Architecture is not supported by the recorded requirements.",
    invalid:
      "Invalid input. Use positive CPU, RAM and disk values within supported limits.",
    estimate: "Editorial estimate, unverified",
    warning: "Unverified deployment examples",
    secrets:
      "Do not run unchanged. Replace all placeholder secrets, pin image versions, review privileged access and exposed ports, configure HTTPS and backups. These snippets may be incomplete or outdated; use upstream docs.",
    advisor: "Project advisor",
    compare: "Compare projects",
    choose: "Choose 2–3 distinct projects.",
    fallback:
      "Deterministic catalog suggestions, not a guarantee. Unknown requirements are not evidence of compatibility.",
    error: "Unable to process this request. Check inputs or try again later.",
    loading: "Checking…",
    need: "Use case",
    all: "Any",
    category: "Category",
    deploy: "Deployment",
    send: "Find projects",
    claude:
      "Allow optional Claude ranking (sends selected catalog facts and hardware, no secrets).",
    none: "No catalog choices match the filters.",
    cpu: "Available CPU cores",
    ramGiB: "Available RAM (GiB)",
    diskGiB: "Available disk (GiB)",
    architecture: "Architecture",
  },
  vi: {
    calculator: "Kiểm tra tương thích phần cứng",
    check: "Kiểm tra",
    unknown:
      "Chưa rõ — thiếu dữ liệu tài nguyên hoặc kiến trúc. Kiểm tra tài liệu chính thức.",
    minimum:
      "Chỉ đáp ứng mức tối thiểu đã ghi; không đảm bảo triển khai thành công.",
    recommended:
      "Đáp ứng mức khuyến nghị đã ghi; không đảm bảo triển khai thành công.",
    "below-minimum": "Thấp hơn mức tài nguyên tối thiểu đã ghi.",
    "architecture-mismatch": "Kiến trúc không được hỗ trợ theo dữ liệu đã ghi.",
    invalid:
      "Dữ liệu không hợp lệ. CPU, RAM và dung lượng phải là số dương trong giới hạn.",
    estimate: "Ước lượng biên tập, chưa kiểm chứng",
    warning: "Ví dụ triển khai chưa kiểm chứng",
    secrets:
      "Không chạy nguyên trạng. Thay tất cả secrets mẫu, cố định phiên bản image, xem lại quyền đặc biệt và cổng mở, cấu hình HTTPS và backup. Ví dụ có thể thiếu hoặc lỗi thời; hãy dùng tài liệu chính thức.",
    advisor: "Tư vấn chọn dự án",
    compare: "So sánh dự án",
    choose: "Chọn 2–3 dự án khác nhau.",
    fallback:
      "Gợi ý từ bộ lọc catalog, không đảm bảo vận hành. Thiếu dữ liệu không có nghĩa là tương thích.",
    error: "Không xử lý được yêu cầu. Kiểm tra dữ liệu hoặc thử lại sau.",
    loading: "Đang kiểm tra…",
    need: "Nhu cầu",
    all: "Bất kỳ",
    category: "Danh mục",
    deploy: "Triển khai",
    send: "Tìm dự án",
    claude:
      "Cho phép Claude xếp thứ tự (gửi dữ liệu catalog và phần cứng, không gửi secrets).",
    none: "Không có dự án phù hợp bộ lọc.",
    cpu: "CPU còn trống (core)",
    ramGiB: "RAM còn trống (GiB)",
    diskGiB: "Dung lượng còn trống (GiB)",
    architecture: "Kiến trúc",
  },
} as const;
