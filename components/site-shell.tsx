"use client";
import { Suspense, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { localeHref } from "@/lib/navigation";
import Link from "next/link";
import { ScrollToTop } from "@/components/scroll-to-top";
import { categories } from "@/data/projects";
import { dictionary, otherLocale, type Locale } from "@/lib/i18n";

function subscribeToLocation(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function LocaleSwitch({ pathname, locale }: { pathname: string | null; locale: Locale }) {
  // Next's hooks trigger renders for client pathname/search navigation; native
  // events also cover fragment navigation and browser back/forward.
  const searchParams = useSearchParams();
  const suffix = useSyncExternalStore(
    subscribeToLocation,
    () => window.location.search + window.location.hash,
    () => searchParams?.size ? `?${searchParams.toString()}` : "",
  );
  return <a className="locale-switch" href={localeHref(pathname, locale) + suffix}>{locale.toUpperCase()}</a>;
}

type SiteShellProps = {
  locale: Locale;
  children: React.ReactNode;
};

export function SiteShell({ locale, children }: SiteShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const t = dictionary[locale];
  const nextLocale = otherLocale(locale);
  const pathname = usePathname();

  return (
    <div className="site-shell" lang={locale}>
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
          <Link aria-current={pathname === `/${locale}/compare` ? "page" : undefined} href={`/${locale}/compare`}>
            {locale === "vi" ? "So sánh" : "Compare"}
          </Link>
          <Link aria-current={pathname === `/${locale}/advisor` ? "page" : undefined} href={`/${locale}/advisor`}>
            {locale === "vi" ? "Tư vấn" : "Advisor"}
          </Link>
          <Link aria-current={pathname === `/${locale}/submit-project` ? "page" : undefined} href={`/${locale}/submit-project`}> {t.nav.submit}</Link>
          <Suspense fallback={<a className="locale-switch" href={localeHref(pathname, nextLocale)}>{nextLocale.toUpperCase()}</a>}>
            <LocaleSwitch pathname={pathname} locale={nextLocale} />
          </Suspense>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="site-footer">
        <div className="footer-brand">
          <strong>selfhost.io.vn</strong>
          <p>
            {locale === "vi"
              ? "Thư mục phần mềm mã nguồn mở để tự host, so sánh và lập kế hoạch cho máy chủ của bạn."
              : "Open source software, reviewed for practical self-hosting."}
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-links-group">
            <h4>{locale === "vi" ? "Danh mục" : "Categories"}</h4>
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
            <h4>{locale === "vi" ? "Liên kết" : "Links"}</h4>
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
                <Link aria-current={pathname === `/${locale}/compare` ? "page" : undefined} href={`/${locale}/compare`}>
                  {locale === "vi" ? "So sánh" : "Compare"}
                </Link>
              </li>
              <li>
                <Link aria-current={pathname === `/${locale}/advisor` ? "page" : undefined} href={`/${locale}/advisor`}>
                  {locale === "vi" ? "Tư vấn" : "Advisor"}
                </Link>
              </li>
              <li>
                <Link aria-current={pathname === `/${locale}/submit-project` ? "page" : undefined} href={`/${locale}/submit-project`}> {t.nav.submit}</Link>
              </li>
              <li>
                <a
                  href="https://github.com/newnol/selfhost-directory"
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
