import type { Locale } from "./i18n";

/** Keep the current task when changing language; query is already URL encoded. */
export function localeHref(pathname: string | null, locale: Locale, query = "") {
  const path = pathname?.replace(/^\/(vi|en)(?=\/|$)/, `/${locale}`) || `/${locale}`;
  return `${path}${query ? `?${query}` : ""}`;
}
