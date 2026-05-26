# selfhost.io.vn

Bilingual self-hosted open source directory built with Next.js for Vercel. The app includes a categorized project directory, Vietnamese/English routes, deployment guides, SaaS alternative pages, and a serverless project submission flow for review.

## Web App

```bash
npm install
npm run dev
```

Open `http://localhost:3000/vi` or `http://localhost:3000/en`.

### Content Structure

Projects live in [data/projects.ts](/Users/newnol/Documents/New%20project%202/data/projects.ts). Each entry has:

- Category metadata via `categorySlug`
- Bilingual summaries and review notes
- Deployment guide overview, steps, and backup notes
- Links to source, docs, and optional demo

Category pages are available at:

```text
/vi/categories/media
/en/categories/media
```

### Project Submission Review Flow

Users submit projects at:

```text
/vi/submit-project
/en/submit-project
```

The form posts to the serverless API route:

```text
/api/submit-project
```

For production on Vercel, set this environment variable to forward submissions to Discord, Slack, Make, Zapier, or your own review endpoint:

```bash
SUBMISSIONS_WEBHOOK_URL=https://your-webhook-url
```

If the variable is not set, submissions are accepted and written to server logs, which is useful for local testing but not ideal for production review.
