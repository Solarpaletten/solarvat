# SOLAR Platform — Routing

## Route Structure

SOLAR Platform использует Next.js 14 App Router с Route Groups для разделения публичной части, админки и клиентского портала.

## Directory Structure

```
app/
├── (public)/                     # Public routes (no auth required)
│   └── (placeholder)
│
├── (admin)/                      # Admin panel
│   ├── layout.tsx                # Admin layout with sidebar
│   └── admin/
│       ├── page.tsx              # Dashboard
│       ├── tenants/
│       │   ├── page.tsx          # Tenants list
│       │   └── [tenantId]/
│       │       ├── page.tsx      # Tenant detail
│       │       └── cases/        # Tenant's cases
│       ├── cases/
│       │   └── [caseId]/
│       │       └── page.tsx      # Case detail
│       ├── invoices/
│       │   └── [invoiceId]/      # Invoice detail
│       └── catalog/
│           ├── notaries/         # Provider catalog
│           ├── addresses/
│           ├── directors/
│           └── accounting/
│
├── (portal)/                     # Client portal
│   └── portal/
│       └── [tenantSlug]/         # Dynamic tenant segment
│           ├── layout.tsx        # Portal layout
│           ├── dashboard/
│           │   └── page.tsx      # Client dashboard
│           ├── cases/
│           │   └── [caseId]/
│           │       └── page.tsx  # Case view (client)
│           ├── documents/        # Documents list
│           └── invoices/         # Invoices list
│
├── routes/                       # Legacy catalog routes
│   ├── notaries/page.tsx
│   ├── addresses/page.tsx
│   ├── directors/page.tsx
│   ├── accounting/page.tsx
│   └── calculator/page.tsx
│
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page
└── globals.css                   # Global styles
```

## Route Groups

### `(public)` — Public Routes

Публичные страницы, доступные без авторизации.

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home / Dashboard |
| `/routes/notaries` | `app/routes/notaries/page.tsx` | Notary catalog |
| `/routes/addresses` | `app/routes/addresses/page.tsx` | Address catalog |
| `/routes/directors` | `app/routes/directors/page.tsx` | Director catalog |
| `/routes/accounting` | `app/routes/accounting/page.tsx` | Accounting catalog |
| `/routes/calculator` | `app/routes/calculator/page.tsx` | Cost calculator |

### `(admin)` — Admin Panel

Административная панель для команды SOLAR.

| Route | File | Description | Dynamic |
|-------|------|-------------|---------|
| `/admin` | `admin/page.tsx` | Dashboard | No |
| `/admin/tenants` | `admin/tenants/page.tsx` | Tenants list | No |
| `/admin/tenants/[id]` | `admin/tenants/[tenantId]/page.tsx` | Tenant detail | ✅ `tenantId` |
| `/admin/cases/[id]` | `admin/cases/[caseId]/page.tsx` | Case detail | ✅ `caseId` |
| `/admin/catalog/*` | `admin/catalog/*/` | Provider catalog | No |

### `(portal)` — Client Portal

Личный кабинет клиента с tenant-specific routing.

| Route | File | Description | Dynamic |
|-------|------|-------------|---------|
| `/portal/[slug]/dashboard` | `[tenantSlug]/dashboard/page.tsx` | Dashboard | ✅ `tenantSlug` |
| `/portal/[slug]/cases` | `[tenantSlug]/cases/page.tsx` | Cases list | ✅ `tenantSlug` |
| `/portal/[slug]/cases/[id]` | `[tenantSlug]/cases/[caseId]/page.tsx` | Case detail | ✅ `tenantSlug`, `caseId` |
| `/portal/[slug]/documents` | `[tenantSlug]/documents/page.tsx` | Documents | ✅ `tenantSlug` |
| `/portal/[slug]/invoices` | `[tenantSlug]/invoices/page.tsx` | Invoices | ✅ `tenantSlug` |

## Dynamic Segments

### `[tenantId]` — Admin Tenant Detail

```tsx
// app/(admin)/admin/tenants/[tenantId]/page.tsx

interface PageProps {
  params: { tenantId: string }
}

export default function TenantDetailPage({ params }: PageProps) {
  const { tenantId } = params
  // Fetch tenant by ID
}
```

### `[caseId]` — Case Detail

```tsx
// app/(admin)/admin/cases/[caseId]/page.tsx

interface PageProps {
  params: { caseId: string }
}

export default function CaseDetailPage({ params }: PageProps) {
  const { caseId } = params
  // Fetch case by ID (case number: SOLAR-2024-0001)
}
```

### `[tenantSlug]` — Portal Tenant Routing

```tsx
// app/(portal)/portal/[tenantSlug]/dashboard/page.tsx

interface PageProps {
  params: { tenantSlug: string }
}

export default function PortalDashboard({ params }: PageProps) {
  const { tenantSlug } = params
  // tenantSlug = "techstart" → fetch tenant by slug
}
```

### Combined: `[tenantSlug]/cases/[caseId]`

```tsx
// app/(portal)/portal/[tenantSlug]/cases/[caseId]/page.tsx

interface PageProps {
  params: { 
    tenantSlug: string
    caseId: string 
  }
}

export default function PortalCaseDetail({ params }: PageProps) {
  const { tenantSlug, caseId } = params
  // 1. Validate tenant access
  // 2. Fetch case belonging to this tenant
}
```

## Layouts

### Root Layout (`app/layout.tsx`)

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### Admin Layout (`app/(admin)/layout.tsx`)

```tsx
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />  {/* Admin navigation */}
      <main>{children}</main>
    </div>
  )
}
```

### Portal Layout (`app/(portal)/portal/[tenantSlug]/layout.tsx`)

```tsx
export default function PortalLayout({ children, params }) {
  const { tenantSlug } = params
  return (
    <div>
      <PortalNav slug={tenantSlug} />
      <main>{children}</main>
    </div>
  )
}
```

## URL State (Search Params)

Фильтры передаются через URL search params для shareable links:

```
/routes/notaries?canton=ZG&city=ZUG&type=GMBH&digital=true
```

### Reading Search Params (Server Component)

```tsx
interface PageProps {
  searchParams: {
    canton?: string
    city?: string
    type?: string
    digital?: string
  }
}

export default function NotariesPage({ searchParams }: PageProps) {
  const canton = searchParams.canton
  const digitalOnly = searchParams.digital === 'true'
  // Filter data
}
```

### Updating Search Params (Client Component)

```tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function Filters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }
}
```

## Middleware Guards

`middleware.ts` проверяет авторизацию на уровне роутов:

```tsx
// Protected routes
const adminRoutes = ['/admin']
const portalRoutes = ['/portal']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSessionFromCookie(request)

  // Admin routes require SOLAR role
  if (pathname.startsWith('/admin')) {
    if (!session || !isAdmin(session)) {
      return redirect('/login')
    }
  }

  // Portal routes require tenant membership
  if (pathname.startsWith('/portal/')) {
    const tenantSlug = pathname.split('/')[2]
    if (!session || !hasTenantAccess(session, tenantSlug)) {
      return redirect('/login')
    }
  }
}
```

## Best Practices

1. **Server Components by default** — все pages являются Server Components
2. **Client Components only when needed** — только для интерактивности
3. **URL as source of truth** — фильтры в URL для shareable links
4. **Type-safe params** — TypeScript interfaces для всех params
5. **Layouts for shared UI** — общий UI через layouts, не дублируя код
