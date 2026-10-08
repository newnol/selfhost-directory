"use client";

import { useState } from "react";

type CopyCodeBlockProps = {
  code: string;
  label: string;
  language: string;
  copiedLabel: string;
  copyLabel: string;
};

export function CopyCodeBlock({ code, label, language, copiedLabel, copyLabel }: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="code-block">
      <div className="code-block-header">
        <div>
          <span>{label}</span>
          <small>{language}</small>
        </div>
        <button type="button" onClick={copyCode}>
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre tabIndex={0} aria-label={label}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
