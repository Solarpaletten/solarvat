# SOLAR Platform — Architecture

## Overview

SOLAR Platform — multi-tenant SaaS для регистрации компаний в Швейцарии. Архитектура построена на принципах:

- **Tenant Isolation** — полная изоляция данных между клиентами
- **Role-Based Access** — 4 уровня доступа
- **Server-First** — Server Components по умолчанию
- **Type Safety** — строгая типизация через TypeScript + Prisma

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SOLAR Platform                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │   Public    │   │    Admin    │   │    Client Portal    │   │
│  │  (Catalog)  │   │   (Staff)   │   │     (Mandanten)     │   │
│  └─────────────┘   └─────────────┘   └─────────────────────┘   │
│         │                 │                     │               │
│         └─────────────────┼─────────────────────┘               │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  Middleware │                              │
│                    │   (Auth)    │                              │
│                    └──────┬──────┘                              │
│                           │                                     │
│         ┌─────────────────┼─────────────────────┐               │
│         │                 │                     │               │
│  ┌──────▼──────┐  ┌───────▼───────┐  ┌─────────▼─────────┐     │
│  │   Prisma    │  │   Business    │  │    Calculator     │     │
│  │   Client    │  │    Logic      │  │      (SSR)        │     │
│  └──────┬──────┘  └───────────────┘  └───────────────────┘     │
│         │                                                       │
│  ┌──────▼──────┐                                                │
│  │  PostgreSQL │                                                │
│  └─────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Route Groups

Next.js App Router позволяет группировать роуты без влияния на URL:

```
app/
├── (public)/           # Публичная часть (без auth)
│   ├── page.tsx        # Home
│   ├── catalog/        # Provider catalog
│   └── calculator/     # Cost calculator
│
├── (admin)/admin/      # Admin panel (SOLAR staff only)
│   ├── layout.tsx      # Admin layout
│   ├── page.tsx        # Dashboard
│   ├── tenants/        # Tenant management
│   ├── cases/          # Case management
│   └── catalog/        # Provider catalog (edit)
│
└── (portal)/portal/    # Client portal (mandanten)
    └── [tenantSlug]/   # Dynamic tenant routing
        ├── layout.tsx  # Portal layout
        ├── dashboard/
        ├── cases/
        ├── documents/
        └── invoices/
```

### Почему Route Groups?

1. **Разделение layouts** — Admin и Portal имеют разные layouts
2. **Middleware isolation** — разные правила auth для каждой группы
3. **Code splitting** — оптимизация загрузки

---

## Multi-Tenant Model

```
┌──────────────────────────────────────────────────────────┐
│                      SOLAR (System)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ SOLAR_ADMIN │  │ SOLAR_STAFF │  │  Providers  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└──────────────────────────────────────────────────────────┘
              │
              │ manages
              ▼
┌──────────────────────────────────────────────────────────┐
│                    Tenant (Mandant)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │    Owner    │  │   Members   │  │    Cases    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                           │              │
│                                           ▼              │
│                          ┌────────────────────────────┐  │
│                          │  Steps / Docs / Invoices   │  │
│                          └────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Tenant Isolation

- Каждый Tenant имеет уникальный `slug` для URL
- Membership связывает User с Tenant
- Case привязан к Tenant через `tenantId`
- Documents/Invoices привязаны к Case

---

## Case State Machine

12-шаговый процесс регистрации компании:

```
LEAD
  │
  ▼
KYC_PENDING ───► KYC_APPROVED
  │
  ▼
PROVIDERS_SELECTING ───► PROVIDERS_CONFIRMED
  │
  ▼
NOTARY_SCHEDULED
  │
  ▼
DOCUMENTS_SIGNING
  │
  ▼
FILED
  │
  ▼
REGISTERED
  │
  ▼
VAT_APPLYING ───► VAT_GRANTED
  │
  ▼
ACCOUNTING_SETUP
  │
  ▼
ACTIVE ✓
```

### Step Status

Каждый шаг может иметь статус:

| Status | Значение |
|--------|----------|
| `TODO` | Не начат |
| `IN_PROGRESS` | В работе |
| `DONE` | Завершён |
| `BLOCKED` | Заблокирован |

---

## Provider Catalog

4 блока провайдеров с единой структурой:

```
Provider (base)
├── id, name, type
├── contactEmail, contactPhone
├── website
├── isPrimary, isActive
│
└── ProviderOffer (capabilities)
    ├── cantons[], cities[]
    ├── companyTypes[]
    ├── capabilities[]
    ├── pricing
    └── languages[]
```

### Provider Types

| Type | Описание |
|------|----------|
| `NOTARY` | Нотариус с QES |
| `ADDRESS` | Юридический адрес |
| `DIRECTOR` | Номинальный директор |
| `ACCOUNTING` | Бухгалтерия |
| `QES` | Квалифицированная электронная подпись |

---

## Security Model

### Authentication Flow

```
Request
  │
  ▼
Middleware ───► Check Session Cookie
  │
  │ no session
  ▼
Redirect to /login
  │
  │ valid session
  ▼
Check Role/Permissions
  │
  ▼
Route Handler
```

### Authorization Levels

```
SOLAR_ADMIN
  │ all access
  ▼
SOLAR_STAFF
  │ admin panel, all tenants
  ▼
TENANT_OWNER
  │ own tenant, full control
  ▼
TENANT_MEMBER
  │ own tenant, limited
```

---

## Data Flow

### Cascading Filters (UX)

```
Country ───► Canton ───► City ───► Provider Type
   │            │          │             │
   ▼            ▼          ▼             ▼
  [CH]       [ZG,ZH]    [Zug,Zürich]  [GMBH,AG]
```

URL State: `?canton=ZG&city=ZUG&type=GMBH`

### Calculator (SSR)

```
Input (URL params)
  │
  ▼
Server Component
  │
  ▼
Calculate from lib/calculator.ts
  │
  ▼
Render HTML (instant)
```

---

## Scalability

### Geo-Scale Model

```typescript
interface Country {
  code: string;        // CH, DE, AT
  name: string;
  cantons: Canton[];
}

interface Canton {
  code: string;        // ZG, ZH
  name: string;
  cities: City[];
}

interface City {
  id: string;          // ZUG, ZURICH
  name: string;
}
```

### Database Scaling

- **Read replicas** для Portal
- **Connection pooling** через Prisma
- **Indexes** на tenant_id, case_id

---

## File Structure Conventions

| Папка | Назначение |
|-------|------------|
| `app/` | Next.js App Router pages |
| `components/` | Shared React components |
| `lib/` | Business logic, utilities |
| `prisma/` | Database schema, migrations |
| `public/` | Static assets |
| `docs/` | Documentation |

---

## Key Decisions

| Решение | Причина |
|---------|---------|
| App Router | Server Components, streaming |
| Prisma | Type-safe DB, migrations |
| Route Groups | Layout isolation |
| DE-first | Target market (CH-DE) |
| SSR Calculator | Speed, SEO |
| URL State | Shareable links |

---

*Документ: ARCHITECTURE.md v1.0.0*
