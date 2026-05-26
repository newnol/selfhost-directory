# Contributing to Selfhost Directory

Welcome! **Selfhost Directory** ([selfhost.io.vn](https://selfhost.io.vn)) is a bilingual (Vietnamese/English) catalog of self-hosted open source projects. We help users discover, compare, and deploy self-hosted alternatives to popular SaaS products.

Contributions are welcome in many forms:

- Adding new self-hosted projects
- Improving translations (Vietnamese and English)
- Fixing bugs or improving code
- Suggesting UI/UX improvements
- Adding categories or use cases

---

## Development Setup

### Prerequisites

- **Node.js** 18 or newer
- **pnpm** (package manager)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/selfhost-directory.git
cd selfhost-directory

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open the site at:

- Vietnamese: [http://localhost:3000/vi](http://localhost:3000/vi)
- English: [http://localhost:3000/en](http://localhost:3000/en)

### Verifying Your Changes

Before submitting a PR, always run:

```bash
# TypeScript type-checking
pnpm lint

# Full production build
pnpm build
```

Both commands must pass without errors.

---

## Project Structure

```
app/                    # Next.js App Router pages
  [locale]/             # Locale-specific routes (vi, en)
    page.tsx            # Homepage
    projects/[slug]/    # Individual project pages
    categories/[slug]/  # Category listing pages
    alternatives/[slug] # Use case (SaaS alternative) pages
    submit-project/     # Project submission form
components/             # Reusable React components
data/
  projects.ts           # All project data, categories, and use cases
lib/
  i18n.ts              # Locale definitions and translations
  projects.ts          # Helper functions for querying project data
app/globals.css        # All styles (plain CSS, no UI library)
next.config.ts         # Next.js configuration
```

Key architectural notes:

- Uses **Next.js App Router** with a `[locale]` dynamic segment for i18n
- All styling is done with **plain CSS** (no Tailwind, no component libraries)
- Static site generation via `generateStaticParams()`
- CSS custom properties provide theming and dark mode support

---

## Adding a New Project

All project data lives in `data/projects.ts`. To add a new project:

1. Open `data/projects.ts`
2. Add a new entry to the `projects` array
3. Follow the `Project` type definition

### Minimal Template

```typescript
{
  slug: "your-project",
  name: "Your Project",
  iconUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/your-project.svg",
  categorySlug: "media",
  category: "Files",
  tags: ["storage", "sync", "backup"],
  stack: ["Go", "SQLite", "Docker"],
  license: "MIT",
  deploy: "Docker Compose",
  requirements: "1 vCPU / 1 GB RAM / 10 GB disk",
  score: 75,
  links: {
    source: "https://github.com/org/your-project",
    docs: "https://docs.your-project.org",
    demo: "https://demo.your-project.org"  // optional
  },
  summary: {
    vi: "Mo ta ngan gon bang tieng Viet.",
    en: "A brief one-line description in English."
  },
  notes: {
    vi: "Ghi chu ve cach deploy, luu y quan trong.",
    en: "Notes about deployment and important caveats."
  },
  deployGuide: {
    vi: {
      overview: "Tong quan ve cach cai dat.",
      steps: [
        "Buoc 1: Tao thu muc",
        "Buoc 2: Tao file docker-compose.yml",
        "Buoc 3: Chay docker compose up -d"
      ],
      backup: "Huong dan backup du lieu."
    },
    en: {
      overview: "Overview of how to install.",
      steps: [
        "Step 1: Create a directory",
        "Step 2: Create docker-compose.yml",
        "Step 3: Run docker compose up -d"
      ],
      backup: "How to back up your data."
    }
  },
  deploySnippets: {
    dockerCompose: `version: "3"
services:
  app:
    image: org/your-project:latest
    ports:
      - "8080:8080"
    volumes:
      - ./data:/data
    restart: unless-stopped`,
    setupScript: `#!/bin/bash
mkdir -p ~/your-project && cd ~/your-project
# Download docker-compose.yml
curl -O https://raw.githubusercontent.com/org/your-project/main/docker-compose.yml
docker compose up -d`
  }
}
```

### Field Reference

| Field | Description |
|-------|-------------|
| `slug` | URL-safe identifier (lowercase, hyphens). Becomes `/projects/{slug}` |
| `name` | Display name of the project |
| `iconUrl` | Icon from [homarr-labs/dashboard-icons](https://github.com/homarr-labs/dashboard-icons). Pattern: `https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/{name}.svg` |
| `categorySlug` | Must match an existing category slug (e.g., `media`, `monitoring`, `security`, `data-tools`, `productivity`, `ai`) |
| `category` | Human-readable sub-category within the parent (e.g., "Photos", "Files") |
| `tags` | 2-4 search keywords for discoverability |
| `stack` | Main technologies used (languages, databases, etc.) |
| `license` | SPDX license identifier (e.g., `MIT`, `AGPL-3.0`, `Apache-2.0`) |
| `deploy` | One of: `Docker`, `Docker Compose`, `Helm`, `Binary` |
| `requirements` | Minimum hardware specs (CPU / RAM / disk) |
| `score` | 60-95 based on community adoption, documentation quality, and active maintenance |
| `links` | `source` (GitHub URL), `docs` (documentation URL), optional `demo` |
| `summary` | Bilingual one-line description (`Record<Locale, string>`) |
| `notes` | Bilingual deployment notes |
| `deployGuide` | Bilingual guide with `overview`, `steps` array, and `backup` note |
| `deploySnippets` | Working `dockerCompose` YAML and `setupScript` bash script |

### Score Guidelines

| Range | Meaning |
|-------|---------|
| 90-95 | Industry standard, massive community, excellent docs |
| 80-89 | Well-established, active development, good docs |
| 70-79 | Growing project, decent community, adequate docs |
| 60-69 | Newer or niche project, limited community |

---

## Adding a Category

Categories are defined in the `categories` array in `data/projects.ts`.

```typescript
{
  slug: "networking",
  title: {
    vi: "Mang & VPN",
    en: "Networking & VPN"
  },
  description: {
    vi: "VPN, reverse proxy, DNS va cac cong cu mang.",
    en: "VPN, reverse proxy, DNS, and networking tools."
  }
}
```

Requirements:

- `slug` must be URL-safe (lowercase, hyphens only). It becomes the URL: `/vi/categories/{slug}`
- Both `title` and `description` must have `vi` and `en` entries
- Existing categories: `media`, `monitoring`, `security`, `data-tools`, `productivity`, `ai`

---

## Adding a Use Case (SaaS Alternative)

Use cases connect projects as alternatives to popular SaaS products. They are defined in the `useCases` array in `data/projects.ts`.

```typescript
{
  slug: "github-actions",
  title: {
    vi: "Thay the GitHub Actions",
    en: "GitHub Actions alternatives"
  },
  description: {
    vi: "CI/CD pipeline tu host, khong gioi han minutes.",
    en: "Self-hosted CI/CD pipelines without minute limits."
  },
  projectSlugs: ["drone", "woodpecker"]
}
```

Requirements:

- `slug` must be URL-safe. It becomes the URL: `/vi/alternatives/{slug}`
- `projectSlugs` must reference existing project slugs from the `projects` array
- Both `title` and `description` require `vi` and `en` entries

---

## Translation Guidelines

All user-facing content uses the `Record<Locale, string>` pattern with two keys: `vi` and `en`.

```typescript
summary: {
  vi: "Quan ly anh va video ca nhan tren server rieng.",
  en: "Manage personal photos and videos on your own server."
}
```

### Vietnamese (`vi`)

- Write naturally, as a Vietnamese developer would explain it to a colleague
- Avoid machine-translated text (it reads unnaturally)
- Technical terms can remain in English (e.g., "Docker", "reverse proxy", "backup")
- Keep sentences concise

### English (`en`)

- Be concise and professional
- Use active voice
- Avoid jargon when simpler terms work

### Keeping Languages in Sync

- Always provide both `vi` and `en` when adding or editing content
- If you are not confident in one language, provide your best attempt and note it in the PR description so a reviewer can improve it

---

## Code Conventions

- **TypeScript strict mode** - all code must pass `tsc --noEmit` without errors
- **No external UI libraries** - all styling uses plain CSS in `app/globals.css`
- **File naming**: kebab-case for files (e.g., `project-card.tsx`), PascalCase for component exports (e.g., `export function ProjectCard()`)
- **Imports**: use `@/` path aliases (e.g., `import { projects } from "@/data/projects"`)
- **CSS custom properties** for theming - the site supports dark mode via `prefers-color-scheme`
- **Static generation** - pages use `generateStaticParams()` for SSG; avoid client-side data fetching
- **No `"use client"`** unless absolutely necessary - prefer server components

---

## Pull Request Process

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b feat/add-project-name
   ```

2. **Make your changes** following the guidelines above

3. **Verify** everything works:
   ```bash
   pnpm lint
   pnpm build
   ```

4. **Commit** with a clear message:
   ```
   feat: add Gitea project entry
   fix: correct Vietnamese translation for Immich notes
   docs: update CONTRIBUTING.md with new category info
   ```

5. **Open a Pull Request** with a clear description of what you changed and why

### Tips

- One project per PR is preferred for easier review
- If adding multiple related items (e.g., a category + projects in that category), group them in one PR
- Include screenshots if you made UI changes
- Reference any related issues in your PR description

---

## Submitting via Web Form

If you are not comfortable with Git or code, you can submit a project using the web form:

- Vietnamese: [https://selfhost.io.vn/vi/submit-project](https://selfhost.io.vn/vi/submit-project)
- English: [https://selfhost.io.vn/en/submit-project](https://selfhost.io.vn/en/submit-project)

Submissions go through a review queue and will be added by a maintainer.

---

## Questions?

If you have questions or need help, open an issue on GitHub. We are happy to guide first-time contributors!

Thank you for helping make self-hosting more accessible. 🙏
