"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ScrollToTop } from "@/components/scroll-to-top";
import { categories } from "@/data/projects";
import { dictionary, otherLocale, type Locale } from "@/lib/i18n";

type SiteShellProps = {
  locale: Locale;
  children: React.ReactNode;
};

export function SiteShell({ locale, children }: SiteShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const t = dictionary[locale];
  const nextLocale = otherLocale(locale);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">{locale === "vi" ? "Đến nội dung chính" : "Skip to content"}</a>
      <header className="site-header">
        <Link className="brand" href={`/${locale}`}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v1A2.5 2.5 0 0 1 16.5 10h-9A2.5 2.5 0 0 1 5 7.5v-1Z" />
              <path d="M5 16.5A2.5 2.5 0 0 1 7.5 14h9a2.5 2.5 0 0 1 2.5 2.5v1a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17.5v-1Z" />
              <path d="M8 7h.01" />
              <path d="M8 17h.01" />
            </svg>
          </span>
          <span>{t.brand}</span>
        </Link>
        <button ref={menuButton} type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{locale === "vi" ? (menuOpen ? "Đóng menu" : "Mở menu") : (menuOpen ? "Close menu" : "Open menu")}</button>
        <nav id="mobile-navigation" className={`nav-links${menuOpen ? " is-open" : ""}`} aria-label={locale === "vi" ? "Điều hướng chính" : "Main navigation"} onClick={() => setMenuOpen(false)} onKeyDown={e => { if (e.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }}>
          <Link href={`/${locale}#projects`}>{t.nav.projects}</Link>
          <Link href={`/${locale}#alternatives`}>{t.nav.alternatives}</Link>
          <Link href={`/${locale}/compare`}>
            {locale === "vi" ? "So sánh" : "Compare"}
          </Link>
          <Link href={`/${locale}/advisor`}>
            {locale === "vi" ? "Tư vấn" : "Advisor"}
          </Link>
          <Link href={`/${locale}/submit-project`}>{t.nav.submit}</Link>
          <Link className="locale-switch" href={`/${nextLocale}`}>
            {nextLocale.toUpperCase()}
          </Link>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="site-footer">
        <div className="footer-brand">
          <strong>selfhost.io.vn</strong>
          <p>
            {locale === "vi"
              ? "Thu muc cac du an open source tu host, so sanh va huong dan deploy cho VPS va team nho."
              : "Open source software, reviewed for practical self-hosting."}
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-links-group">
            <h4>{locale === "vi" ? "Danh muc" : "Categories"}</h4>
            <ul>
              {categories.slice(0, 5).map((category) => (
                <li key={category.slug}>
                  <Link href={`/${locale}/categories/${category.slug}`}>
                    {category.title[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-links-group">
            <h4>{locale === "vi" ? "Lien ket" : "Links"}</h4>
            <ul>
              <li>
                <Link href={`/${locale}#projects`}>{t.nav.projects}</Link>
              </li>
              <li>
                <Link href={`/${locale}#alternatives`}>
                  {t.nav.alternatives}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/compare`}>
                  {locale === "vi" ? "So sánh" : "Compare"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/advisor`}>
                  {locale === "vi" ? "Tư vấn" : "Advisor"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/submit-project`}>{t.nav.submit}</Link>
              </li>
              <li>
                <a
                  href="https://github.com/selfhost-io/selfhost-directory"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}
