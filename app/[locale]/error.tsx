"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function RouteError({reset}: {error: Error & {digest?:string}; reset:()=>void}) {
 const locale = usePathname()?.startsWith("/en") ? "en" : "vi";
 return <section className="route-state"><p className="eyebrow">SELFHOST / RETRY</p><h1>{locale === "vi" ? "Chưa thể tải trang" : "We couldn't load this page"}</h1><p role="alert">{locale === "vi" ? "Thử tải lại hoặc quay về thư mục." : "Try again or return to the directory."}</p><div className="hero-actions"><button className="button primary" type="button" onClick={reset}>{locale === "vi" ? "Thử lại" : "Try again"}</button><Link className="button secondary" href={`/${locale}`}>{locale === "vi" ? "Về thư mục" : "Back to directory"}</Link></div></section>;
}
