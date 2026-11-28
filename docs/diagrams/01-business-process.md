# 01 — Business process (As-Is / To-Be)

เว็บ Cyber & Security เป็น static showcase ภาษาไทยของ vertical นี้ (Next.js `output: 'export'`) มีหน้าแรก, `/services/` และหน้า service เดียว `/services/security-readiness-assessment/` ไม่มี form, API, ฐานข้อมูลหรือข้อมูลลูกค้า ผู้ชมคือผู้ซื้อที่อยากดูข้อเสนอและขอบเขตที่ยังไม่ขายจริง; owner เป็นคน build และ deploy

Last reviewed: 2026-11-28 · commit `0e35554`

## As-Is (จากโค้ดวันนี้)

```mermaid
flowchart LR
  DEV["push or PR to main"] --> CI{"ci.yml: shared Node CI (lint, typecheck, Vitest, coverage ≥79%, npm run check) + shared security scan"}
  CI -->|fail| RED["red check, nothing deploys from this workflow"]
  CI -->|pass| GREEN["green check only: ci.yml does not merge, and a push to main landed before CI started"]
  DEV -->|"Vercel Git link: push to main deploys (verified 2026-11-28), separate from ci.yml, not gated by it"| BUILD["next build of main: static export, trailingSlash"]
  BUILD --> GATE{"NEXT_PUBLIC_SITE_URL valid AND NEXT_PUBLIC_SITE_INDEXABLE=true?"}
  GATE -->|"no (default)"| NOIDX["meta noindex,nofollow (canonical still emitted when NEXT_PUBLIC_SITE_URL is valid); robots Disallow / (link-preview bots allowed); sitemap empty"]
  GATE -->|yes| IDX["meta index,follow; canonical (needs only the valid URL); robots allow + sitemap with 3 URLs"]
  NOIDX --> SITE["Vercel static host solo-agency-cyber-security: /, /services/, /services/security-readiness-assessment/"]
  IDX --> SITE
  VIS["visitor or link-preview bot"] --> SITE
  SITE -->|"unknown slug or path"| NF["404 page"]
  SITE -->|"browser exception"| DSN{"NEXT_PUBLIC_SENTRY_DSN set at build?"}
  DSN -->|yes| SCRUB["scrubEvent (beforeSend) drops request, user, breadcrumbs, extra, frame vars, non-platform contexts; strips ?query and #k=v words from message (a bare #word stays); strips ?query/#hash from tags, file names"] --> SENTRY["Sentry error events (SDK client reports and sessions are not passed through scrubEvent)"]
  DSN -->|no| NONE["nothing sent"]
```

Sources: `.github/workflows/ci.yml`, `next.config.ts`, `lib/site-config.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/layout.tsx`, `app/services/[slug]/page.tsx`, `lib/sentry.ts`, `instrumentation-client.ts`, `PRODUCT.md`

ข้อเท็จจริงจากโค้ดและเอกสาร:

- `ci.yml` ไม่มี deploy step; การ deploy ไป Vercel ไม่อยู่ใน repo แต่เป็น Vercel Git link: project `solo-agency-cyber-security` เชื่อม GitHub repo นี้ production branch `main` จึง push เข้า `main` แล้ว deploy (ตรวจผ่าน Vercel API 2026-11-28) เป็นเส้นทางแยกจาก `ci.yml` ไม่ถูก CI gate. production = `main` HEAD 44db6f6 (deploy ผ่าน Vercel Git). การ deploy ด้วย CLI ครั้งเดียวเมื่อ 2026-10-23 (แพตช์ CVE) เป็นประวัติ ไม่ใช่วิธี deploy ปัจจุบัน
- `isIndexable` ต้องมีทั้ง public URL ที่ผ่านการตรวจ (http/https, ไม่มี query/fragment/credentials) และ `NEXT_PUBLIC_SITE_INDEXABLE=true`; ไม่ครบจะเป็น noindex เสมอ; canonical แยกเงื่อนไข: `canonicalUrl()` ขึ้นกับ public URL ที่ผ่านการตรวจอย่างเดียว จึงมี canonical คู่กับ noindex ได้ (ไม่ใช่การตั้งค่าผิด)
- ค่า `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_SITE_INDEXABLE` บน Vercel production ไม่อยู่ใน repo [ต้องยืนยัน]; `PRODUCT.md` (ข้อมูลวันที่ 2026-10-23) บอกว่ายังไม่ตั้ง
- `scrubEvent` (`lib/sentry.ts`) ตัด request, user, breadcrumbs, extra, vars ใน stack frame และ context ที่ไม่ใช่ platform; ตัด ?query และคำ `#key=value` ออกจาก message ตามรูปแบบที่ตรวจจับได้ (คำ `#fragment` เดี่ยวที่ไม่มี `=` ยังอยู่) และตัด ?query/#hash ออกจาก tag, ชื่อไฟล์ (ไม่ได้ตัดข้อความ error ส่วนอื่น); ไม่ส่ง trace/replay. `scrubEvent` ครอบเฉพาะ error event: `sentryOptions()` ไม่ได้ปิดค่าเริ่มต้นของ Browser SDK เช่น client report (เมื่อ event ถูกทิ้ง) และ session (เมื่อมี release) ซึ่งไม่ผ่าน `beforeSend` ผู้ดูแลควรตรวจจาก SDK ที่ติดตั้ง [ต้องยืนยัน]
- Sentry ปิดเมื่อไม่มี DSN; `PRODUCT.md` บอกว่าตั้ง DSN บน Vercel แล้วและมีผลเมื่อ deploy ครั้งถัดไป [ต้องยืนยัน]

