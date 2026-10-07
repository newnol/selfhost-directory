import Link from "next/link";
import type { advise } from "@/lib/advisor";
import type { Locale } from "@/lib/i18n";
import { planningCopy } from "@/lib/planning-copy";
import { ResourceChecks } from "./resource-checks";
export function AdvisorChoice({choice: p, locale}: {choice: ReturnType<typeof advise>["choices"][number]; locale: Locale}) {
  return <li>
    <Link href={`/${locale}/projects/${p.slug}`}>{p.name}</Link>
    <p>{p.reason}</p><p>{p.summary}</p>
    <p><strong>{planningCopy[locale].editorial}: </strong>{p.tradeoff}</p>
    <p>{p.caveat}</p>
    <ResourceChecks result={p.compatibility} locale={locale} />
    <a href={p.docs} target="_blank" rel="noreferrer">Docs</a>
  </li>;
}
