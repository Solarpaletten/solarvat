# SOLAR Platform — Routing

## Overview

Маршрутизация построена на Next.js 14 App Router с использованием:

- **Route Groups** — `(public)`, `(admin)`, `(portal)`
- **Dynamic Routes** — `[tenantId]`, `[caseId]`, `[tenantSlug]`
- **Layouts** — вложенные layouts для каждой группы

---

## Route Map

```
/                           → Home (public)
├── /catalog                → Provider catalog (public)
├── /calculator             → Cost calculator (public)
│
├── /admin                  → Admin dashboard (staff only)
│   ├── /admin/tenants      → Tenant list
│   │   └── /admin/tenants/[tenantId]  → Tenant detail
│   ├── /admin/cases        → Case list
│   │   └── /admin/cases/[caseId]      → Case detail
│   └── /admin/catalog      → Provider catalog (edit)
│
└── /portal/[tenantSlug]    → Client portal (mandanten)
    ├── /portal/[tenantSlug]/dashboard  → Portal dashboard
    ├── /portal/[tenantSlug]/cases      → Case list
    │   └── /portal/[tenantSlug]/cases/[caseId]  → Case detail
    ├── /portal/[tenantSlug]/documents  → Documents
    └── /portal/[tenantSlug]/invoices   → Invoices
```

---

## Route Groups

### (public) — Публичная часть

```
app/(public)/
├── layout.tsx          # Public layout (no auth)
├── page.tsx            # Home
├── catalog/
│   └── page.tsx        # Provider catalog
└── calculator/
    └── page.tsx        # Cost calculator
```

**URL**: `/`, `/catalog`, `/calculator`

**Auth**: Не требуется

---

### (admin) — Admin Panel

```
app/(admin)/admin/
├── layout.tsx          # Admin layout (sidebar, nav)
├── page.tsx            # Dashboard
├── tenants/
│   ├── page.tsx        # Tenant list
│   └── [tenantId]/
│       └── page.tsx    # Tenant detail (DYNAMIC)
├── cases/
│   └── [caseId]/
│       └── page.tsx    # Case detail (DYNAMIC)
└── catalog/
    └── page.tsx        # Provider catalog (edit)
```

**URL**: `/admin`, `/admin/tenants`, `/admin/tenants/123`, `/admin/cases/456`

**Auth**: `SOLAR_ADMIN` или `SOLAR_STAFF`

---

### (portal) — Client Portal

```
app/(portal)/portal/
└── [tenantSlug]/
    ├── layout.tsx      # Portal layout
    ├── dashboard/
    │   └── page.tsx    # Portal dashboard
    ├── cases/
    │   ├── page.tsx    # Case list
    │   └── [caseId]/
    │       └── page.tsx  # Case detail (DYNAMIC)
    ├── documents/
    │   └── page.tsx    # Documents
    └── invoices/
        └── page.tsx    # Invoices
```

**URL**: `/portal/acme-gmbh/dashboard`, `/portal/acme-gmbh/cases/123`

**Auth**: `TENANT_OWNER` или `TENANT_MEMBER` для данного tenant

---

## Dynamic Routes

### [tenantId] — Tenant Detail

```typescript
// app/(admin)/admin/tenants/[tenantId]/page.tsx
interface Props {
  params: { tenantId: string }
}

export default function TenantDetailPage({ params }: Props) {
  const { tenantId } = params;
  // Fetch tenant by ID
}
```

**Пример URL**: `/admin/tenants/clx123abc`

---

### [caseId] — Case Detail

```typescript
// app/(admin)/admin/cases/[caseId]/page.tsx
interface Props {
  params: { caseId: string }
}

export default function CaseDetailPage({ params }: Props) {
  const { caseId } = params;
  // Fetch case by ID
}
```

**Пример URL**: `/admin/cases/case-001`

---

### [tenantSlug] — Portal Routing

