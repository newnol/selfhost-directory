"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function NotFound() {
 const locale = usePathname()?.startsWith("/en") ? "en" : "vi";
 return <section className="route-state"><p className="eyebrow">404 / SELFHOST</p><h1>{locale === "vi" ? "Không tìm thấy trang" : "This page isn't in the directory"}</h1><p>{locale === "vi" ? "Dự án hoặc đường dẫn này không có trong thư mục." : "The project or path you requested is not in the catalog."}</p><Link className="button primary" href={`/${locale}#projects`}>{locale === "vi" ? "Về thư mục" : "Back to the directory"}</Link></section>;
}
