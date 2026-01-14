# SOLAR Platform v1.0.0

**Company Infrastructure OS** — Multi-tenant SaaS для регистрации компаний в Швейцарии.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/solar-gmbh/solar-platform)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748.svg)](https://www.prisma.io/)

---

## 🎯 Что это

SOLAR Platform — это двухуровневая multi-tenant система для управления процессом регистрации GmbH/AG в Швейцарии:

1. **Admin Panel (SOLAR Ops)** — для команды SOLAR: управление клиентами, кейсами, инвойсами
2. **Client Portal** — личный кабинет клиента: отслеживание прогресса, документы, платежи

## ✨ Основные возможности

- 🏢 **Multi-tenancy** — изоляция данных между клиентами
- 📁 **Case Management** — полный workflow регистрации компании (12 шагов)
- 📋 **Provider Catalog** — база нотариусов, адресов, директоров, бухгалтеров (43 записи)
- 💰 **Cost Calculator** — расчёт стоимости по городу и типу компании
- 🔐 **Role-based Access** — SOLAR_ADMIN, SOLAR_STAFF, TENANT_OWNER, TENANT_MEMBER
- 🇩🇪 **DE-first** — интерфейс на немецком языке

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                    SOLAR Platform                        │
├─────────────────┬───────────────────┬───────────────────┤
│   (public)      │     (admin)       │     (portal)      │
│                 │                   │                   │
│   /             │   /admin          │   /portal/[slug]  │
│   /routes/*     │   /admin/tenants  │   /portal/[slug]/ │
│   (Catalog)     │   /admin/cases    │     dashboard     │
│                 │   /admin/invoices │   /portal/[slug]/ │
│                 │   /admin/catalog  │     cases/[id]    │
└─────────────────┴───────────────────┴───────────────────┘
```

## 📚 Документация

| Документ | Описание |
|----------|----------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Общая архитектура системы |
| [ROUTING.md](docs/ROUTING.md) | Структура роутов и динамические пути |
| [PRISMA.md](docs/PRISMA.md) | Модели данных и tenant-логика |
| [SETUP.md](docs/SETUP.md) | Установка и запуск проекта |

## 🚀 Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone https://github.com/solar-gmbh/solar-platform.git
cd solar-platform

# 2. Установить зависимости
pnpm install

# 3. Сгенерировать Prisma Client
pnpm db:generate

# 4. Настроить переменные окружения
cp .env.example .env.local
# Отредактировать DATABASE_URL

# 5. Инициализировать базу данных
pnpm db:push

# 6. Запустить dev-сервер
pnpm dev
```

Открыть: http://localhost:3000

## 📁 Структура проекта

```
solar-platform/
├── app/
│   ├── (public)/           # Публичные страницы
│   ├── (admin)/admin/      # Admin Panel
│   │   ├── page.tsx        # Dashboard
│   │   ├── tenants/        # Mandanten
│   │   ├── cases/          # Fälle
│   │   └── catalog/        # Provider-Katalog
│   ├── (portal)/portal/    # Client Portal
│   │   └── [tenantSlug]/   # Dynamic tenant routing
│   └── routes/             # Catalog pages (legacy)
├── lib/
│   ├── auth.ts             # Auth utilities
│   ├── types.ts            # TypeScript types
│   ├── calculator.ts       # Cost calculation
│   └── data/               # Static provider data
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── middleware.ts           # Auth guards
└── docs/                   # Documentation
```

## 🛠️ Tech Stack

| Категория | Технология |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.4 |
| Styling | Tailwind CSS 3.4 |
| Database | PostgreSQL + Prisma 5.14 |
| Auth | Session-based (HttpOnly cookies) |
| Deployment | Vercel / Docker |

## 📊 Модели данных

**Core:**
- `User` — пользователи системы
- `Tenant` — клиенты (организации)
- `Membership` — связь User ↔ Tenant с ролью

**Cases:**
- `Case` — процесс регистрации компании
- `CaseStep` — шаги workflow (12 типов)
- `CaseProvider` — выбранные провайдеры для кейса

**Providers:**
- `Provider` — нотариусы, адреса, директора, бухгалтеры
- `ProviderOffer` — цены и возможности провайдера

**Billing:**
- `Invoice` — счета
- `Payment` — платежи
- `Document` — документы с подписями

## 🔄 Case Workflow

```
LEAD → KYC_PENDING → KYC_APPROVED
                          ↓
         PROVIDERS_SELECTING → PROVIDERS_CONFIRMED
                                       ↓
              NOTARY_SCHEDULED → DOCUMENTS_SIGNING → FILED
                                                       ↓
                      REGISTERED → VAT_APPLYING → VAT_GRANTED → ACTIVE
```

## 📈 Roadmap

### v1.0.0 ✅ (Current)
- [x] Multi-tenant architecture
- [x] Admin Panel (Dashboard, Tenants, Cases)
- [x] Client Portal (Dashboard, Case view)
- [x] Provider Catalog (4 блока, 43 записи)
- [x] Cost Calculator
- [x] Prisma Schema (12 моделей)
- [x] Case State Machine

### v1.1.0 🔜 (Next)
- [ ] Auth (Login / Register)
- [ ] Real session management
- [ ] Protected routes (middleware)
- [ ] User-Tenant binding

### v1.2.0 📋 (Planned)
- [ ] Case creation wizard
- [ ] Provider selection UI
- [ ] Invoice generation
- [ ] Document upload (S3/R2)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

Proprietary — SOLAR GmbH Zürich

---

**Built with ❤️ by SOLAR Team**
