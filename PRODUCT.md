# Cyber & Security — Product truth

> Inferred from the code and copy (no user interview) on 2026-10-23. The portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`) has no row for this site; nothing here goes
> beyond what the pages render.

## What it is

A static, Thai-language showcase for the Cyber & Security (ความมั่นคงปลอดภัย) vertical, status `target` /
P1, with one service page for "Security readiness assessment".

## Who it is for

CISO, CIO และเจ้าของระบบสำคัญ: a visitor who wants to see what the first scoped offer would be and what it will not claim.

## What works today

1. `/` shows the promise, the problem, the offer and its scope (Cybersecurity, AI security, OT/ICS security, Incident response) and a plain readiness
   note ("เตรียมไว้ใน portfolio").
2. `/services/security-readiness-assessment/` lists the workflow (4 steps), deliverables (4),
   evidence boundary (3) and readiness gate, with Service and BreadcrumbList JSON-LD.
3. Builds are noindex with `Disallow: /` unless `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_SITE_INDEXABLE=true` are
   both set; then robots allows crawling and the sitemap lists `/`, `/services/` and the service page.
4. Browser errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No lead form, inquiry intake, booking, account, API, database, payment or analytics identifier.
- No customers, case studies, certifications or delivery results. The service is described, not sold.
- Indexing is off on the live site (no approved `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_SITE_INDEXABLE`).

## Live URL and deploy state

- Live: https://solo-agency-cyber-security.vercel.app (HTTP 200 on 2026-10-23).
- The Vercel project `solo-agency-cyber-security` has no Git link, so a push to `main` does not deploy. The last production deploy
  is the CVE patch (2026-10-23 11:40, commit f6828ef), made by Vercel CLI under the owner's one-off exception. Later `main` commits (tests,
  Sentry, CI, docs, the trailing-slash canonical fix) stay undeployed until the owner connects Vercel Git to
  `bookchaowalit-agency/agency-cyber-security-web` (owner action D9).
- `NEXT_PUBLIC_SENTRY_DSN` is set on the Vercel project (Sentry project `agency-cyber-security-web`, org `personal-yu0`);
  it takes effect with the next deploy.

## Boundaries

- Static export (`output: 'export'`): HTML, CSS and JS only, no server code.
- Public-safe copy only: no client records, threat/health/transaction data, credentials or private links.