## To-Be (PRODUCT.md §Live URL and deploy state)

เสร็จแล้ว (owner action D9, ตรวจ 2026-11-28): Vercel Git link เชื่อมแล้ว การ push เข้า `main` deploy ผ่าน Vercel Git โดยไม่ต้องรัน CLI (เป็นอีกเส้นทางหนึ่งแยกจาก `ci.yml` ไม่ถูก CI gate)

```mermaid
flowchart LR
  DEV["push or PR to main"] --> CI{"ci.yml: shared Node CI (lint, typecheck, Vitest, coverage ≥79%, npm run check) + shared security scan"}
  CI -->|fail| RED["red check, nothing deploys from this workflow"]
  CI -->|pass| GREEN["green check only: ci.yml does not merge, and a push to main landed before CI started"]
  DEV -->|"Vercel Git link: push to main deploys, separate from ci.yml, not gated by it"| BUILD["next build of main: static export, trailingSlash"]
  BUILD --> GATE{"NEXT_PUBLIC_SITE_URL valid AND NEXT_PUBLIC_SITE_INDEXABLE=true?"}
  GATE -->|"no (default)"| NOIDX["meta noindex,nofollow (canonical still emitted when NEXT_PUBLIC_SITE_URL is valid); robots Disallow / (link-preview bots allowed); sitemap empty"]
  GATE -->|yes| IDX["meta index,follow; canonical (needs only the valid URL); robots allow + sitemap with 3 URLs"]
  NOIDX --> SITE["Vercel static host solo-agency-cyber-security: /, /services/, /services/security-readiness-assessment/"]
  IDX --> SITE
  VIS["visitor or link-preview bot"] --> SITE
  SITE -->|"unknown slug or path"| NF["404 page"]
  SITE -->|"browser exception"| DSN{"NEXT_PUBLIC_SENTRY_DSN set at build?"}
  DSN -->|yes| SCRUB["scrubEvent (beforeSend) drops request, user, breadcrumbs, extra, frame vars, non-platform contexts; strips ?query and #k=v words from message (a bare #word stays); strips ?query/#hash from tags, file names"] --> SENTRY["Sentry error events (SDK client reports and sessions are not passed through scrubEvent)"]
  DSN -->|no| NONE["nothing sent"]
```

Sources: `PRODUCT.md` §Live URL and deploy state, §What does not work

## Gap

| ID | As-Is → To-Be | Status | Owner | Evidence |
|---|---|---|---|---|
| G1 | project `solo-agency-cyber-security` ไม่มี Vercel Git link, deploy ล่าสุดที่บันทึกคือ Vercel CLI ครั้งเดียวเป็นข้อยกเว้น (ตาม PRODUCT.md วันที่ 2026-10-23, ไม่ใช่ขั้นตอนปกติ) → เชื่อม Vercel Git ให้ push เข้า `main` deploy | done | owner | `PRODUCT.md` §Live URL and deploy state (owner action D9); Vercel API 2026-11-28: project `solo-agency-cyber-security` Git link → `bookchaowalit-agency/agency-cyber-security-web`, production branch `main` |
| G2 | indexing ปิด (`noindex`, `Disallow: /`, sitemap ว่าง) เพราะยังไม่มี public URL ที่อนุมัติ (ตามหลักฐาน PRODUCT.md 2026-10-23; ค่า env บน Vercel ปัจจุบัน [ต้องยืนยัน]) → ไม่มี To-Be ที่เขียนไว้ว่าจะเปิดเมื่อใด owner กำหนดเงื่อนไขและ URL | decide | owner | `PRODUCT.md` §What does not work (Indexing is off) |

## Open questions

- production build ตั้ง `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_SITE_INDEXABLE` ไว้หรือไม่ (ดูจาก Vercel เท่านั้น)
