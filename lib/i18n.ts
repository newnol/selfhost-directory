export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function otherLocale(locale: Locale) {
  return locale === "vi" ? "en" : "vi";
}

export const dictionary = {
  vi: {
    brand: "Selfhost",
    nav: {
      projects: "Dự án",
      alternatives: "Thay thế SaaS",
      submit: "Gửi project"
    },
    hero: {
      eyebrow: "Directory self-hosted song ngữ",
      title: "Khám phá, so sánh và tự host các dự án open source.",
      copy:
        "Một nơi gọn gàng để tìm phần mềm open source có thể tự triển khai, đọc ghi chú bằng tiếng Việt, và chọn đúng công cụ cho VPS hoặc đội nhóm của bạn.",
      primary: "Xem project",
      secondary: "Gửi project để review"
    },
    sections: {
      featured: "Project nổi bật",
      useCases: "Gợi ý theo nhu cầu",
      submit: "Đóng góp project"
    },
    project: {
      stack: "Stack",
      license: "License",
      deploy: "Triển khai",
      resources: "Tài nguyên",
      source: "Source",
      docs: "Docs",
      demo: "Demo",
      score: "Điểm phù hợp",
      requirements: "Yêu cầu đề xuất"
    },
    submit: {
      title: "Gửi project để review",
      copy:
        "Submission sẽ vào hàng chờ review. Bạn có thể dùng webhook để đẩy nội dung này sang Discord, Slack, Make hoặc dashboard riêng.",
      projectName: "Tên project",
      website: "Website hoặc GitHub URL",
      category: "Danh mục",
      description: "Mô tả ngắn",
      submitterName: "Tên của bạn",
      submitterEmail: "Email",
      notes: "Ghi chú cho reviewer",
      send: "Gửi project",
      success: "Đã nhận submission. Cảm ơn bạn!",
      error: "Chưa gửi được. Vui lòng thử lại."
    }
  },
  en: {
    brand: "Selfhost",
    nav: {
      projects: "Projects",
      alternatives: "SaaS alternatives",
      submit: "Submit project"
    },
    hero: {
      eyebrow: "Bilingual self-hosted directory",
      title: "Discover, compare, and self-host open source projects.",
      copy:
        "A practical directory for finding self-hostable open source software, reading deployment notes, and choosing the right tool for your VPS or team.",
      primary: "Browse projects",
      secondary: "Submit for review"
    },
    sections: {
      featured: "Featured projects",
      useCases: "Browse by use case",
      submit: "Contribute a project"
    },
    project: {
      stack: "Stack",
      license: "License",
      deploy: "Deploy",
      resources: "Resources",
      source: "Source",
      docs: "Docs",
      demo: "Demo",
      score: "Fit score",
      requirements: "Suggested requirements"
    },
    submit: {
      title: "Submit a project for review",
      copy:
        "Submissions enter your review queue. Configure a webhook to forward them to Discord, Slack, Make, or a custom dashboard.",
      projectName: "Project name",
      website: "Website or GitHub URL",
      category: "Category",
      description: "Short description",
      submitterName: "Your name",
      submitterEmail: "Email",
      notes: "Reviewer notes",
      send: "Submit project",
      success: "Submission received. Thank you!",
      error: "Could not submit yet. Please try again."
    }
  }
} as const;
