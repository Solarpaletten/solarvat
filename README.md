# SOLAR Platform v1.0.0

**Company Infrastructure OS** — Multi-tenant SaaS для регистрации компаний в Швейцарии.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.14-green)

---

## 🎯 Описание

SOLAR Platform — это полноценная инфраструктурная платформа для:

- **Регистрации GmbH/AG** в Швейцарии
- **Управления провайдерами** (нотариусы, адреса, директора, бухгалтерия)
- **Отслеживания кейсов** от старта до завершения
- **Клиентского портала** для мандантов

### Ключевые возможности

| Функция | Описание |
|---------|----------|
| Multi-tenant | Изоляция данных между клиентами |
| Admin Panel | Управление всеми мандантами и кейсами |
| Client Portal | Личный кабинет для клиентов |
| Provider Catalog | Каталог из 4 блоков (43 записи) |
| Cost Calculator | SSR калькулятор стоимости |
| State Machine | 12-шаговый процесс регистрации |

---

## 🏗️ Архитектура

```
SOLAR Platform v1.0.0
├── 🌐 Public          — Публичный каталог
├── 🔧 Admin           — SOLAR Operations (staff)
│   ├── /admin/tenants
│   ├── /admin/tenants/[tenantId]
│   ├── /admin/cases/[caseId]
│   └── /admin/catalog
└── 👤 Portal          — Client Portal (mandanten)
    └── /portal/[tenantSlug]/dashboard
```

### Технологии

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Database**: PostgreSQL + Prisma 5.14
- **Styling**: Tailwind CSS 3.4
- **i18n**: DE-first (Deutsch)

---

## 📁 Структура проекта

```
solarvat/
├── app/
│   ├── (public)/              # Публичные страницы
│   ├── (admin)/admin/         # Admin panel
│   │   ├── page.tsx           # Dashboard
│   │   ├── tenants/           # Mandanten
│   │   │   ├── page.tsx
│   │   │   └── [tenantId]/
│   │   ├── cases/
│   │   │   └── [caseId]/
│   │   └── catalog/
│   └── (portal)/portal/       # Client portal
│       └── [tenantSlug]/
│           ├── dashboard/
│           ├── cases/[caseId]/
│           ├── documents/
│           └── invoices/
├── lib/
│   ├── types.ts               # TypeScript types
│   ├── calculator.ts          # Pricing logic
│   ├── i18n/de.ts             # German translations
│   └── data/                  # Static data (43 records)
├── prisma/
│   ├── schema.prisma          # 12 models
│   └── seed.ts                # Demo data
├── components/
│   └── Filters.tsx            # Cascading filters
└── docs/
    ├── ARCHITECTURE.md
    ├── ROUTING.md
    ├── PRISMA.md
    └── SETUP.md
```

---

## 🚀 Quick Start

### Требования

- Node.js 18+
- pnpm 8+ (рекомендуется)
- PostgreSQL 14+ (опционально для dev)

### Установка

```bash
# 1. Clone
git clone https://github.com/Solarpaletten/solarvat.git
cd solarvat

# 2. Install
pnpm install

# 3. Environment
cp .env.example .env

# 4. Database (optional)
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Run
pnpm dev
```

Открыть: http://localhost:3000

### Production Build

```bash
pnpm build
pnpm start
```

---

## 📖 Документация

| Документ | Описание |
|----------|----------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Общая архитектура системы |
| [ROUTING.md](docs/ROUTING.md) | Структура маршрутов |
| [PRISMA.md](docs/PRISMA.md) | Схема базы данных |
| [SETUP.md](docs/SETUP.md) | Инструкции по установке |

---

## 📊 Каталог провайдеров

| Блок | Записей | Описание |
|------|---------|----------|
| Notaries | 13 | Нотариусы с QES |
| Addresses | 8 | Юридические адреса |
| Directors | 7 | Номинальные директора |
| Accounting | 10 | Бухгалтерские фирмы |
| **QES** | 5 | Провайдеры цифровой подписи |

---

## 🔒 Роли и доступ

| Role | Scope | Access |
|------|-------|--------|
| `SOLAR_ADMIN` | System | Полный доступ |
| `SOLAR_STAFF` | System | Admin, все tenants |
| `TENANT_OWNER` | Tenant | Свой tenant, полный |
| `TENANT_MEMBER` | Tenant | Свой tenant, ограниченный |

---

## 🛣️ Roadmap

### v1.0.0 (Current) ✅
- [x] Multi-tenant architecture
- [x] Admin panel
- [x] Client portal
- [x] Provider catalog
- [x] Case state machine
- [x] DE-first i18n

### v1.1.0 (Next)
- [ ] Authentication (Login/Register)
- [ ] Real sessions
- [ ] Protected routes
- [ ] Email notifications

### v1.2.0 (Future)
- [ ] Payment integration
- [ ] Document upload
- [ ] B-permit checklist

---

## 📄 License

Private — SOLAR GmbH Zürich

---

## 👥 Team

- **Leanid** — Architect, Vision
- **Dashka** — Senior, Product Owner
- **Claude** — Engineer, Implementation

---

**SOLAR Platform** — От старта → до GmbH/AG → B-permit → бизнес. 🚀
