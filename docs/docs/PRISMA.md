# SOLAR Platform — Prisma Schema

## Overview

База данных состоит из **12 моделей**, организованных в 4 группы:

1. **Core** — User, Session, Tenant, Membership
2. **Cases** — Case, CaseStep, CaseProvider
3. **Providers** — Provider, ProviderOffer
4. **Billing** — Invoice, InvoiceItem, Payment, Document, Comment

---

## Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│      User       │◄───────►│   Membership    │
│  (systemRole)   │         │  (tenantRole)   │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │ sessions                  │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│     Session     │         │     Tenant      │
│  (HttpOnly)     │         │  (slug, UID)    │
└─────────────────┘         └────────┬────────┘
                                     │
                                     │ cases
                                     ▼
                            ┌─────────────────┐
                            │      Case       │
                            │ (state machine) │
                            └────────┬────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    CaseStep     │         │  CaseProvider   │         │    Document     │
│  (12 types)     │         │  (4 roles)      │         │  (files)        │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │    Provider     │◄────────┐
                            │  (5 types)      │         │
                            └────────┬────────┘         │
                                     │                  │
                                     ▼                  │
                            ┌─────────────────┐         │
                            │  ProviderOffer  │─────────┘
                            │ (capabilities)  │
                            └─────────────────┘
