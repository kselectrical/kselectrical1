# KS Electrical & AC Services - Project Instructions & Guidelines

This document serves as the foundational source of truth and development mandates for the **KS Electrical & AC Services** workspace. All developers and AI agents must strictly adhere to the guidelines, architectures, and workflows outlined below.

---

## 1. Project Overview

KS Electrical & AC Services is a dual-structured web application featuring:
1. **Frontend (React Client):** A modern, highly interactive React 19 + TypeScript + Vite customer-facing portal styled with TailwindCSS and powered by Google Firebase (Auth & Firestore) for live services catalog, bookings, offline reviews, and admin dashboard controls.
2. **Backend (PHP Admin Billing Panel):** A secure, lightweight, procedural PHP administration panel used for billing, tax invoices, customer databases, and technician registrations, running on a MySQL database (local XAMPP/MAMP or live InfinityFree host).

---

## 2. Workspace Directory Structure

```
C:\Users\A\OneDrive\Desktop\ks-2.0\
├── .firebaserc                # Firebase CLI project binding (default: kselectrical-3db7e)
├── firebase.json              # Firebase configuration (Firestore rules/indexes, hosting)
├── firestore.rules            # Production-grade Cloud Firestore security rules
├── firestore.indexes.json    # Firestore query indexes
├── 57_services_list.csv       # Reference CSV containing raw service configurations
├── upload_backend_main.ps1    # Root PowerShell script to upload backend PHP files to live FTP
├── backend\                   # PHP Administration & Billing Backend
│   ├── auth_check.php         # Admin session validation logic
│   ├── db_connect.php         # MySQL database connector with local/InfinityFree auto-switching
│   ├── setup.php              # Automated MySQL table schema installer
│   ├── index.php              # Backend administrator dashboard
│   ├── create_invoice.php     # Tax invoice generator interface
│   ├── view_invoice.php       # Vyapar-style printable tax invoice generator (PDF)
│   ├── customers.php          # Customer lists and bookings viewer
│   ├── technicians.php        # Job applicants and staff portal
│   ├── style.css              # Styling rules for backend UI
│   └── js/                    # Client-side validation scripts (admin.js, billing.js, auth.js)
└── frontend\                  # React + TypeScript + Vite Customer Web App
    ├── .env                   # Local active environment variables (credentials)
    ├── .env.example           # Example/template environment variables configuration
    ├── package.json           # Node.js build dependencies and scripting definitions
    ├── eslint.config.js       # ESLint rules configuration
    ├── tailwind.config.js     # Tailwind CSS theme customization
    ├── vite.config.ts         # Vite bundler parameters
    ├── FIREBASE_SETUP.md      # Step-by-step developer Firestore cloud setup guide
    ├── FIRESTORE_RULES.md     # Production firestore rules reference document
    ├── public/                # Static public assets, SEO configurations, and service images
    │   ├── images/            # Organized media folder
    │   ├── manifest.json      # Progressive Web App webmanifest
    │   └── sitemap.xml        # Automatically generated SEO sitemap
    ├── scripts/               # Operational automation tools (FTP deploy, sitemap, image pipeline)
    │   ├── deploy.mjs         # Node.js basic-ftp delta upload deployment script
    │   ├── generate-sitemap.js # Sitemap.xml builder
    │   └── compress-images.mjs # Media compression tool for optimizing static assets
    └── src/                   # Client application codebase
        ├── assets/            # Uncompiled local frontend styling assets
        ├── components/        # Reusable functional UI widgets (headers, footers, modal)
        ├── layouts/           # Page structural framing components
        ├── pages/             # Distinct app pages (Home, Services, Contact, Blog)
        ├── App.tsx            # Main monolithic state machine and single-page router/flows
        ├── firebase.ts        # Firebase Core SDK, Auth, and Firestore helper wrappers
        ├── types.ts           # Shared TypeScript interfaces (e.g., TechnicalService, CartItem)
        └── data.ts            # Local fallback mock databases of services and prices
```

---

## 3. Core Architecture & Developer Mandates

### 3.1 Frontend Development (React + TypeScript)
- **Framework & State:** Built on React 19. Core routing, state flow, cart management, and booking workflows are handled within `frontend/src/App.tsx`.
- **Firebase Sync:** Firestore is the database of record for customer bookings, services catalog, and config. Helper methods to query/mutate Firestore are centered in `frontend/src/firebase.ts`.
- **Firestore Schema:** Ensure any schema changes are documented and that any field modifications comply with the collections protected under `firestore.rules` and the types in `frontend/src/types.ts`.
- **Tailwind CSS Styling:** Follow established responsive patterns. Utilize Tailwind CSS utility classes. Avoid introducing raw/inline styles or complex third-party UI libraries unless verified with the team.
- **Type Safety:** Always enforce strict TypeScript declarations. Never use `any` bypasses or arbitrary type casts unless explicitly approved.

### 3.2 Backend Development (PHP + MySQL)
- **Database Connection (`backend/db_connect.php`):** Connections automatically toggle between local XAMPP (`127.0.0.1` / `ks_billing` with empty or `root` password) and live production databases (`sql301.infinityfree.com` / `if0_42168126_ks_billing`) based on the active `HTTP_HOST` environment. Never commit hardcoded production credentials inside secondary files.
- **Table Schema Setup (`backend/setup.php`):** Run this script to recreate or inspect table layouts. Ensure database changes are safe and fully backward-compatible.
- **Session Control (`backend/auth_check.php`):** Every administrative backend script must include `require_once 'auth_check.php'` at the very top to protect unauthorized access.

---

## 4. Deployment & Operation Workflows

### 4.1 Frontend Deployments
1. **Build Step:** Always compile and verify the build locally prior to deploying:
   ```bash
   cd frontend
   npm run build
   ```
2. **FTP Upload to Live Hosting:** Run the automated basic-ftp delta script to deploy compiled static assets directly to the production webroot (`kselectrical.in/htdocs`):
   ```bash
   node scripts/deploy.mjs
   ```
   *Alternative:* Use the PowerShell script `upload_react.ps1` from within the `frontend/` directory.

### 4.2 Backend Deployments
1. **PHP/MySQL Deploy:** Deploy server-side admin dashboards by uploading files to `/backend` directory on the remote server:
   ```powershell
   # From root folder, execute:
   .\upload_backend_main.ps1
   ```
   *Alternative:* Use `backend/upload_php_billing.ps1` directly from the backend folder.

---

## 5. Daily Development Utility Commands

Execute these within the `/frontend` subdirectory:

| Command | Purpose |
|:---|:---|
| `npm run dev` | Spins up the local Vite HMR development server. |
| `npm run build` | Compiles production assets into `/dist` and auto-runs sitemap generation. |
| `npm run lint` | Performs strict ESLint syntax and code quality analysis. |
| `node scripts/compress-images.mjs` | Runs the Node image-compression script to optimize public assets. |

---

## 6. Security and Environmental Integrity
- **Credential Storage:** **NEVER** commit active `.env` or other configuration files containing live production API keys or tokens. Keep all environment variable definitions template-synchronized within `frontend/.env.example`.
- **Firestore Security Rules:** Any updates affecting collections must be updated in the root `firestore.rules` and synced up to the Firebase console. Always match validation requirements across client-side logic and Firestore rules.