```typescript
// app/(portal)/portal/[tenantSlug]/dashboard/page.tsx
interface Props {
  params: { tenantSlug: string }
}

export default function PortalDashboard({ params }: Props) {
  const { tenantSlug } = params;
  // Fetch tenant by slug, verify membership
}
```

**Пример URL**: `/portal/acme-gmbh/dashboard`

---

## Layouts

### Root Layout

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
```

---

### Admin Layout

```typescript
// app/(admin)/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

**Компоненты**:
- Sidebar с навигацией
- Header с user info
- Main content area

---

### Portal Layout

```typescript
// app/(portal)/portal/[tenantSlug]/layout.tsx
export default function PortalLayout({ 
  children, 
  params 
}: { 
  children: ReactNode;
  params: { tenantSlug: string };
}) {
  return (
    <div className="portal-container">
      <PortalNav tenantSlug={params.tenantSlug} />
      <main>{children}</main>
    </div>
  );
}
```

**Компоненты**:
- Tenant-specific navigation
- Dashboard/Cases/Documents/Invoices tabs

---

## URL State (Filters)

Cascading filters сохраняются в URL:

```
/catalog?canton=ZG&city=ZUG&type=GMBH
```

### Query Parameters

| Param | Type | Example |
|-------|------|---------|
| `canton` | string | `ZG`, `ZH` |
| `city` | string | `ZUG`, `ZURICH` |
| `type` | enum | `GMBH`, `AG` |

### Implementation

```typescript
// components/Filters.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const canton = searchParams.get('canton');
  
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };
  
  return (/* ... */);
}
```

---

## Middleware

### Route Protection

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Admin routes
  if (pathname.startsWith('/admin')) {
    const session = getSession(request);
    if (!session || !isStaff(session)) {
      return NextResponse.redirect('/login');
    }
  }
  
  // Portal routes
  if (pathname.startsWith('/portal')) {
    const session = getSession(request);
    if (!session) {
      return NextResponse.redirect('/login');
    }
    // Check tenant membership
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*']
};
```

---

## API Routes

```
app/api/
├── auth/
│   ├── login/route.ts      # POST /api/auth/login
│   ├── register/route.ts   # POST /api/auth/register
│   └── logout/route.ts     # POST /api/auth/logout
├── tenants/
│   └── route.ts            # GET/POST /api/tenants
├── cases/
│   └── route.ts            # GET/POST /api/cases
└── providers/
    └── route.ts            # GET /api/providers
```

---

## Navigation

### Admin Sidebar

```typescript
const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/tenants', label: 'Mandanten', icon: Users },
  { href: '/admin/cases', label: 'Fälle', icon: Briefcase },
  { href: '/admin/catalog', label: 'Katalog', icon: Book },
];
```

### Portal Tabs

```typescript
const portalNav = (slug: string) => [
  { href: `/portal/${slug}/dashboard`, label: 'Übersicht' },
  { href: `/portal/${slug}/cases`, label: 'Fälle' },
  { href: `/portal/${slug}/documents`, label: 'Dokumente' },
  { href: `/portal/${slug}/invoices`, label: 'Rechnungen' },
];
```

---

## Redirects

### After Login

```typescript
function getRedirectUrl(user: User): string {
  if (user.systemRole === 'SOLAR_ADMIN' || user.systemRole === 'SOLAR_STAFF') {
    return '/admin';
  }
  
  const membership = user.memberships[0];
  if (membership) {
    return `/portal/${membership.tenant.slug}/dashboard`;
  }
  
  return '/';
}
```

---

## Error Handling

### Not Found

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>404 — Seite nicht gefunden</h1>
    </div>
  );
}
```

### Error Boundary

```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h1>Ein Fehler ist aufgetreten</h1>
      <button onClick={reset}>Erneut versuchen</button>
    </div>
  );
}
```

---

*Документ: ROUTING.md v1.0.0*
