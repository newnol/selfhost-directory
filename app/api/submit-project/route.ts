import { NextResponse } from "next/server";

type SubmissionPayload = {
  projectName?: string;
  url?: string;
  category?: string;
  description?: string;
  submitterName?: string;
  submitterEmail?: string;
  notes?: string;
  locale?: string;
  company?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SubmissionPayload | null;

  if (!body || clean(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const submission = {
    projectName: clean(body.projectName),
    url: clean(body.url),
    category: clean(body.category),
    description: clean(body.description),
    submitterName: clean(body.submitterName),
    submitterEmail: clean(body.submitterEmail),
    notes: clean(body.notes),
    locale: clean(body.locale) || "vi",
    submittedAt: new Date().toISOString()
  };

  if (
    submission.projectName.length < 2 ||
    !isValidUrl(submission.url) ||
    submission.category.length < 2 ||
    submission.description.length < 20 ||
    !submission.submitterEmail.includes("@")
  ) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const webhookUrl = process.env.SUBMISSIONS_WEBHOOK_URL;

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `New selfhost.io.vn submission: ${submission.projectName}`,
        submission
      })
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Webhook delivery failed" }, { status: 502 });
    }
  } else {
    console.info("Project submission received", submission);
  }

  return NextResponse.json({ ok: true });
}
