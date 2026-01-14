# SOLAR Platform — Architecture

## Overview

SOLAR Platform — двухуровневая multi-tenant SaaS система, построенная на Next.js 14 App Router.

## System Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SOLAR Platform                               │
│                                                                      │
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │   PUBLIC    │  │     ADMIN       │  │        PORTAL           │  │
│  │             │  │   (SOLAR Ops)   │  │   (Client Portal)       │  │
│  │  • Home     │  │                 │  │                         │  │
│  │  • Catalog  │  │  • Dashboard    │  │  • Dashboard            │  │
│  │  • Calc     │  │  • Tenants      │  │  • Cases                │  │
│  │             │  │  • Cases        │  │  • Documents            │  │
│  │             │  │  • Invoices     │  │  • Invoices             │  │
│  │             │  │  • Catalog      │  │                         │  │
│  └─────────────┘  └─────────────────┘  └─────────────────────────┘  │
│         │                  │                      │                  │
│         ▼                  ▼                      ▼                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      MIDDLEWARE                              │    │
│  │                   (Auth Guards)                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    PRISMA / PostgreSQL                       │    │
│  │                                                              │    │
│  │  User │ Tenant │ Membership │ Case │ Provider │ Invoice     │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Route Groups

Next.js App Router организован через Route Groups:

| Group | Path | Purpose | Access |
|-------|------|---------|--------|
| `(public)` | `/`, `/routes/*` | Публичный каталог | Все |
| `(admin)` | `/admin/*` | Админ-панель SOLAR | SOLAR_ADMIN, SOLAR_STAFF |
| `(portal)` | `/portal/[slug]/*` | Личный кабинет клиента | TENANT_* |

## Multi-Tenancy Model

### Path-based Tenancy

```
/portal/[tenantSlug]/dashboard
/portal/[tenantSlug]/cases
/portal/[tenantSlug]/cases/[caseId]
/portal/[tenantSlug]/documents
/portal/[tenantSlug]/invoices
```

`tenantSlug` — уникальный URL-friendly идентификатор организации.

### Data Isolation

```
┌─────────────────────────────────────────────────────────┐
│                        User                              │
│  id: "user-001"                                          │
│  email: "client@example.com"                             │
│  systemRole: USER                                        │
└─────────────────────────────────────────────────────────┘
           │
           │ Membership
           ▼
┌─────────────────────────────────────────────────────────┐
│                       Tenant                             │
│  id: "tenant-001"                                        │
│  slug: "techstart"                                       │
│  name: "TechStart GmbH"                                  │
└─────────────────────────────────────────────────────────┘
           │
           │ Cases, Invoices, Documents
           ▼
┌─────────────────────────────────────────────────────────┐
│                        Case                              │
│  id: "case-001"                                          │
│  tenantId: "tenant-001"  ← Isolation key                 │
│  caseNumber: "SOLAR-2024-0001"                           │
└─────────────────────────────────────────────────────────┘
```

## Role-Based Access Control

### System Roles (User.systemRole)

| Role | Description | Access |
|------|-------------|--------|
| `SOLAR_ADMIN` | Администратор SOLAR | Полный доступ ко всему |
| `SOLAR_STAFF` | Сотрудник SOLAR | Admin panel, все tenants |
| `USER` | Обычный пользователь | Только свои tenants |

### Tenant Roles (Membership.role)

| Role | Description | Permissions |
|------|-------------|-------------|
| `OWNER` | Владелец организации | Полный доступ к tenant |
| `ADMIN` | Администратор tenant | Управление настройками |
| `MEMBER` | Участник | Просмотр и редактирование |
| `VIEWER` | Наблюдатель | Только просмотр |

### Access Matrix

```
                    │ Public │ Admin │ Portal (own) │ Portal (other)
────────────────────┼────────┼───────┼──────────────┼────────────────
SOLAR_ADMIN         │   ✅   │  ✅   │     ✅       │      ✅
SOLAR_STAFF         │   ✅   │  ✅   │     ✅       │      ✅
TENANT_OWNER        │   ✅   │  ❌   │     ✅       │      ❌
TENANT_MEMBER       │   ✅   │  ❌   │     ✅       │      ❌
Unauthenticated     │   ✅   │  ❌   │     ❌       │      ❌
```

## State Machine: Case Workflow

```
                    ┌─────────┐
                    │  LEAD   │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │KYC_PEND │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │KYC_APPR │
                    └────┬────┘
                         │
              ┌──────────▼──────────┐
              │ PROVIDERS_SELECTING │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │ PROVIDERS_CONFIRMED │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  NOTARY_SCHEDULED   │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  DOCUMENTS_SIGNING  │
              └──────────┬──────────┘
                         │
                    ┌────▼────┐
                    │  FILED  │
                    └────┬────┘
                         │
              ┌──────────▼──────────┐
              │     REGISTERED      │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │    VAT_APPLYING     │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │     VAT_GRANTED     │
              └──────────┬──────────┘
                         │
                    ┌────▼────┐
                    │ ACTIVE  │
                    └─────────┘
```

## Component Architecture

### Layouts

```
app/
├── layout.tsx                    # Root layout (public)
├── (admin)/layout.tsx            # Admin layout (sidebar)
└── (portal)/portal/[slug]/
    └── layout.tsx                # Portal layout (client nav)
```

### Server vs Client Components

| Component | Type | Reason |
|-----------|------|--------|
| Pages (`page.tsx`) | Server | Data fetching, SEO |
| Layouts | Server | Shared structure |
| Filters | Client | URL state, interactivity |
| Forms | Client | User input |

## Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js    │────▶│   Prisma    │
│             │     │  App Router │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Server    │     │ PostgreSQL  │
│ Components  │     │ Components  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Security Considerations

1. **Authentication**: Session-based с HttpOnly cookies
2. **Authorization**: Middleware guards на route level
3. **Data isolation**: Tenant ID в каждом запросе
4. **Input validation**: Zod schemas (planned)
5. **CSRF protection**: SameSite cookies

## Scalability

### Current (v1.0)
- Single PostgreSQL instance
- Vercel serverless deployment
- Static data for providers

### Future (v2.0+)
- Connection pooling (Prisma Accelerate)
- Redis for sessions
- S3/R2 for documents
- Multi-region deployment
