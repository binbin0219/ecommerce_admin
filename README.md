# Ecommerce Admin

A Next.js (App Router) admin dashboard for sellers to manage their store.

## Status (MVP)

| Area | State |
| --- | --- |
| Auth (login + middleware guard) | working, talks to external API |
| Products list + create/edit/delete | working UI, needs the backend API |
| Dashboard | placeholder until analytics API exists |
| Orders, Categories, Customers, Analytics, Invoices, Promotions, Shipping, Messages, Notifications, Settings | locked in the sidebar (not built) |

The backend is a **separate external API** (`NEXT_PUBLIC_API_URL`) that is not part of
this repo and is not ready yet. Product CRUD calls will surface an error toast until
that API is available.

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000. Set `ENABLE_AUTH=false` in `.env.local` to skip the
login guard while the API is unavailable.

## Expected API endpoints

- `POST /api/auth/login` — proxied by `app/api/auth/login`
- `GET  /sellers/me`
- `GET  /products?sellerId=&page=&pageSize=` → `{ items, totalItems }`
- `POST /products`
- `PUT  /products/:id`
- `DELETE /products/:id`
