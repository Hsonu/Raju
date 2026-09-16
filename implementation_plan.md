# Riddhi Computer — Full-Stack Website Implementation Plan

## Overview

Build a complete, production-ready full-stack website and PWA for **Riddhi Computer** — a laptop/computer sales and repair business in Kharghar, Navi Mumbai. The platform covers e-commerce (laptops, computers, accessories), repair booking (including home visits), order/repair tracking, and a full admin dashboard.

## User Review Required

> [!IMPORTANT]
> **This is a very large project (~150+ files, ~25,000+ lines of code).** Building it will take multiple execution phases. I'll build it incrementally, starting with the foundation and core features, then layering on advanced features.

> [!WARNING]
> **Payment Gateway**: The plan includes a payment-ready checkout flow but does NOT integrate a live payment gateway (Razorpay/Stripe). The checkout will support COD and a placeholder for online payment. You'll need to add your payment gateway credentials later.

> [!IMPORTANT]
> **Cloudinary / MongoDB**: You'll need to provide your own credentials in `.env`. The code will use environment variables — no secrets will be hardcoded.

## Open Questions

> [!IMPORTANT]
> 1. **Logo file**: I see you've provided the Riddhi Computer logo image. I'll use it as the branding reference and generate a clean SVG/PNG version for the website. Is that acceptable?
> 2. **Domain**: Do you have a domain name? This affects SEO metadata (I'll use placeholder URLs for now).
> 3. **Phone/WhatsApp/Email**: What are the actual contact details to use? I'll use placeholders that you can update in `.env`.
> 4. **Google Maps**: Do you want an embedded Google Map on the contact page? (Requires a Google Maps API key)

---

## Architecture

```
riddhi-computer/
├── frontend/          # Next.js 14 (App Router)
│   ├── app/           # Pages & layouts (App Router)
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API service layer
│   ├── utils/         # Utilities & helpers
│   ├── styles/        # Global CSS & design tokens
│   ├── public/        # Static assets, manifest, icons
│   └── next.config.js
│
├── backend/           # Express.js API server
│   ├── config/        # DB, Cloudinary, env config
│   ├── controllers/   # Route handlers
│   ├── middleware/     # Auth, validation, upload, error
│   ├── models/        # Mongoose models
│   ├── routes/        # API route definitions
│   ├── services/      # Business logic layer
│   ├── utils/         # Helpers
│   └── server.js      # Entry point
│
├── .env.example       # Environment variable template
├── .gitignore
├── README.md
└── package.json       # Root workspace (optional)
```

---

## Proposed Changes

### Phase 1: Foundation & Backend

#### Backend Core Setup

##### [NEW] [server.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/server.js)
Express server with CORS, rate limiting, helmet, cookie-parser, JSON parsing. Connects to MongoDB.

##### [NEW] [config/db.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/config/db.js)
MongoDB connection using Mongoose with connection pooling and error handling.

##### [NEW] [config/cloudinary.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/config/cloudinary.js)
Cloudinary SDK configuration using env variables only.

##### [NEW] [config/env.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/config/env.js)
Central environment variable validation and export.

---

#### Mongoose Models (16 models)

##### [NEW] [models/User.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/User.js)
Customer model: name, email, phone, password (hashed), addresses, role, timestamps.

##### [NEW] [models/Admin.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Admin.js)
Admin model: name, email, password (hashed), role, permissions, timestamps.

##### [NEW] [models/Product.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Product.js)
Product model with all fields: name, brand, category, subcategory, description, SKU, images (Cloudinary URLs), MRP, sellingPrice, gstPercentage, discountPercentage, stockQuantity, specifications (RAM, storage, processor, etc.), warranty, status. Indexes on category, brand, SKU.

##### [NEW] [models/Category.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Category.js)
Category with name, slug, image, parent (for subcategories), status.

##### [NEW] [models/Order.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Order.js)
Order model: user, items (product ref, qty, price), shippingAddress, status (enum with full tracking statuses), paymentMethod, paymentStatus, subtotal, discount, gst, total, coupon, timestamps. OrderItem embedded.

##### [NEW] [models/Cart.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Cart.js)
Cart model: user ref, items [{product, quantity}], timestamps.

##### [NEW] [models/RepairRequest.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/RepairRequest.js)
Repair request: customer details, device info, problem, service type, preferred date/time, address, homeVisit flag, status (enum), technician, estimatedCost, finalCost, notes, requestId (auto-generated).

##### [NEW] [models/Service.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Service.js)
Service model: name, description, price, discountPrice, image, category, status.

##### [NEW] [models/Coupon.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Coupon.js)
Coupon model: code, discountType, discountValue, minOrder, maxDiscount, startDate, endDate, usageLimit, usedCount, active.

##### [NEW] [models/Banner.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Banner.js)
Banner model: title, subtitle, image (Cloudinary), ctaText, ctaLink, startDate, endDate, status.

##### [NEW] [models/Review.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Review.js)
Review model: user, product, rating, comment, status, timestamps.

##### [NEW] [models/ContactMessage.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/ContactMessage.js)
Contact form submissions: name, email, phone, subject, message, status.

##### [NEW] [models/Address.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Address.js)
Address model: user ref, fullName, phone, address, city, state, pincode, isDefault.

##### [NEW] [models/Settings.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Settings.js)
Site settings: businessName, phone, whatsapp, email, address, socialLinks, etc.

##### [NEW] [models/Appointment.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/models/Appointment.js)
Appointment scheduling linked to repair requests.

---

#### Middleware

##### [NEW] [middleware/auth.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/middleware/auth.js)
JWT verification, user extraction, role-based guards (customer, admin).

##### [NEW] [middleware/validate.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/middleware/validate.js)
Request validation middleware using express-validator patterns.

##### [NEW] [middleware/upload.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/middleware/upload.js)
Multer + Cloudinary upload middleware. File type/size validation.

##### [NEW] [middleware/errorHandler.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/middleware/errorHandler.js)
Global error handler with proper HTTP status codes and error formatting.

##### [NEW] [middleware/rateLimiter.js](file:///c:/Users/Sonu/Desktop/project/Raju/backend/middleware/rateLimiter.js)
Rate limiting for auth routes and sensitive endpoints.

---

#### API Routes & Controllers

##### [NEW] Auth routes/controllers
`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/me`

##### [NEW] Product routes/controllers
CRUD + search + filter + pagination. Admin-only create/update/delete.

##### [NEW] Category routes/controllers
CRUD for categories/subcategories. Admin-only mutations.

##### [NEW] Order routes/controllers
Create order (with backend price recalculation), get user orders, get order by ID, admin update status.

##### [NEW] Cart routes/controllers
Add/remove/update cart items, get cart, clear cart.

##### [NEW] Repair routes/controllers
Submit repair request, track by ID, admin management.

##### [NEW] Service routes/controllers
CRUD for services. Public listing + admin management.

##### [NEW] Coupon routes/controllers
Create/validate/apply coupons. Admin management.

##### [NEW] Banner routes/controllers
CRUD for banners. Public active banners + admin management.

##### [NEW] Review routes/controllers
Submit review, get product reviews, admin moderation.

##### [NEW] Contact routes/controllers
Submit contact form, admin view messages.

##### [NEW] Admin routes/controllers
Admin login, dashboard stats, analytics data.

##### [NEW] User routes/controllers
Profile management, addresses, order history.

---

### Phase 2: Frontend Foundation (Next.js 14)

#### [NEW] Next.js App Setup
Initialize Next.js 14 with App Router, configured for the Riddhi Computer design system.

##### [NEW] [styles/globals.css](file:///c:/Users/Sonu/Desktop/project/Raju/frontend/styles/globals.css)
Complete design system with CSS custom properties:
- Colors: Deep blue `#0a1628`, Primary blue `#1a56db`, Secondary `#3b82f6`, White `#ffffff`, Light gray `#f8fafc`
- Typography: Inter font family, scale from 12px–48px
- Spacing: 4px base unit system
- Border radius: 8px default, 12px cards, 16px modals
- Shadows: subtle elevation system
- Transitions: smooth 200-300ms easing
- Animation keyframes: fadeIn, slideUp, scaleIn, shimmer

##### [NEW] Core Layout Components
- `Header` — sticky nav with logo, navigation links, search, cart icon, user menu
- `Footer` — full footer with branding, links, contact info, social
- `MobileNav` — hamburger menu with slide-out drawer
- `Sidebar` — admin sidebar navigation

##### [NEW] Reusable UI Components
- `Button` — primary, secondary, outline, ghost variants
- `Card` — product card, service card, stat card
- `Badge` — status badges, discount badges
- `Modal` — confirmation dialogs, image viewer
- `Toast` — notification system
- `Skeleton` — loading skeletons for all content types
- `Input`, `Select`, `Textarea` — form components
- `Accordion` — for FAQ
- `Tabs` — product specs, order details
- `Timeline` — order/repair tracking
- `Rating` — star rating display/input
- `ImageGallery` — product image gallery with zoom
- `SearchBar` — debounced search
- `Pagination` — page navigation
- `EmptyState` — no results/empty cart states
- `Breadcrumb` — navigation breadcrumbs

---

### Phase 3: Customer-Facing Pages

##### [NEW] Home Page (`/`)
- Animated hero with canvas particle effect (blue tech theme)
- Featured categories grid
- Featured products carousel
- Repair services section
- Why Choose Us section
- Promotional banner
- Customer reviews
- FAQ accordion
- Location & contact CTA
- Full footer

##### [NEW] Products Page (`/products`)
- Product grid with filters sidebar (brand, price, RAM, storage, processor)
- Search bar, sort options
- Pagination
- Responsive grid (4 cols → 2 cols → 1 col)

##### [NEW] Product Detail (`/products/[id]`)
- Image gallery with zoom
- Full product info, specs, pricing
- Add to Cart / Buy Now / WhatsApp Enquiry
- Related products

##### [NEW] Laptops (`/laptops`), Computers (`/computers`), Accessories (`/accessories`)
- Category-filtered product listings

##### [NEW] Services (`/services`)
- Service cards grid with pricing
- Book repair CTA

##### [NEW] Service Detail (`/services/[id]`)
- Full service description, pricing, booking form

##### [NEW] Home Repair (`/home-repair`)
- Dedicated landing page for home visit service
- Features, process, booking CTA

##### [NEW] Book Repair (`/book-repair`)
- Full repair booking form with all fields
- Success confirmation with booking ID

##### [NEW] Cart (`/cart`)
- Cart items list, quantity controls, stock validation
- Price breakdown (subtotal, discount, GST, total)
- Coupon code input
- Proceed to checkout

##### [NEW] Checkout (`/checkout`)
- Shipping form, order summary
- Payment method selection (COD / placeholder for online)
- Place order

##### [NEW] Order Success (`/order-success`)
- Confirmation with order ID, summary, tracking link

##### [NEW] Auth Pages (`/login`, `/register`)
- Clean login/register forms with validation

##### [NEW] Account Pages (`/account`, `/account/orders`, `/account/appointments`)
- Customer dashboard, order history, repair tracking, profile management

##### [NEW] Track Order (`/track-order`)
- Order ID input, visual timeline tracking

##### [NEW] About (`/about`)
- Business story, team, values

##### [NEW] Contact (`/contact`)
- Contact form, address, phone, WhatsApp, map placeholder

##### [NEW] Privacy Policy (`/privacy`) & Terms (`/terms`)
- Legal pages

---

### Phase 4: Admin Dashboard

##### [NEW] Admin Layout (`/admin`)
- Separate layout with sidebar, header, main content area
- SaaS-style dark sidebar with blue accents
- Protected by admin auth

##### [NEW] Admin Dashboard (`/admin/dashboard`)
- Stat cards (sales, orders, products, customers, repairs)
- Charts (sales overview, orders, revenue, monthly performance)

##### [NEW] Admin Product Management (`/admin/products`)
- Product list with search/filter/sort
- Add/edit product form with Cloudinary multi-image upload
- Image preview, drag-to-reorder
- Stock management

##### [NEW] Admin Order Management (`/admin/orders`)
- Order list with filters
- Order detail view, status updates
- Payment status tracking

##### [NEW] Admin Repair Management (`/admin/repairs`)
- Repair request list
- Detail view, status updates, technician assignment
- Cost estimation, notes

##### [NEW] Admin Service Management (`/admin/services`)
- CRUD for services

##### [NEW] Admin Category Management (`/admin/categories`)
- CRUD for categories

##### [NEW] Admin Banner Management (`/admin/banners`)
- Banner CRUD with Cloudinary upload

##### [NEW] Admin Coupon Management (`/admin/coupons`)
- Coupon CRUD with validation rules

##### [NEW] Admin Customer Management (`/admin/customers`)
- Customer list, details

##### [NEW] Admin Review Management (`/admin/reviews`)
- Review moderation

##### [NEW] Admin Settings (`/admin/settings`)
- Business info, contact details

---

### Phase 5: PWA, SEO & Polish

##### [NEW] PWA Setup
- `manifest.json` with app name, icons, theme color
- Service worker for offline fallback and static asset caching
- `next-pwa` configuration

##### [NEW] SEO
- Dynamic metadata per page
- Open Graph tags
- Product schema (JSON-LD)
- Local business schema
- `sitemap.xml`, `robots.txt`

##### [NEW] Animations
- Intersection Observer scroll reveal
- Page transitions
- Micro-interactions (buttons, cards, hover effects)
- Hero canvas animation (tech particles)
- `prefers-reduced-motion` support

##### [NEW] Performance
- Next.js Image optimization
- Lazy loading
- Code splitting (dynamic imports)
- API response caching

---

### Configuration Files

##### [NEW] [.env.example](file:///c:/Users/Sonu/Desktop/project/Raju/.env.example)
```
MONGODB_URI=mongodb://localhost:27017/riddhi-computer
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
BUSINESS_PHONE=+91XXXXXXXXXX
BUSINESS_WHATSAPP=+91XXXXXXXXXX
BUSINESS_EMAIL=info@riddhicomputer.com
```

##### [NEW] [.gitignore](file:///c:/Users/Sonu/Desktop/project/Raju/.gitignore)
Excludes node_modules, .env, .next, build artifacts.

##### [NEW] [README.md](file:///c:/Users/Sonu/Desktop/project/Raju/README.md)
Project documentation with setup instructions.

---

## Execution Strategy

Given the massive scope, I'll build in this order:

| Phase | What | Est. Files |
|-------|------|-----------|
| **1** | Backend (models, routes, controllers, middleware, config) | ~45 files |
| **2** | Frontend foundation (design system, layout, core components) | ~30 files |
| **3** | Customer-facing pages (home, products, services, cart, auth, account) | ~40 files |
| **4** | Admin dashboard (all admin pages and features) | ~30 files |
| **5** | PWA, SEO, animations, polish | ~15 files |

**Total: ~160 files, ~30,000 lines of code**

I'll write production-quality code for each phase and verify it builds before moving to the next.

---

## Verification Plan

### Automated Tests
- `npm run build` — Verify Next.js builds without errors
- Backend API testing with sample requests
- ESLint/type checking

### Manual Verification
- Run dev servers (`npm run dev` for both frontend and backend)
- Test all major user flows in browser
- Test responsive layouts at 375px, 768px, 1024px, 1440px
- Verify PWA installability
- Check Lighthouse scores

---

## Design Reference

The design will use these exact colors derived from the logo:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#0f2744` | Dark blue — headers, hero backgrounds |
| `--color-primary-light` | `#1a56db` | Primary blue — buttons, links, accents |
| `--color-secondary` | `#3b82f6` | Bright blue — hover states, highlights |
| `--color-accent` | `#60a5fa` | Light blue — subtle accents, gradients |
| `--color-bg` | `#ffffff` | White — main background |
| `--color-bg-alt` | `#f1f5f9` | Light gray — section backgrounds |
| `--color-text` | `#1e293b` | Dark navy — body text |
| `--color-text-light` | `#64748b` | Gray — secondary text |
| `--color-metallic` | `#c0c8d4` | Metallic gray — borders, subtle elements |
