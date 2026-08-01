# Jadcup Customer Portal

A responsive, mobile-first React frontend for the Jadcup Customer Portal.

The account application, login, account-status and route-protection flow is connected to the Jadcup API. Dashboard and order content still use local mock data until customer-scoped business endpoints are available.

## Getting Started

```bash
npm install
npm run dev
```

The frontend uses `http://localhost:5020` by default. To use another API host:

```bash
VITE_PORTAL_API_BASE_URL=http://localhost:5020 npm run dev
```

## Routes

| Route | Description |
|---|---|
| `/` | Public marketing home page |
| `/login` | Customer Portal login and session creation |
| `/apply` | Customer account application |
| `/application-status` | Pending, rejected and disabled account status |
| `/dashboard` | Approved-account dashboard (business data is currently mocked) |
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
