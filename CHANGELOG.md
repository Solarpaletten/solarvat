# Changelog

All notable changes to SOLAR Platform will be documented in this file.

## [1.0.0] - 2025-01-14

### 🎉 Initial Release — Company Infrastructure OS

First production-ready release of SOLAR Platform.

### Added

#### Architecture
- **Multi-tenant system** with full tenant isolation
- **Route Groups** — `(public)`, `(admin)`, `(portal)`
- **Dynamic routing** — `[tenantId]`, `[caseId]`, `[tenantSlug]`
- **Server Components** by default (Next.js 14 App Router)

#### Admin Panel (`/admin`)
- Dashboard with stats (Mandanten, Fälle, Rechnungen)
- Tenant management (`/admin/tenants`, `/admin/tenants/[id]`)
- Case management (`/admin/cases/[id]`)
- Provider catalog view

#### Client Portal (`/portal/[slug]`)
- Tenant-specific dashboard
- Case view with progress tracking
- Documents section
- Invoices section

#### Database (Prisma)
- **12 models**: User, Session, Tenant, Membership, Case, CaseStep, CaseProvider, Provider, ProviderOffer, Document, Invoice, InvoiceItem, Payment, Comment
- **4 system roles**: SOLAR_ADMIN, SOLAR_STAFF, TENANT_OWNER, TENANT_MEMBER
- **12-step case state machine**

#### Provider Catalog
- **43 providers** across 5 categories:
  - 13 Notaries (with QES)
  - 8 Legal addresses
  - 7 Nominee directors
  - 10 Accounting firms
  - 5 QES providers

#### Features
- **Cascading filters** (Country → Canton → City)
- **URL state** for shareable links
- **SSR Calculator** for instant pricing
- **DE-first** internationalization

#### Documentation
- README.md
- docs/ARCHITECTURE.md
- docs/ROUTING.md
- docs/PRISMA.md
- docs/SETUP.md

### Technical Stack
- Next.js 14.2
- TypeScript 5.0
- Prisma 5.14
- Tailwind CSS 3.4
- PostgreSQL 14+

### Deployment
- Vercel-ready
- Render-ready
- Docker support

---

## Roadmap

### [1.1.0] — Authentication (Sprint 2)
- [ ] Login page (`/login`)
- [ ] Register page (`/register`)
- [ ] Auth API (`/api/auth/*`)
- [ ] Real sessions (HttpOnly cookies)
- [ ] Protected routes (middleware)

### [1.2.0] — Enhancements (Sprint 3)
- [ ] Mobile navigation
- [ ] Document upload
- [ ] Email notifications
- [ ] B-permit checklist

### [1.3.0] — Payments (Sprint 4)
- [ ] Stripe integration
- [ ] Invoice generation
- [ ] Payment tracking

---

*SOLAR Platform — Company Infrastructure OS*