```

---

## Models

### 1. User

```prisma
model User {
  id          String     @id @default(cuid())
  email       String     @unique
  password    String     // bcrypt hash
  name        String?
  systemRole  SystemRole @default(USER)
  
  sessions    Session[]
  memberships Membership[]
  assignedSteps CaseStep[]
  comments    Comment[]
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum SystemRole {
  SOLAR_ADMIN   // Full system access
  SOLAR_STAFF   // Admin panel access
  USER          // Regular user
}
```

---

### 2. Session

```prisma
model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([token])
  @@index([userId])
}
```

---

### 3. Tenant (Mandant)

```prisma
model Tenant {
  id        String       @id @default(cuid())
  slug      String       @unique  // URL-friendly: "acme-gmbh"
  name      String                // "ACME GmbH"
  status    TenantStatus @default(ACTIVE)
  
  // Swiss company details
  uid       String?      // CHE-123.456.789
  vatNumber String?      // MWST number
  
  // Address
  street    String?
  city      String?
  canton    String?
  postalCode String?
  country   String       @default("CH")
  
  memberships Membership[]
  cases       Case[]
  invoices    Invoice[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([slug])
}

enum TenantStatus {
  PENDING
  ACTIVE
  SUSPENDED
  CLOSED
}
```

---

### 4. Membership

```prisma
model Membership {
  id       String     @id @default(cuid())
  userId   String
  tenantId String
  role     TenantRole @default(MEMBER)
  
  user     User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant   Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  createdAt DateTime  @default(now())
  
  @@unique([userId, tenantId])
  @@index([tenantId])
}

enum TenantRole {
  OWNER   // Full tenant access
  MEMBER  // Limited access
}
```

---

### 5. Case

```prisma
model Case {
  id          String     @id @default(cuid())
  caseNumber  String     @unique  // "CASE-2024-001"
  tenantId    String
  tenant      Tenant     @relation(fields: [tenantId], references: [id])
  
  // Company being registered
  companyName String
  companyType CompanyType
  
  // State machine
  status      CaseStatus @default(LEAD)
  
  // Relations
  steps       CaseStep[]
  providers   CaseProvider[]
  documents   Document[]
  invoices    Invoice[]
  comments    Comment[]
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  @@index([tenantId])
  @@index([status])
}

enum CompanyType {
  GMBH
  AG
  EINZELFIRMA
  KOLLEKTIVGESELLSCHAFT
}

enum CaseStatus {
  LEAD
  KYC_PENDING
  KYC_APPROVED
  PROVIDERS_SELECTING
  PROVIDERS_CONFIRMED
  NOTARY_SCHEDULED
  DOCUMENTS_SIGNING
  FILED
  REGISTERED
  VAT_APPLYING
  VAT_GRANTED
  ACCOUNTING_SETUP
  ACTIVE
}
```

---

### 6. CaseStep

```prisma
model CaseStep {
  id         String     @id @default(cuid())
  caseId     String
  case       Case       @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  stepType   StepType
  status     StepStatus @default(TODO)
  
  assigneeId String?
  assignee   User?      @relation(fields: [assigneeId], references: [id])
  
  dueDate    DateTime?
  completedAt DateTime?
  notes      String?
  
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  
  @@unique([caseId, stepType])
  @@index([caseId])
}

enum StepType {
  LEAD_CAPTURE
  KYC_VERIFICATION
  PROVIDER_SELECTION
  NOTARY_BOOKING
  DOCUMENT_PREPARATION
  NOTARY_APPOINTMENT
  HR_FILING
  REGISTRATION_COMPLETE
  VAT_APPLICATION
  VAT_CONFIRMATION
  ACCOUNTING_SETUP
  HANDOVER
}

enum StepStatus {
  TODO
  IN_PROGRESS
  DONE
  BLOCKED
}
```

---

### 7. Provider

```prisma
model Provider {
  id           String       @id @default(cuid())
  type         ProviderType
  name         String
  
  // Contact
  contactEmail String?
  contactPhone String?
  website      String?
  
  // Status
  isPrimary    Boolean      @default(false)
  isActive     Boolean      @default(true)
  
  offers       ProviderOffer[]
  caseProviders CaseProvider[]
  
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  @@index([type])
}

enum ProviderType {
  NOTARY
  ADDRESS
  DIRECTOR
  ACCOUNTING
  QES
}
```

---

### 8. ProviderOffer

```prisma
model ProviderOffer {
  id           String   @id @default(cuid())
  providerId   String
  provider     Provider @relation(fields: [providerId], references: [id], onDelete: Cascade)
  
  // Geographic coverage
  cantons      String[] // ["ZG", "ZH"]
  cities       String[] // ["ZUG", "ZURICH"]
  
  // Capabilities
  companyTypes CompanyType[]
  capabilities String[]
  languages    String[]
  
  // Pricing
  basePrice    Decimal?
  priceUnit    PriceUnit?
  currency     String   @default("CHF")
  
  // Timing
  leadTimeDays Int?
  
  @@index([providerId])
}

enum PriceUnit {
  ONE_TIME
  PER_MONTH
  PER_YEAR
  PER_HOUR
}
```

---

### 9. CaseProvider

```prisma
model CaseProvider {
  id         String           @id @default(cuid())
  caseId     String
  case       Case             @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  providerId String
  provider   Provider         @relation(fields: [providerId], references: [id])
  
  role       CaseProviderRole
  status     String           @default("PENDING")
  
  agreedPrice Decimal?
  notes       String?
  
  createdAt  DateTime         @default(now())
  
  @@unique([caseId, role])
  @@index([caseId])
}

enum CaseProviderRole {
  NOTARY
  ADDRESS
  DIRECTOR
  ACCOUNTING
}
```

---

### 10. Document

```prisma
model Document {
  id          String          @id @default(cuid())
  caseId      String
  case        Case            @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  filename    String
  storageKey  String          // S3 key or file path
  mimeType    String?
  sizeBytes   Int?
  
  category    DocumentCategory
  signatureStatus SignatureStatus @default(NONE)
  
  uploadedAt  DateTime        @default(now())
  
  @@index([caseId])
}

enum DocumentCategory {
  KYC
  ARTICLES
  SIGNATURE
  REGISTRATION
  VAT
  OTHER
}

enum SignatureStatus {
  NONE
  PENDING
  SIGNED
  REJECTED
}
```

---

### 11. Invoice

```prisma
model Invoice {
  id            String        @id @default(cuid())
  invoiceNumber String        @unique  // "INV-2024-001"
  
  tenantId      String
  tenant        Tenant        @relation(fields: [tenantId], references: [id])
  
  caseId        String?
  case          Case?         @relation(fields: [caseId], references: [id])
  
  status        InvoiceStatus @default(DRAFT)
  
  // Amounts
  subtotal      Decimal
  vatRate       Decimal       @default(8.1)  // Swiss VAT
  vatAmount     Decimal
  total         Decimal
  currency      String        @default("CHF")
  
  // Dates
  issuedAt      DateTime?
  dueAt         DateTime?
  paidAt        DateTime?
  
  items         InvoiceItem[]
  payments      Payment[]
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  @@index([tenantId])
  @@index([caseId])
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}
```

---

### 12. Supporting Models

```prisma
model InvoiceItem {
  id          String   @id @default(cuid())
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  description String
  quantity    Int      @default(1)
  unitPrice   Decimal
  amount      Decimal
  category    String?
  
  @@index([invoiceId])
}

model Payment {
  id          String        @id @default(cuid())
  invoiceId   String
  invoice     Invoice       @relation(fields: [invoiceId], references: [id])
  
  amount      Decimal
  method      PaymentMethod
  status      PaymentStatus @default(PENDING)
  
  reference   String?       // Bank reference
  paidAt      DateTime?
  
  createdAt   DateTime      @default(now())
  
  @@index([invoiceId])
}

enum PaymentMethod {
  BANK_TRANSFER
  CREDIT_CARD
  TWINT
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

model Comment {
  id         String  @id @default(cuid())
  caseId     String
  case       Case    @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  authorId   String
  author     User    @relation(fields: [authorId], references: [id])
  
  content    String
  isInternal Boolean @default(false)  // Staff-only comments
  
  createdAt  DateTime @default(now())
  
  @@index([caseId])
}
```

---

## Indexes

```prisma
// Performance indexes
@@index([token])      // Session lookup
@@index([slug])       // Tenant by URL
@@index([tenantId])   // All tenant data
@@index([caseId])     // Case relations
@@index([type])       // Provider filtering
@@index([status])     // Case status queries
```

---

## Seed Data

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to DB
pnpm db:push

# Run seed script
pnpm db:seed
```

### Seed включает:

- **43 Providers** (migrated from TS data)
  - 13 Notaries
  - 8 Addresses
  - 7 Directors
  - 10 Accounting
  - 5 QES
- **Demo Tenant** (ACME GmbH)
- **Demo User** (admin@solar.ch)
- **Demo Case** with 12 steps

---

## Migrations

```bash
# Create migration
pnpm prisma migrate dev --name init

# Deploy to production
pnpm prisma migrate deploy

# Reset database
pnpm prisma migrate reset
```

---

## Queries

### Get Tenant with Cases

```typescript
const tenant = await prisma.tenant.findUnique({
  where: { slug: 'acme-gmbh' },
  include: {
    cases: {
      include: {
        steps: true,
        providers: { include: { provider: true } }
      }
    }
  }
});
```

### Get Providers by Canton

```typescript
const providers = await prisma.provider.findMany({
  where: {
    type: 'NOTARY',
    offers: {
      some: {
        cantons: { has: 'ZG' }
      }
    }
  },
  include: { offers: true }
});
```

---

*Документ: PRISMA.md v1.0.0*
