"use client";

import { useState } from "react";
import { dictionary, type Locale } from "@/lib/i18n";

type SubmitState = "idle" | "loading" | "success" | "error";

export function SubmitProjectForm({ locale }: { locale: Locale }) {
  const [state, setState] = useState<SubmitState>("idle");
  const t = dictionary[locale].submit;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("loading");

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/submit-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale })
      });

      if (response.ok) {
        form.reset();
        setState("success");
        return;
      }

      setState("error");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="submit-form" onSubmit={handleSubmit}>
      <input className="hidden-field" name="company" tabIndex={-1} autoComplete="off" />
      <label>
        <span>{t.projectName}</span>
        <input name="projectName" required minLength={2} autoComplete="off" placeholder="Immich" />
      </label>
      <label>
        <span>{t.website}</span>
        <input name="url" type="url" required placeholder="https://github.com/..." />
      </label>
      <label>
        <span>{t.category}</span>
        <input name="category" required placeholder="Photos, AI, Monitoring" />
      </label>
      <label>
        <span>{t.description}</span>
        <textarea name="description" required minLength={20} rows={4} />
      </label>
      <div className="form-grid">
        <label>
          <span>{t.submitterName}</span>
          <input name="submitterName" required autoComplete="name" />
        </label>
        <label>
          <span>{t.submitterEmail}</span>
          <input name="submitterEmail" type="email" required autoComplete="email" />
        </label>
      </div>
      <label>
        <span>{t.notes}</span>
        <textarea name="notes" rows={4} />
      </label>
      <button type="submit" disabled={state === "loading"}>
        {state === "loading" ? "..." : t.send}
      </button>
      {state === "success" ? (
        <p className="form-success" role="status" aria-live="polite">
          {t.success}
        </p>
      ) : null}
      {state === "error" ? (
        <p className="form-error" role="alert">
          {t.error}
        </p>
      ) : null}
    </form>
  );
}
