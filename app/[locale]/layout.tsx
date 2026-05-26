import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { SiteShell } from "@/components/site-shell";

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <SiteShell locale={locale as Locale}>{children}</SiteShell>;
}
