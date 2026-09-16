# Product Requirements Document (PRD) — Riddhi Computer Platform

## 1. Project Overview

**Project Name**: Riddhi Computer — Full-Stack E-Commerce & Repair Service Platform  
**Target Audience**: Retail customers, corporate clients, students, and local residents seeking computers, laptops, accessories, and repair/maintenance services in Kharghar, Navi Mumbai.  
**Tech Stack**:
- **Frontend**: Next.js 14 (App Router), React, Vanilla CSS / CSS Modules
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Authentication, Multer + Cloudinary
- **Deployment**: Next.js frontend + Node.js/Express backend

---

## 2. Core Objectives & Scope

1. **E-Commerce Store**:
   - Product catalog browsing (Laptops, Desktops, Computer Accessories, Components).
   - Dynamic search, multi-attribute filtering (Brand, Price, RAM, Storage, CPU), and sorting.
   - Shopping cart, promo/coupon codes, and streamlined checkout (Cash on Delivery & online payment placeholders).
   - Order tracking with milestone status updates (Pending, Confirmed, Shipped, Delivered).

2. **Repair & Maintenance Booking**:
   - Online repair request booking with device details, issue descriptions, and pickup/home-visit preferences.
   - Unique tracking ID generation (`RC-REP-XXXXX`) for real-time status tracking.
   - Quotation approval and repair lifecycle tracking (Received, Diagnosing, In Repair, Ready, Delivered).

3. **Customer Account Portal**:
   - Authentication (Registration, Login, JWT tokens, Password Reset).
   - Profile management, multiple shipping address management.
   - Order history and repair request history.

4. **Admin Management Dashboard**:
   - Product, inventory, category, and pricing management.
   - Order fulfillment and status updating.
   - Repair job assignment, technician notes, quotation update, and status progression.
   - Coupon management, promotional banner management, contact inquiry review, and analytics overview.

---

## 3. Architecture & Data Model

### Models Overview
- `User`: Customers & credentials, addresses, role.
- `Admin`: Administrative staff with specific roles/permissions.
- `Product`: SKU, name, brand, category, subcategory, specifications, pricing (MRP, Selling Price), GST %, stock, images.
- `Category`: Categories & subcategories hierarchy.
- `Order`: Items snapshot, pricing breakdown (subtotal, GST, discount, total), shipping address, payment status, order tracking history.
- `Cart`: Persistent customer cart items.
- `RepairRequest`: Device info, problem statement, preferred schedule, home visit flag, technician assignments, repair cost estimates.
- `Service`: Available repair service listings and diagnostic pricing.
- `Coupon`: Promo codes, discount rules, validity dates, usage counters.
- `Banner`: Promotional banners and announcements.
- `Review`: Ratings, product feedback, moderation flag.
- `ContactMessage`: General inquiries and support contact forms.

---

## 4. Key Workflows & User Journeys

### 4.1 Shopping & Order Placement
1. User browses catalog or searches for specific laptop/accessory.
2. User filters by specs (e.g. 16GB RAM, Intel i7, SSD).
3. Adds items to cart, applies optional promo coupon code.
4. Completes checkout with delivery address and payment choice.
5. Receives Order Confirmation with trackable order ID.

### 4.2 Repair Request & Tracking
1. Customer navigates to "Book a Repair" page.
2. Selects device type (Laptop, Desktop, Printer, etc.) and issue description.
3. Selects shop drop-off or doorstep pickup / home-visit.
4. Submits request and receives unique `requestId`.
5. Customer tracks repair progress via `/track-repair`.

### 4.3 Admin Operations
1. Admin logs into secure `/admin` dashboard.
2. Manages inventory stock levels, updates prices and active promotions.
3. Processes orders and updates fulfillment status.
4. Updates repair status, sets repair costs, and communicates completion.

---

## 5. Non-Functional Requirements

- **Performance**: High Lighthouse score, optimized static assets and fast API responses.
- **Security**: Password hashing with bcrypt, JWT authorization tokens in HTTP-only cookies/headers, rate limiting on auth endpoints, CORS and Helmet security headers.
- **Design & UI**: Premium navy blue & modern tech styling, responsive layout (mobile, tablet, desktop), micro-animations, accessible UI elements.
