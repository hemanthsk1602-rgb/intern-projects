# SPENDWISE

> **Your money. Your orbit.**

SpendWise is a production-ready, premium personal expense-tracking application designed around the concept of a **"FINANCIAL COMMAND CENTER"**. Instead of traditional generic dashboards or plain tables, your finances exist as an interactive, living 3D spatial orbit.

---

## 🌌 Key Highlights & Features

### 1. 3D Financial Orbit (Hero Experience)
- **Central Luminous Core**: Live outflow for the current month (**₹27,000**) with the **"OUTFLOW THIS MONTH"** indicator and real-time month-over-month flux telemetry.
- **Refined Orbital Architecture**: 3–4 thin, delicate orbital paths with depth-based fading and subtle cyan, electric blue, violet, and green accents.
- **Category Satellites**: Floating category nodes (**Food & Dining ₹3,250**, **Transport ₹4,500**, **Shopping ₹6,800**, etc.) positioned along distinct angular quadrants to prevent overlapping, with restrained glow, subtle depth, and smooth floating motion.
- **Balanced Atmospheric Background**: Reduced particle cloud (~180 particles) with slow drift and a subtle radial light source behind the core.
- **Spacious Design Ratio**: 70% breathing room / 30% information density for clean, professional fintech elegance.
- **Performance**: 60fps animations, WebGL lifecycle cleanup, automatic canvas resize observer, visibility change pause, and `prefers-reduced-motion` compliance.

### 2. Complete CRUD for Expenses
- **Add Expense**: Inflow (Income) / Outflow (Expense) toggle, quantum amount input with quick increment pills (+₹100, +₹500, +₹1,000, +₹5,000), interactive category matrix, date picker, payment rail selection, notes, and confetti celebration.
- **Edit Expense**: In-place modification of any existing transaction with pre-populated fields, instant validation, and real-time orbital recalibration.
- **Delete Confirmation Modal**: Safety-first deletion with an explicit confirmation dialog displaying transaction details, warning explanation, and dual **Abort / Keep** or **Confirm Purge** actions.

### 3. Transaction Stream (`/transactions`)
- **Ledger Telemetry Stream**: Chronological event log with category icons and animated elevation.
- **Multi-Vector Filtering**:
  - Live text search across description, category, notes, and payment method.
  - Category selector filter.
  - Inflow vs. Outflow transaction type filter.
  - **Date Range Presets**: Quick filters for **All Time**, **This Month**, **Last 30 Days**, and custom **From / To** date range pickers.
  - Multi-directional sorting (Date Newest/Oldest, Amount Highest/Lowest).
- **Responsive Mobile Layout**: Transactions seamlessly stack as touch-friendly cards on smaller screens without horizontal overflow.
- **CSV Ledger Export**: Instant single-click download of all filtered records in spreadsheet-ready CSV format.

### 4. Dedicated Authentication Portal (`/login`)
- **Spatial Portal Layout**: 45% 3D visual area on the left, 40% glassmorphism authentication card on the right, and 15% breathing room.
- **Dual Tabbed Authentication**:
  - **Sign In**: Email & cipher password authentication with optional "Remember me" and instant **"Load Demo Credentials (Aarav Sharma)"** shortcut.
  - **Create Account (Registration)**: Name, email, password, and password confirmation with validation and session creation.
- **Interactive 3D Focus States**:
  - Email focus: Core brightens with focused cyan energy.
  - Password focus: Core shifts glow intensity to a violet aura.
  - Login success: Core expands, rings accelerate briefly, glow intensifies, and the scene smoothly transitions to the Dashboard.
- **Session Persistence**: Managed via `AuthContext` and stored in `localStorage`, maintaining isolation and persistent login states.

### 5. Deep Analytics (`/analytics`)
- **Executive Telemetry Bar**: Real computed statistics:
  - **Total Ledger Events**
  - **Average Outflow**
  - **Largest Single Outflow**
  - **Primary Settlement Rail**
- **Spending Pulse**: Interactive Bezier curve area chart mapping day-by-day capital trajectory.
- **Category Orbit**: Interactive radial donut visualization showing percentage concentrations.
- **Monthly Spending**: Multi-month historical outflow vectors.
- **Income vs. Expense Equilibrium**: Macro capital flow ratio with savings rate telemetry.

### 6. Identity Core (`/profile`)
- **Biometric Radar Hologram**: Concentric rotating orbital rings, verified account status, and dynamic **Core Telemetry Integrity (%)** score.
- **Interactive Control Tabs**:
  - **Identity**: Full legal name, contact email, phone relay, and avatar URL with live updating and confetti confirmation.
  - **Financial Directives**: Monthly budget ceiling adjustment (in ₹), currency selector (`INR ₹`, `USD $`, `EUR €`, `GBP £`), and outflow velocity alert thresholds.
  - **Appearance**: Toggle between **Obsidian Orbit (Dark Mode `#05070D`)** and **Arctic Deck (Light Mode `#F5F7FB`)** with 60fps hardware acceleration status.
  - **Security Enclave**: 256-Bit Spatial Encryption status and interactive **Cipher Key Rotation** modal.
  - **Vault Actions**: Full JSON vault backup, CSV export, **Reset Demo Orbit** (restores canonical ₹27,000 monthly seed), and **Clear All Data**.

### 7. Dual Theme System (Obsidian & Arctic)
- **Dark Mode**: Near-black navy (`#05070D`), deep blue glass surfaces, glowing cyan, violet, and emerald accents.
- **True Light Mode**: Arctic deck (`#F5F7FB`), crisp white glass cards (`#FFFFFF`), deep navy typography (`#0F172A`), and high-contrast sky-blue orbital rings.

### 8. MongoDB-Ready Data Layer
- Connects to **MongoDB** if `MONGODB_URI` is provided; seamlessly falls back to a global singleton in-memory persistent store with realistic seed data centered around ₹27,000 this month.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js (WebGL with ACESFilmicToneMapping & realistic perspective)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Database**: MongoDB driver connection pooling + serverless caching

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
To access the authentication portal: [http://localhost:3000/login](http://localhost:3000/login).

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🌐 Deployment to Vercel

SpendWise is configured for zero-configuration deployment to Vercel:

1. Push this repository to your GitHub account.
2. Import the project into [Vercel](https://vercel.com).
3. (Optional) Set the `MONGODB_URI` environment variable if connecting to an external MongoDB cluster. If omitted, the application runs with full functionality in persistent memory mode.
4. Deploy!
