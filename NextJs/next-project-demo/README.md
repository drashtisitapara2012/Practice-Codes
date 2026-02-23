# NextHub - Next.js 16 Comprehensive Showcase

Welcome to **NextHub**, a production-grade demonstration of **Next.js 16** core concepts and advanced features. This project is built to showcase the future of React development with real-world data and modern architecture.

## 🚀 Key Features

- **Next.js 16 & React 19.2**: Optimized with the latest framework and library updates.
- **Cache Components**: Granular caching control using the `"use cache"` directive.
- **Partial Pre-Rendering (PPR)**: Instantly loading page shells with dynamic islands.
- **Turbopack Powered**: Extremely fast builds and developer experience.
- **Server Actions**: Real-world data mutations with `updateTag()` and `refresh()` for read-your-writes semantics.
- **Multiple Rendering Strategies**:
  - **SSG**: Marketing & Home pages.
  - **Streaming SSR**: Dashboard with Suspense boundaries.
  - **ISR**: Movie explorer and Recipe picks.
  - **CSR**: Interactive settings with `useOptimistic`.
- **NextAuth v5**: Secure authentication with multiple providers.
- **Proxy System**: Next.js 16 `proxy.ts` (successor to middleware.ts).

## 🛠 Tech Stack

- **Styling**: Tailwind CSS 4 & Vanilla CSS.
- **Components**: shadcn/ui.
- **Icons**: Lucide React.
- **API integrations**: OpenWeatherMap, NewsData.io, TMDb, TheMealDB.

## 🏁 Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and add your API keys:
- **TMDb**: https://www.themoviedb.org/settings/api
- **Weather**: https://openweathermap.org/api
- **News**: https://newsdata.io/

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
*Note: Next.js 16 uses Turbopack by default.*

## 📖 Feature Demos

- **Dashboard**: `app/(dashboard)/dashboard/page.tsx` - Demonstrates Streaming SSR.
- **Caching Logic**: `lib/api/` - Uses `"use cache"` with `cacheLife` and `cacheTag`.
- **Mutations**: `app/actions/` - Uses `updateTag` and `refresh` to invalidate caches.
- **Interception**: `proxy.ts` - Replacement for middleware.
- **Catch-all**: `app/docs/[...slug]/page.tsx` - Dynamic documentation system.

---
Built with ❤️ by Antigravity.
