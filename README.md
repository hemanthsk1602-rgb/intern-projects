# SPENDWISE

> **Your money. Your orbit.**

SpendWise is a production-ready, premium personal expense-tracking application designed around the concept of a **"FINANCIAL COMMAND CENTER"**. Instead of traditional generic dashboards or plain tables, your finances exist as an interactive, living 3D spatial orbit.

---

## 🌌 Key Highlights & Features

- **3D Financial Orbit (Hero Experience)**:
  - Central luminous financial core displaying live outflow for the current month (**₹27,000**) with the **"OUTFLOW THIS MONTH"** indicator and month-over-month flux telemetry.
  - **Refined Orbital Architecture**: 3–4 thin, delicate orbital paths with depth-based fading and subtle cyan, electric blue, violet, and green accents.
  - **Category Satellites**: Floating category nodes (**Food & Dining ₹3,250**, **Transport ₹4,500**, **Shopping ₹6,800**, etc.) positioned along distinct angular quadrants to prevent overlapping, with restrained glow, subtle depth, and smooth floating motion.
  - **Balanced Atmospheric Background**: Reduced particle cloud (~180 particles, 35% reduction) with slow drift and a subtle radial light source behind the core.
  - **Spacious Design Ratio**: 70% breathing room / 30% information density for clean, professional fintech elegance.
  - **Performance**: 60fps animations, WebGL lifecycle cleanup, automatic canvas resize observer, visibility change pause, and `prefers-reduced-motion` compliance.

- **Dedicated Login Experience (`/login`)**:
  - **Spatial Portal Layout**: 45% 3D visual area on the left, 40% glassmorphism authentication card on the right, and 15% breathing room.
  - **Minimalist 3D Core**: One central floating orb, 1–2 thin orbital rings, and ~70 subtle particles.
  - **Interactive Focus States**:
    - Email focus: Financial core gently brightens with cyan energy.
    - Password focus: Core shifts glow intensity with a violet aura.
    - Login success: Core expands, rings accelerate briefly, glow intensifies, and the scene smoothly transitions to the Dashboard.

- **Refined Light Mode System**:
  - Complete, intentional light mode design (`#F5F7FB` background, crisp white surfaces `#FFFFFF`, deep navy text `#0F172A`, slate secondary `#475569`, and saturated high-contrast orbital paths).
  - High-contrast typography and clear borders across all cards, charts, and tables. Zero white-on-white or low-contrast elements.

- **Financial Command Metrics**:
  - Anchored by a dominant **Total Net Balance** card with savings rate and budget utilization bars, accompanied by compact telemetry counters for **Total Inflow**, **Total Outflow**, and **This Month**.
  - Animated number transitions on load and when transactions are logged.

- **Spending Pulse & Category Orbit**:
  - Interactive SVG area/line chart with cubic Bezier curves, glowing neon stroke filter, and gradient area fill.
  - Interactive radial donut visualization calculating real category concentrations with hover segments and center outflow statistics.

- **Transaction Stream (`/transactions`)**:
  - Futuristic chronological ledger with hover elevation and category icon animations.
  - Real-time text search, category filtering, type filtering (Inflow / Outflow), sorting (Date / Amount), and CSV export.

- **Premium Add Expense Modal**:
  - Visual focus placed directly on the **Transaction Quantum Amount** with quick-increment pills (+₹100, +₹500, +₹1,000, +₹5,000).
  - Interactive category icon grid with glowing selections and confetti celebration.

- **Deep Analytics (`/analytics`)**:
  - Spending Pulse, Category Orbit, Monthly Spending comparisons, Income vs Expense equilibrium ratio, and Ranked Top Categories.

- **Identity Core (`/profile`)**:
  - Animated holographic radar scanner with rotating biometric rings and dynamic profile completeness score.

- **MongoDB-Ready Data Layer**:
  - Connects to **MongoDB** if `MONGODB_URI` is provided; seamlessly falls back to an in-memory persistent store with authentic seed data if running offline.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js (WebGL with ACESFilmicToneMapping)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Database**: MongoDB (native driver connection pooling + serverless caching)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
To experience the authentication portal directly: [http://localhost:3000/login](http://localhost:3000/login).

### 3. Build for Production
```bash
npm run build
npm start
```
