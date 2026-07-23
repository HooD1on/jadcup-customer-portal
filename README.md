# Jadcup Customer Portal — Frontend Prototype

A responsive, mobile-first React prototype for the Jadcup Customer Portal.
Uses local mock data only. No backend API connections.

## Getting Started

```bash
npm install
npm run dev
```

## Prototype Routes

| Route | Description |
|---|---|
| `/` | Public marketing home page |
| `/login` | Login placeholder (coming soon) |
| `/apply` | Application placeholder (coming soon) |
| `/dashboard` | Customer dashboard (mock authenticated) |
| `/orders` | Order list with search, filter, pagination |
| `/orders/ORD-2026-0098` | Example order detail (confirmed, 3 products) |
| `/orders/ORD-2026-0072` | Example order detail (delivered, 4 products) |
| `/orders/ORD-2026-0042` | Example order detail (cancelled, missing image) |
| `/_demo` | Developer demo page for loading, empty, and error states |

## Preview at Required Widths

375px, 430px, 768px, 1024px, 1440px

Use browser DevTools responsive mode to verify.

## Build

```bash
npm run build
npm run preview
```

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router 6
- Lucide React icons
