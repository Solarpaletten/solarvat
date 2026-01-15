# SOLAR Platform — Setup Guide

## Требования

| Компонент | Версия | Обязательно |
|-----------|--------|-------------|
| Node.js | 18+ | ✅ |
| pnpm | 8+ | ✅ (рекомендуется) |
| npm | 9+ | ✅ (альтернатива) |
| PostgreSQL | 14+ | ⚪ (для production) |

---

## Quick Start (5 шагов)

```bash
# 1. Clone repository
git clone https://github.com/Solarpaletten/solarvat.git
cd solarvat

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env

# 4. Generate Prisma Client
pnpm db:generate

# 5. Start development server
pnpm dev
```

Открыть: **http://localhost:3000**

---

## Подробная установка

### 1. Клонирование

```bash
git clone https://github.com/Solarpaletten/solarvat.git
cd solarvat
```

### 2. Установка зависимостей

**pnpm (рекомендуется):**
```bash
pnpm install
```

**npm (альтернатива):**
```bash
npm install
```

**При ошибке Prisma:**
```bash
pnpm approve-builds  # Выбрать prisma
# или
npm install --ignore-scripts && npx prisma generate
```

### 3. Environment Variables

Создать `.env` из шаблона:

```bash
cp .env.example .env
```

**Минимальная конфигурация:**

```env
# Database (optional for dev)
DATABASE_URL="postgresql://user:password@localhost:5432/solar"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Production конфигурация:**

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="your-secret-key-min-32-chars"

# App
NEXT_PUBLIC_APP_URL="https://solar-platform.vercel.app"
NODE_ENV="production"
```

---

## Database Setup

### Без PostgreSQL (Development)

Проект работает без базы данных в режиме разработки. Данные загружаются из TypeScript модулей в `lib/data/`.

```bash
pnpm dev  # Работает без DB
```

### С PostgreSQL (Production)

**1. Создать базу данных:**

```bash
createdb solar
```

**2. Настроить DATABASE_URL:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/solar"
```

**3. Сгенерировать Prisma Client:**

```bash
pnpm db:generate
```

**4. Применить схему:**

```bash
pnpm db:push
```

**5. Заполнить seed данными:**

```bash
pnpm db:seed
```

---

## NPM Scripts

| Script | Описание |
|--------|----------|
| `pnpm dev` | Development server (hot reload) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:push` | Push schema to DB |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Open Prisma Studio |

---

## Development

### Запуск сервера

```bash
pnpm dev
```

- **URL**: http://localhost:3000
- **Hot Reload**: автоматически при изменении файлов
- **Turbopack**: включён по умолчанию

### Структура разработки

```
solarvat/
├── app/                 # Pages (Next.js App Router)
├── components/          # React components
├── lib/                 # Business logic
│   ├── data/            # Static data
│   ├── types.ts         # TypeScript types
│   └── calculator.ts    # Pricing logic
├── prisma/              # Database
│   ├── schema.prisma
│   └── seed.ts
└── public/              # Static files
```

### TypeScript

Проект использует строгую типизацию:

```bash
# Проверка типов
pnpm tsc --noEmit
```

### Linting

```bash
pnpm lint
```

---

## Production Build

### 1. Build

```bash
pnpm build
```

**Ожидаемый output:**

```
Route (app)                              Size     First Load JS
├ ○ /                                    177 B    94.1 kB
├ ƒ /admin                               138 B    87.2 kB
├ ƒ /admin/cases/[caseId]                195 B    94.1 kB
├ ƒ /admin/tenants/[tenantId]            195 B    94.1 kB
├ ƒ /portal/[tenantSlug]/dashboard       195 B    94.1 kB
└ ...

○ Static   ƒ Dynamic (SSR)
```

### 2. Start

```bash
pnpm start
```

Server запустится на порту 3000.

---

## Deployment

### Vercel (Рекомендуется)

**1-Click Deploy:**

```bash
npm i -g vercel
vercel
```

**Или через Web:**
1. Push to GitHub
2. Import в [vercel.com/new](https://vercel.com/new)
3. Click Deploy

**Environment Variables в Vercel:**
- `DATABASE_URL`
- `AUTH_SECRET`

### Render

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

**Environment:**
- Node 18+
- PostgreSQL (Render Managed)

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t solar-platform .
docker run -p 3000:3000 solar-platform
```

---

## Troubleshooting

### Prisma Client не найден

```bash
# Ошибка
Module '"@prisma/client"' has no exported member 'PrismaClient'

# Решение
pnpm db:generate
# или
npx prisma generate
```

### pnpm блокирует postinstall

```bash
# Ошибка
pnpm: You need to approve builds with pnpm approve-builds

# Решение
pnpm approve-builds
# Выбрать: prisma
```

### TypeScript ошибки

```bash
# Проверить типы
pnpm tsc --noEmit

# Очистить кэш
rm -rf .next
rm -rf node_modules/.cache
```

### Database connection refused

```bash
# Проверить PostgreSQL
pg_isready

# Проверить DATABASE_URL
echo $DATABASE_URL

# Тестовое подключение
psql $DATABASE_URL -c "SELECT 1"
```

---

## Полезные команды

```bash
# Обновить зависимости
pnpm update

# Очистить кэш
rm -rf .next node_modules/.cache

# Пересоздать Prisma Client
rm -rf node_modules/.prisma
pnpm db:generate

# Reset database
pnpm prisma migrate reset

# Открыть Prisma Studio
pnpm db:studio
```

---

## Контакты

- **Repository**: https://github.com/Solarpaletten/solarvat
- **Issues**: https://github.com/Solarpaletten/solarvat/issues

---

*Документ: SETUP.md v1.0.0*
