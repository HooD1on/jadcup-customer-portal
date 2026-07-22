# Jadcup Customer Portal — Implementation Plan

> **Status:** Draft — awaiting review before implementation begins.
> **Date:** 2026-07-22
> **Repository:** jadcup-customer-portal (empty — greenfield)
> **Backend:** jadcup-api (.NET/C# — read-only inspection, no modifications)

---

## 1. Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | React 18 + TypeScript | Type safety, ecosystem maturity |
| Build tool | Vite | Fast HMR, simple config, smaller bundles than CRA |
| Routing | React Router v6 | Standard SPA routing, layout nesting |
| Styling | Tailwind CSS 3 | Utility-first, mobile-first by design, rapid prototyping |
| HTTP client | Axios | Interceptors for auth token injection and error handling |
| State | React Context + useReducer | Sufficient for auth state; no global store needed initially |
| Forms | React Hook Form + Zod | Validation, performance, schema-based |
| Testing | Vitest + React Testing Library + Playwright | Unit, component, and E2E coverage |
| Linting | ESLint + Prettier | Consistency |

---

## 2. Recommended Folder Structure

```
src/
├── api/                    # Axios instance, endpoint functions
│   ├── client.ts           # Axios config, interceptors
│   ├── auth.ts
│   ├── orders.ts
│   ├── products.ts
│   ├── credit.ts
│   └── account.ts
├── assets/                 # Static images, icons, brand assets
├── components/             # Shared/reusable components
│   ├── ui/                 # Button, Card, Input, Modal, Badge, Spinner
│   ├── layout/             # Header, Footer, Sidebar, MobileNav, PageShell
│   └── feedback/           # LoadingState, EmptyState, ErrorState
├── features/               # Feature-scoped modules
│   ├── auth/               # Login, ForgotPassword, ActivateAccount
│   ├── apply/              # ApplicationForm, ApplicationSubmitted
│   ├── dashboard/          # DashboardPage
│   ├── orders/             # OrderList, OrderDetail, OrderProductCard
│   ├── products/           # ProductCatalog, ProductCard
│   ├── credit/             # CreditSummary, TransactionList
│   ├── account/            # AccountProfile
│   └── support/            # SupportPage, ContactForm
├── hooks/                  # Custom hooks (useAuth, useOrders, etc.)
├── contexts/               # AuthContext, CustomerContext
├── guards/                 # ProtectedRoute, PublicOnlyRoute
├── types/                  # TypeScript interfaces (portal-specific)
├── lib/                    # Utility helpers (formatCurrency, formatDate)
├── mocks/                  # MSW handlers, fixture data
├── routes/                 # Route definitions
│   └── index.tsx
├── App.tsx
├── main.tsx
└── index.css               # Tailwind directives
```

---

## 3. Route Structure

### Public Routes (no auth required)

| Path | Page Component | Purpose |
|---|---|---|
| `/` | `HomePage` | Brand landing, product highlights, CTA |
| `/products` | `ProductCatalogPage` | Browse products (public, read-only) |
| `/apply` | `ApplicationPage` | Account application form |
| `/application-submitted` | `ApplicationSubmittedPage` | Confirmation after submit |
| `/login` | `LoginPage` | Email + password login |
| `/activate-account` | `ActivateAccountPage` | Set password after staff approval |
| `/forgot-password` | `ForgotPasswordPage` | Password reset flow |

### Authenticated Routes (wrapped in `ProtectedRoute`)

| Path | Page Component | Purpose |
|---|---|---|
| `/dashboard` | `DashboardPage` | Overview: recent orders, credit summary |
| `/orders` | `OrderListPage` | Paginated order history |
| `/orders/:orderId` | `OrderDetailPage` | Single order with product line items |
| `/account` | `AccountPage` | View/edit contact info |
| `/support` | `SupportPage` | Contact form or help content |

### Route Guards

- `ProtectedRoute` — redirects to `/login` if no valid token.
- `PublicOnlyRoute` — redirects to `/dashboard` if already authenticated (for `/login`, `/apply`).
- All authenticated routes inject `customerId` from auth context; no route parameter for customerId.

---

## 4. Page & Component Inventory

### Pages (13 total)

| # | Page | Key Components Used |
|---|---|---|
| 1 | `HomePage` | HeroBanner, ProductHighlightGrid, CTASection |
| 2 | `ProductCatalogPage` | ProductCard, SearchBar, FilterBar |
| 3 | `ApplicationPage` | ApplicationForm (React Hook Form) |
| 4 | `ApplicationSubmittedPage` | ConfirmationMessage |
| 5 | `LoginPage` | LoginForm |
| 6 | `ActivateAccountPage` | SetPasswordForm |
| 7 | `ForgotPasswordPage` | ForgotPasswordForm, ResetPasswordForm |
| 8 | `DashboardPage` | CreditSummary, RecentOrdersTable, QuickLinks |
| 9 | `OrderListPage` | OrderTable/OrderCardList, Pagination, StatusBadge |
| 10 | `OrderDetailPage` | OrderHeader, OrderProductCard, OrderTimeline |
| 11 | `AccountPage` | AccountInfoForm (read + editable fields) |
| 12 | `SupportPage` | ContactForm, FAQAccordion |
| 13 | `NotFoundPage` | 404 fallback |

### Shared UI Components

- `Button`, `Input`, `Select`, `Textarea`
- `Card`, `Badge`, `StatusBadge`
- `Spinner`, `Skeleton`
- `LoadingState`, `EmptyState`, `ErrorState`
- `Modal`, `ConfirmDialog`
- `Pagination`
- `Header` (public variant + authenticated variant)
- `Footer`
- `MobileNav` (hamburger drawer)
- `PageShell` (max-width container, responsive padding)

---

## 5. Responsive Layout Strategy

### Approach: Mobile-First with Tailwind Breakpoints

| Breakpoint | Tailwind prefix | Target |
|---|---|---|
| < 640px | (default) | Mobile (375px, 430px) |
| 640px | `sm:` | Large phone / small tablet |
| 768px | `md:` | Tablet portrait |
| 1024px | `lg:` | Tablet landscape / small desktop |
| 1440px | `xl:` | Desktop |

### Layout Rules

1. **Navigation:** Bottom tab bar on mobile (< 768px), side/top nav on desktop.
2. **Order list:** Card layout on mobile, table layout on desktop (md+).
3. **Order detail:** Stacked sections on mobile, two-column on desktop.
4. **Product catalog:** 1-col grid on mobile, 2-col on md, 3-col on lg, 4-col on xl.
5. **Dashboard:** Stacked cards on mobile, grid on desktop.
6. **Forms:** Full-width inputs on mobile, constrained max-width on desktop.
7. **Typography:** Responsive font sizes using Tailwind `text-sm`/`text-base`/`text-lg`.

### Required Test Widths

All pages must be visually verified at: **375px, 430px, 768px, 1024px, 1440px**.
Playwright viewport tests will cover these widths automatically.

---

## 6. Authentication Strategy

### Flow

```
1. Customer submits application → POST /api/CustomerApplication
2. Staff reviews & approves in Staff system → links to CustomerId
3. Staff system sends activation email with token
4. Customer visits /activate-account?token=xxx → sets password
5. Customer logs in at /login → POST /api/Auth/Login → JWT returned
6. JWT stored in httpOnly cookie (preferred) or localStorage (fallback)
7. Axios interceptor attaches Authorization: Bearer {token}
8. Token refresh via /api/Auth/Refresh before expiry
9. On 401 response → clear token, redirect to /login
```

### Auth Context Shape

```typescript
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  customer: {
    customerId: number;
    company: string;
    contactPerson: string;
    email: string;
  } | null;
  token: string | null;
}
```

### Critical Rule

`customerId` is **derived exclusively from the JWT claims** on the server side. The frontend never sends `customerId` as a parameter — the backend extracts it from the authenticated token. This prevents any customer from accessing another customer's data.

---

## 7. CustomerId Data-Isolation Rules

| Rule | Enforcement Point |
|---|---|
| CustomerId comes from JWT, never from URL/query/body | Backend (existing API must enforce) |
| Frontend never stores or exposes customerId in editable state | AuthContext (read-only) |
| No UI to select, switch, or input a CustomerId | No component renders a customer selector |
| API calls for orders, credit, account never include customerId param | API layer functions use token-only endpoints |
| If backend endpoints require customerId as a query param, the portal's API layer reads it from AuthContext only | `api/*.ts` functions |
| Route params never contain customerId | Route definitions |
| DevTools-accessible state does not expose other customers' data | No customer list fetched |

### Backend Requirement (out of scope but documented)

The existing backend endpoints (e.g., `GET /api/SalesOrder/GetByCust?customerId=X`) accept customerId as a query parameter. For the Customer Portal to be secure, one of the following is needed:

1. **Option A (Preferred):** New portal-specific endpoints that derive customerId from the JWT. No customerId parameter accepted.
2. **Option B (Interim):** A middleware/filter layer that validates the requested customerId matches the JWT's customerId claim, rejecting mismatches with 403.
3. **Option C (Least secure, portal-only enforcement):** The frontend reads customerId from AuthContext and passes it. This is NOT secure against direct API calls but may be acceptable for an MVP if the backend is not publicly exposed.

> **Unresolved:** Which option will be implemented? This must be decided before Phase 2.

---

## 8. Proposed Customer Portal API Contract

### 8.1 Authentication Endpoints (new — required)

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/api/portal/auth/login` | `{ email, password }` | `{ token, refreshToken, customer: {...} }` |
| POST | `/api/portal/auth/refresh` | `{ refreshToken }` | `{ token, refreshToken }` |
| POST | `/api/portal/auth/forgot-password` | `{ email }` | `{ message }` |
| POST | `/api/portal/auth/reset-password` | `{ token, newPassword }` | `{ message }` |
| POST | `/api/portal/auth/activate` | `{ token, password }` | `{ message }` |

### 8.2 Application Endpoint (new — required)

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/api/portal/apply` | `ApplicationFormDto` | `{ applicationId, message }` |

```typescript
interface ApplicationFormDto {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile?: string;
  address1: string;
  address2?: string;
  postalCode?: string;
  city?: string;
  message?: string;
}
```

### 8.3 Order Endpoints (portal-filtered)

| Method | Path | Response |
|---|---|---|
| GET | `/api/portal/orders` | `PortalOrderSummary[]` (paginated) |
| GET | `/api/portal/orders/:orderId` | `PortalOrderDetail` |

```typescript
interface PortalOrderSummary {
  orderId: string;
  orderNo: string;
  orderDate: string;          // ISO date
  requiredDate: string;
  deliveryDate: string | null;
  status: string;             // human-readable label, not raw statusId
  totalPrice: number;
  priceInclGst: number;
  itemCount: number;
}

interface PortalOrderDetail extends PortalOrderSummary {
  deliveryName: string;
  deliveryAddress: string;
  postalCode: string;
  custOrderNo: string;
  products: PortalOrderProduct[];
}

interface PortalOrderProduct {
  productImage: string | null; // from Product.ShowImgUrl
  productCode: string;         // from Product.ProductCode
  productName: string;         // from Product.ProductName
  unitPrice: number;
  quantity: number;             // OrderProduct.Quantity
  price: number;               // line total
}
```

### 8.4 Product Endpoints (public)

| Method | Path | Response |
|---|---|---|
| GET | `/api/portal/products` | `PortalProduct[]` (paginated) |
| GET | `/api/portal/products/:productId` | `PortalProduct` |

```typescript
interface PortalProduct {
  productId: number;
  productCode: string;
  productName: string;
  description: string;
  image: string | null;        // ShowImgUrl
  logoUrl: string | null;
}
```

### 8.5 Credit Endpoints (authenticated)

| Method | Path | Response |
|---|---|---|
| GET | `/api/portal/credit` | `PortalCreditSummary` |
| GET | `/api/portal/credit/transactions` | `PortalCreditTransaction[]` (paginated) |

```typescript
interface PortalCreditSummary {
  credit: number;
  updatedAt: string;
}

interface PortalCreditTransaction {
  transactionId: string;
  invoiceId: string;
  amount: number;
  createdAt: string;
  notes: string | null;
}
```

### 8.6 Account Endpoint (authenticated)

| Method | Path | Request/Response |
|---|---|---|
| GET | `/api/portal/account` | `PortalAccount` |
| PUT | `/api/portal/account` | `UpdatePortalAccountDto` → `PortalAccount` |

```typescript
interface PortalAccount {
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  mobile: string;
  address1: string;
  address2: string;
  postalCode: string;
}
```

### 8.7 Support Endpoint (authenticated)

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/api/portal/support` | `{ subject, message }` | `{ ticketId, message }` |

---

## 9. Customer-Visible Field Whitelist

### Order Fields — Allowed

| Source Entity | Field | Display Label |
|---|---|---|
| Orders | OrderNo | Order Number |
| Orders | OrderDate | Order Date |
| Orders | RequiredDate | Required Date |
| Orders | DeliveryDate | Delivery Date |
| Orders | TotalPrice | Subtotal |
| Orders | PriceInclgst | Total (incl. GST) |
| Orders | DeliveryName | Delivery Name |
| Orders | DeliveryAddress | Delivery Address |
| Orders | PostalCode | Postal Code |
| Orders | CustOrderNo | Your Reference |
| Orders | OrderStatusId | Status (mapped to label) |

### Order Product Fields — Allowed

| Source Entity | Field | Display Label |
|---|---|---|
| Product | ShowImgUrl | Product Image |
| Product | ProductCode | Product Code |
| Product | ProductName | Product Name |
| OrderProduct | UnitPrice | Unit Price |
| OrderProduct | Quantity | QTY |
| OrderProduct | Price | Price |

### Credit Fields — Allowed

| Source Entity | Field | Display Label |
|---|---|---|
| CustomerCredit | Credit | Credit Balance |
| CustomerCredit | UpdatedAt | Last Updated |
| CreditTransaction | TransactionId | Transaction ID |
| CreditTransaction | InvoiceId | Invoice |
| CreditTransaction | Amount | Amount |
| CreditTransaction | CreatedAt | Date |
| CreditTransaction | Notes | Notes |

### Customer/Account Fields — Allowed

| Source Entity | Field | Display Label |
|---|---|---|
| Customer | Company | Company |
| Customer | ContactPerson | Contact Person |
| Customer | Email | Email |
| Customer | Phone | Phone |
| Customer | Mobile | Mobile |
| Customer | Address1 | Address Line 1 |
| Customer | Address2 | Address Line 2 |
| Customer | PostalCode | Postal Code |

---

## 10. Internal Field Blacklist

These fields must **never** be returned to or rendered in the Customer Portal.

### Order Fields — Blocked

| Field | Reason |
|---|---|
| EmployeeId | Internal staff assignment |
| OperEmployeeId | Internal operational staff |
| CreatedEmployeeId | Internal audit |
| AccountNote | Internal accounting note |
| AccountNoteType | Internal |
| WarehouseNote | Internal warehouse operations |
| WarehouseNoteType | Internal |
| ProductionNoteType | Internal production |
| NewWarehouseNote | Internal |
| UrgentNote | Internal urgency flag |
| Active | Internal soft-delete flag |
| Paid | Internal payment tracking |
| ApprovedDate | Internal workflow |
| InvoiceNumber | Internal (use CreditTransaction.InvoiceId instead if needed) |
| Leadtime | Internal production planning |
| LeadtimeFlag | Internal |
| PickupFlag | Internal logistics |
| OrderSourceId | Internal classification |
| DeliveryMethodId | Internal (show derived label only if needed) |
| DeliveryCityId | Internal reference |
| DeliveryAsap | Internal flag |
| Comments | Internal staff comments |

### Order Product Fields — Blocked

| Field | Reason |
|---|---|
| MarginOfError | Internal production tolerance |
| Delivered | Internal delivery tracking |
| DeliveredQuantity | Internal (per requirement #10) |
| Sequence | Internal ordering |
| QuotationId | Internal reference |

### Product Fields — Blocked

| Field | Reason |
|---|---|
| BaseProductId | Internal product hierarchy |
| Plain | Internal flag |
| CustomerId (on Product) | Internal outsourcing reference |
| Images (raw) | Internal — use ShowImgUrl only |
| PlateTypeId | Internal manufacturing |
| MarginOfError | Internal tolerance |
| MinOrderQuantity | Internal (could be allowed later) |
| ProductMsl / SemiMsl | Internal safety stock |
| Manufactured | Internal flag |
| LogoType | Internal classification |
| PalletStackingId | Internal warehouse |
| Active | Internal soft-delete |
| DeletedAt / DeleteNote / DeletePerson / DeleteEmployeeId | Internal audit |
| InStock | Internal inventory (per requirement #10) |
| CustProductCode | Internal reference |

### Customer Fields — Blocked

| Field | Reason |
|---|---|
| Group1Id – Group5Id | Internal customer segmentation |
| Notes | Internal staff notes |
| EmployeeId | Internal sales assignment |
| BrandId | Internal classification |
| CityId | Internal reference |
| Salutation | Internal CRM |
| LeadRating | Internal sales pipeline |
| SourceId | Internal acquisition tracking |
| CustomerCode | Internal code |
| StatusId | Internal account status |
| PaymentCycleId | Internal billing |
| DeliveryMethodId | Internal logistics |
| CustomerNo | Internal numbering |
| LastOrderDate | Internal analytics |
| NoteToWarehouse | Internal operations |
| NoteToProduction | Internal operations |
| CustomerCredit (on Customer entity) | Use CustomerCredit entity instead |
| CustomerNumber | Internal |
| DeliveryFeeFlag | Internal billing |
| ShowPriceOnPackingSlip | Internal operations |
| UnconfirmDate | Internal workflow |

### Credit Fields — Blocked

| Field | Reason |
|---|---|
| CreditTransaction.TicketId | Internal support reference |

---

## 11. DTOs That Must Not Be Returned Directly

The following existing backend DTOs contain internal fields and must **never** be returned as-is to the Customer Portal:

| DTO | Problem |
|---|---|
| `GetOrderDto` / `GetOrderDto2` / `GetOrderDto3` / `GetOrderDto4` / `GetOrderDto5` | Contain EmployeeId, AccountNote, WarehouseNote, UrgentNote, Comments, full nested Employee objects |
| `GetOrderProductDto` / `GetOrderProductDto2` / `GetOrderProductDto3` | Contain MarginOfError, DeliveredQuantity, Sequence, QuotationId |
| `GetProductDto` / `GetProductDto2` / `GetProductDto3` / `GetProductDto4` / `GetProductDto5` | Contain ProductMsl, SemiMsl, InStock, Active, internal relationships |
| `GetCustomerDto` / `GetCustomerDto2` / `GetCustomerDto3` | Contain EmployeeId, Groups, Notes, LeadRating, StatusId, internal relationships |
| `GetSimpleCustomerDto` | Contains DeliveryFeeFlag, PaymentCycleId, ShowPriceOnPackingSlip |
| `GetCustomerCreditDto` | Safe if CreditTransaction list is filtered (remove TicketId) |
| `GetCreditTransactionDto` | Contains TicketId (internal) |
| `AddCustomerDto` / `AddCustomerDto2` | Staff-only creation DTOs — portal uses its own `ApplicationFormDto` |
| `UpdateCustomerDto` | Contains Group IDs, EmployeeId, internal flags — portal uses `UpdatePortalAccountDto` |

**Required:** New portal-specific response DTOs must be created on the backend (or a BFF layer) that only include whitelisted fields.

---

## 12. Mock-Data Strategy

### Approach: MSW (Mock Service Worker)

- Use [MSW](https://mswjs.io/) to intercept API calls at the network level during development.
- Mock handlers mirror the portal API contract from Section 8.
- Fixtures stored in `src/mocks/fixtures/` as typed JSON files.

### Mock Data Files

```
src/mocks/
├── handlers/
│   ├── auth.ts
│   ├── orders.ts
│   ├── products.ts
│   ├── credit.ts
│   ├── account.ts
│   └── support.ts
├── fixtures/
│   ├── orders.json          # 10-15 sample orders
│   ├── orderProducts.json   # 3-5 products per order
│   ├── products.json        # 20-30 catalog products
│   ├── credit.json          # Credit summary + 10 transactions
│   └── account.json         # Single customer account
├── browser.ts               # MSW browser setup
└── server.ts                # MSW server setup (for tests)
```

### Mock Scenarios

- Authenticated customer with orders, credit, and full account.
- Authenticated customer with zero orders (empty state).
- Authenticated customer with negative credit balance.
- Unauthenticated visitor (public pages only).
- Expired/invalid token (401 responses).
- Server error (500 responses).

### Activation

```typescript
// main.tsx — only in development
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}
```

---

## 13. Loading, Empty, and Error States

### Loading States

| Context | Behavior |
|---|---|
| Page initial load | Full-page skeleton matching the page layout |
| Data table/list | Skeleton rows (3-5 rows) |
| Single record | Skeleton matching card/detail layout |
| Button action | Spinner inside button, button disabled |
| Auth check | Full-page spinner with brand logo |

### Empty States

| Context | Message | Action |
|---|---|---|
| Order list (no orders) | "You don't have any orders yet." | — |
| Order detail (not found) | "Order not found." | Link to order list |
| Credit transactions (none) | "No transactions to display." | — |
| Product catalog (no results) | "No products match your search." | Clear filters button |

### Error States

| Context | Behavior |
|---|---|
| Network error | Toast notification + retry button |
| 401 Unauthorized | Redirect to `/login` with return URL |
| 403 Forbidden | "You don't have access to this resource." |
| 404 Not Found | Page-level "Not found" with link home |
| 500 Server Error | "Something went wrong. Please try again later." + retry |
| Form validation | Inline field errors below each input |
| Form submission error | Banner error above the form |

### Implementation

- `<LoadingState />` — accepts `variant: 'page' | 'table' | 'card' | 'inline'`
- `<EmptyState />` — accepts `title`, `description`, optional `action` button
- `<ErrorState />` — accepts `error` object, optional `onRetry` callback

---

## 14. Testing Strategy

### Unit Tests (Vitest)

- Utility functions (`formatCurrency`, `formatDate`, `buildApiUrl`).
- Zod validation schemas.
- Auth token helpers.

### Component Tests (Vitest + React Testing Library)

- Each page component renders correctly with mock data.
- Loading, empty, and error states render correctly.
- Form validation shows errors on invalid input.
- ProtectedRoute redirects unauthenticated users.
- No component renders blacklisted fields.

### Integration Tests (Vitest + MSW)

- Login flow → token stored → authenticated API calls succeed.
- Order list fetches and displays data.
- Order detail displays correct product line items.
- Credit summary displays balance and transactions.
- Application form submits successfully.
- 401 response triggers redirect to login.

### E2E Tests (Playwright)

- Full login → dashboard → orders → order detail flow.
- Application submission flow.
- Responsive layout at 375px, 430px, 768px, 1024px, 1440px.
- Navigation between all routes.
- Mobile menu open/close.

### Blacklist Verification Test

A dedicated test that:
1. Imports all mock fixtures.
2. Asserts no fixture object contains any blacklisted field name.
3. Renders each page and asserts no blacklisted field text appears in the DOM.

---

## 15. Phased Implementation Order

### Phase 1 — Project Scaffolding & Public Shell

- Vite + React + TypeScript setup
- Tailwind CSS configuration
- Folder structure creation
- Shared UI component library (Button, Input, Card, etc.)
- Layout components (Header, Footer, PageShell, MobileNav)
- Route definitions with placeholder pages
- `HomePage` with brand content
- `NotFoundPage`
- Responsive layout verification at all 5 widths

### Phase 2 — Authentication & Application

- MSW setup with auth handlers
- `AuthContext` and `ProtectedRoute` / `PublicOnlyRoute`
- `LoginPage` with form validation
- `ForgotPasswordPage`
- `ActivateAccountPage`
- `ApplicationPage` with form and validation
- `ApplicationSubmittedPage`
- Token storage, interceptor, refresh logic

### Phase 3 — Product Catalog (Public)

- Product API mock data and MSW handlers
- `ProductCatalogPage` with grid layout
- `ProductCard` component
- Search and filter (client-side on mock data)
- Responsive grid: 1→2→3→4 columns

### Phase 4 — Dashboard & Orders (Authenticated)

- Order API mock data and MSW handlers
- `DashboardPage` with recent orders and credit summary
- `OrderListPage` with pagination
- `OrderDetailPage` with product line items
- `OrderProductCard` component (image, code, name, unit price, qty, price)
- Status badge mapping (statusId → human label)
- Loading, empty, and error states for all order views

### Phase 5 — Credit & Account (Authenticated)

- Credit API mock data and MSW handlers
- `CreditSummary` component on dashboard
- Credit transaction list (paginated)
- `AccountPage` — view and edit contact information
- `SupportPage` with contact form

### Phase 6 — Testing & Polish

- Unit tests for utilities and schemas
- Component tests for all pages
- Integration tests with MSW
- Playwright E2E tests across all 5 viewport widths
- Blacklist verification tests
- Accessibility audit (keyboard navigation, screen reader)
- Performance review (bundle size, lazy loading routes)

### Phase 7 — Backend Integration (requires backend changes)

- Replace MSW mocks with real API endpoints
- Implement portal-specific backend endpoints (or BFF)
- JWT authentication integration
- CustomerId extraction from JWT on backend
- End-to-end testing against staging environment

---

## 16. Risks & Unresolved Questions

### Risks

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | Backend does not have portal-specific endpoints; existing endpoints leak internal fields | Data exposure | Must build new `/api/portal/*` endpoints or BFF before production |
| R2 | Existing endpoints accept customerId as query param — no server-side JWT enforcement | Any authenticated customer could access other customers' data | Implement Option A or B from Section 7 before production |
| R3 | JWT auth is commented out in current backend Startup.cs | No authentication at all | Must re-enable and configure JWT before portal connects |
| R4 | No existing customer application or activation workflow in backend | Cannot complete registration flow | Must build application + activation endpoints |
| R5 | Order status IDs are numeric with no label mapping table discovered | Display shows raw numbers | Need status label mapping from staff frontend or backend |
| R6 | Product images (ShowImgUrl) may point to internal/inaccessible storage | Broken images in portal | Verify image URLs are publicly accessible or add a proxy |

### Unresolved Questions

| # | Question | Depends On | Needed By |
|---|---|---|---|
| Q1 | Will new `/api/portal/*` endpoints be created, or will the portal call existing endpoints? | Backend team decision | Phase 7 |
| Q2 | How will CustomerId be associated with a portal user account? New `PortalUser` table, or extend existing `Customer`? | Backend team decision | Phase 2 |
| Q3 | What is the activation flow? Email link with token? Invite code? | Business decision | Phase 2 |
| Q4 | Should the product catalog show all active products or only products the customer has ordered? | Business decision | Phase 3 |
| Q5 | Is credit information visible to all authenticated customers, or only those with credit accounts? | Business decision | Phase 5 |
| Q6 | What email service will be used for activation and password reset emails? | Infrastructure decision | Phase 7 |
| Q7 | Will the portal be deployed on the same domain as the API (avoiding CORS), or a separate domain? | Infrastructure decision | Phase 7 |
| Q8 | What is the mapping of OrderStatusId values to customer-friendly labels? | Staff frontend or backend inspection | Phase 4 |
| Q9 | Does the business want order date filtering or search on the order list? | Business decision | Phase 4 |
| Q10 | Should the portal support multiple languages? | Business decision | Phase 1 (architecture impact) |
