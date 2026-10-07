import type { Category } from "./types";
export const categories: Category[] = [
  {
    slug: "media",
    icon: "\uD83C\uDFAC",
    title: { vi: "Media & cá nhân", en: "Media & personal" },
    description: {
      vi: "Ảnh, video, file cá nhân và các dịch vụ thay thế cloud consumer.",
      en: "Photos, videos, personal files, and consumer cloud replacements.",
    },
  },
  {
    slug: "monitoring",
    icon: "\uD83D\uDCCA",
    title: { vi: "Monitoring & vận hành", en: "Monitoring & operations" },
    description: {
      vi: "Theo dõi uptime, cảnh báo, status page và công cụ vận hành VPS.",
      en: "Uptime checks, alerts, status pages, and VPS operations tools.",
    },
  },
  {
    slug: "security",
    icon: "\uD83D\uDD12",
    title: { vi: "Bảo mật", en: "Security" },
    description: {
      vi: "Quản lý mật khẩu, secrets, danh tính và hardening hệ thống.",
      en: "Password managers, secrets, identity, and system hardening.",
    },
  },
  {
    slug: "data-tools",
    icon: "\uD83D\uDDC4\uFE0F",
    title: { vi: "Data & internal tools", en: "Data & internal tools" },
    description: {
      vi: "Database UI, no-code tools, automation và app nội bộ.",
      en: "Database UIs, no-code tools, automation, and internal apps.",
    },
  },
  {
    slug: "productivity",
    icon: "\u2705",
    title: { vi: "Productivity & team", en: "Productivity & team" },
    description: {
      vi: "Quản lý dự án, tài liệu, wiki và workflow cho team nhỏ.",
      en: "Project management, docs, wikis, and workflows for small teams.",
    },
  },
  {
    slug: "ai",
    icon: "\uD83E\uDD16",
    title: { vi: "AI & LLM", en: "AI & LLM" },
    description: {
      vi: "Giao diện AI, LLM gateway, model local và công cụ AI tự host.",
      en: "AI chat UIs, LLM gateways, local models, and self-hosted AI tools.",
    },
  },
];
