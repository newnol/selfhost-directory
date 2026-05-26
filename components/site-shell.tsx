import Link from "next/link";
import { dictionary, otherLocale, type Locale } from "@/lib/i18n";

type SiteShellProps = {
  locale: Locale;
  children: React.ReactNode;
};

export function SiteShell({ locale, children }: SiteShellProps) {
  const t = dictionary[locale];
  const nextLocale = otherLocale(locale);

  return (
    <div className="site-shell">
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
        <nav className="nav-links" aria-label="Main navigation">
          <Link href={`/${locale}#projects`}>{t.nav.projects}</Link>
          <Link href={`/${locale}#alternatives`}>{t.nav.alternatives}</Link>
          <Link href={`/${locale}/submit-project`}>{t.nav.submit}</Link>
          <Link className="locale-switch" href={`/${nextLocale}`}>
            {nextLocale.toUpperCase()}
          </Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>selfhost.io.vn</span>
        <span>Open source software, reviewed for practical self-hosting.</span>
      </footer>
    </div>
  );
}
