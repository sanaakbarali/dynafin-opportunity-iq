# DYNAFIN – OPPORTUNITY IQ

> **"Don't just survive growth. Understand it. Prepare for it. Pursue it."**  
> *Core Promise: "Know the financial risk before you accept the opportunity."*  
> **Event:** ARTHATON 2026

---

## 1. Executive Summary & Problem Statement

Indian Micro, Small and Medium Enterprises (MSMEs) form the backbone of industrial manufacturing, contributing over 30% to India's GDP. Yet, thousands of technically competent MSMEs succumb annually to **Opportunity Blindness**.

Small manufacturers receive promising, high-value purchase orders (POs) from corporate buyers, PSUs, and tier-1 enterprises. However, critical operational and financial data remains severely fragmented across spreadsheets, paper POs, supplier proformas, delivery challans, accounting software, and personal bank calculations. 

An MSME owner might know the headline price of a ₹15 Lakh order, but remain dangerously blind to:
- The **actual upfront working capital** demanded by raw material suppliers before spindle or CNC machines can run.
- The **timing mismatch** between daily shop-floor outflows (wages, diesel, discom power tariffs) and customer settlement (often 45–90 days).
- The **shop floor capacity overload** that triggers contractual delivery delays and liquidated damage penalties.
- What happens if the buyer takes an additional **30, 60, or 90 days** to clear the invoice.

> **The Core Challenge:** A business can receive an unmistakably profitable order and still experience an acute cash-flow insolvency crisis because expenses occur in days while customer payments arrive in months.

**DYNAFIN** is an AI-powered, pre-order financial decision intelligence platform built specifically for Indian MSMEs. It evaluates new business opportunities against existing cash balances, machine capacity, payment schedules, and debt commitments **before** money, materials, and time are committed.

DYNAFIN is **not** a generic accounting app, invoice generator, GST portal, or loan broker. Its sole mission is **pre-order financial decision intelligence**.

---

## 2. Key Features & Decision Modules

| Module | Route | Functionality |
| :--- | :--- | :--- |
| **Landing Experience** | `/` | Cinematic industrial editorial visual identity, kinetic cash-flow timeline, live interactive delay stress-tester. |
| **Executive Workspace** | `/workspace` | Operational & financial snapshot, plant capacity headroom, multi-PO pipeline, and switchable illustrative MSME profiles. |
| **Opportunity Studio** | `/opportunities` | The core decision engine. Dual-mode ingestion (PO PDF/image OCR extraction + manual entry), direct cost waterfall, and contribution margin analysis. |
| **Cash Flow Intelligence** | `/cash-flow` | Interactive day-by-day cash trajectory (30/60/90 days), modeling supplier advances, wage tranches, bank EMIs, and pinpointing peak cash deficits. |
| **Buyer Intelligence** | `/buyers` | Empirical payment discipline tracking based strictly on verified historical invoices, calculating average delay drift and on-time consistency. |
| **Risk Assessment** | `/risk` | 5-pillar vulnerability audit: Customer Concentration, Vendor Sourcing, Cash-Flow Deficits, Shop Floor Capacity, and Debt Service Burden. |
| **Scenario Laboratory** | `/scenarios` | Real-time what-if simulation with sliders for 0–90d buyer delays, 0–25% material inflation, advance variances, and side-by-side delta comparisons. |
| **Funding Navigator** | `/funding` | Verified Indian MSME financing discovery: CGTMSE, MUDRA Tarun, TReDS invoice discounting, PO Financing, and SIDBI SMILE schemes. |
| **Loan Readiness** | `/loan-readiness` | Comprehensive bank dossier checklist (Udyam, GST, ITR, balance sheets, POs) with completeness scoring and file upload interface. |
| **Loan Comparison** | `/loan-comparison` | Side-by-side financing calculator with standard reducing-balance EMI formulas, total interest outgo, processing fees, and effective APR. |
| **AI Financial Assistant** | `/assistant` | Context-aware decision copilot grounded in the MSME's stored financials and active purchase orders, answering specific risk queries. |
| **Report Centre** | `/reports` | Executive downloadable/printable institutional report with full direct-cost tables, 5-pillar scorecards, and credit structuring advice. |
| **Document Room** | `/documents` | Centralized repository for POs, tax returns, bank statements, and quotations, ready for Supabase Storage RLS integration. |
| **Business Settings** | `/settings` | Enterprise profile management, Udyam/PAN/GSTIN identifiers, and database connectivity parameters. |

---

## 3. Visual Identity: "Industrial Editorial Intelligence"

DYNAFIN rejects the generic SaaS template paradigm (no left-hand sidebar clutter, no neon gradients, no random cards, and no glassmorphism).

The design language fuses:
- **Premium Financial Publication** (asymmetric layouts, intentional whitespace, wide financial timelines).
- **Industrial Precision** (documentary clarity, shop-floor mechanics, technical data visualization).
- **Harmonious Palette**:
  - Primary Background (Warm Ivory): `#F3F0E7`
  - Primary Dark (Deep Charcoal Green): `#14221E`
  - Secondary Green (Sage): `#879B78`
  - Accent (Muted Rust): `#B66B4D`
  - Highlight (Warm Amber): `#D5A34E`
- **Typography**:
  - Headlines: *Instrument Serif* (Expressive, classical editorial weight).
  - Body & UI: *Inter* (Crisp, modern sans-serif).
  - Financial Data & Technical Labels: *IBM Plex Mono* (Tabular figures, timestamps, currency values).

---

## 4. Technical Architecture & Stack

```
                   ┌──────────────────────────────────────────────┐
                   │             DYNAFIN FRONTEND                 │
                   │    Next.js 14 (App Router) + React 18        │
                   │   Tailwind CSS + Framer Motion + Lucide      │
                   └──────────────────────┬───────────────────────┘
                                          │
                   ┌──────────────────────┴───────────────────────┐
                   │           DECISION ENGINE & STATE            │
                   │    WorkspaceContext + Financial Calculations │
                   │    Zod Schemas + Indian Currency Formatter   │
                   └──────────────────────┬───────────────────────┘
                                          │
       ┌──────────────────────────────────┴──────────────────────────────────┐
       │                                                                     │
┌──────▼───────────────────────────┐                       ┌─────────────────▼──────────────┐
│       SUPABASE POSTGRESQL        │                       │       AI SERVICE LAYER         │
│  18 Entities, UUID Keys, RLS     │                       │ Provider-Independent Interface │
│  Document Storage (Private RLS)  │                       │ Contextual Deterministic Guard │
└──────────────────────────────────┘                       └────────────────────────────────┘
```

- **Frontend Framework:** Next.js 14 with App Router, TypeScript, React 18.
- **Styling & Motion:** Tailwind CSS, PostCSS, Autoprefixer, Framer Motion.
- **Visualizations:** Recharts, custom SVG timeline nodes, print-friendly stylesheets.
- **Validation:** Zod schemas for PO ingestion, financial inputs, and auth payloads.
- **Database Architecture:** Supabase-ready PostgreSQL schema with 18 entities, strict foreign key constraints, indexes, and Row Level Security (RLS) policies.
- **Currency System:** Strictly formatted in Indian Rupee format (`₹15,00,000`, Lakhs, Crores). Never formatted as dollars.

---

## 5. Financial Calculation Methodology

All calculations in DYNAFIN are **pure, testable, deterministic algorithms**; AI is never permitted to fabricate financial totals:

1. **Total Direct Cost ($C_{direct}$):**
   $$C_{direct} = C_{materials} + C_{labour} + C_{production} + C_{packaging} + C_{logistics} + C_{utilities} + C_{other}$$

2. **Gross Contribution ($GC$) and Margin ($CM\%$):**
   $$GC = V_{order} - C_{direct}$$
   $$CM\% = \left(\frac{GC}{V_{order}}\right) \times 100$$
   *(DYNAFIN strictly distinguishes Gross Contribution from Net Operating Profit to avoid false confidence).*

3. **Working Capital Gap ($WC_{gap}$):**
   $$WC_{gap} = \max\left(0, C_{direct} - Advance_{received} - (Cash_{available} \times 0.60)\right)$$

4. **Reducing Balance Equated Monthly Installment ($EMI$):**
   $$EMI = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$
   Where $P$ is principal, $r$ is monthly interest rate ($\frac{\text{Annual Rate}}{12 \times 100}$), and $n$ is tenure in months.

5. **Counterparty Payment Delay Drift ($\Delta_{delay}$):**
   $$\Delta_{delay} = \frac{1}{N}\sum_{i=1}^{N} \max(0, Date_{payment, i} - Date_{due, i})$$
   Confidence score requires a minimum threshold of historical invoices ($N \ge 8$ for High, $N \ge 3$ for Moderate, otherwise Insufficient Data).

---

## 6. Realistic Indian MSME Demo Profiles

DYNAFIN includes three internally consistent, realistic Indian MSME profiles:

1. **Sri Textiles (Madurai, Tamil Nadu)**
   - Industry: Textile weaving & dyeing (grey fabrics & combed cotton shirting).
   - Staff: 12 employees | Vintage: 8 years | Available Liquid Cash: ₹2,80,000.
   - Active PO: ₹15,00,000 from Chennai Garment Exporters (15% advance, 45d terms).
   - Direct Costs: ₹9,00,000 | Gross Contribution: ₹6,00,000 (40.0% margin).
   - Peak Deficit: -₹2,85,000 at Day 42 before customer settlement.

2. **Kovai Precision Engineering (Coimbatore, Tamil Nadu)**
   - Industry: Light engineering & CNC machined automotive flanges.
   - Staff: 18 employees | Vintage: 11 years | Available Liquid Cash: ₹4,20,000.
   - Active PO: ₹28,50,000 from Sundaram Auto Ancillaries (10% advance, 60d terms).
   - Direct Costs: ₹22,00,000 | Gross Contribution: ₹6,50,000 (22.8% margin).

3. **Trichy Natural Food Processing (Tiruchirappalli, Tamil Nadu)**
   - Industry: Agro & Cold-pressed edible oils.
   - Staff: 9 employees | Vintage: 5 years | Available Liquid Cash: ₹1,90,000.
   - Active PO: ₹8,40,000 from Southern Spice & Grocery Marts (20% advance, 30d terms).
   - Direct Costs: ₹7,10,000 | Gross Contribution: ₹1,30,000 (15.5% margin).

---

## 7. Folder Structure

```
c:\Users\sanaa\OneDrive\Documents\Hackathon Projects\DynaFIN/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout, metadata, Google Fonts
│   │   ├── page.tsx                  # Cinematic editorial landing page
│   │   ├── login/page.tsx            # MSME authentication portal
│   │   ├── register/page.tsx         # Enterprise onboarding intake
│   │   ├── verify-email/page.tsx     # OTP security verification interface
│   │   ├── forgot-password/page.tsx  # Account recovery interface
│   │   ├── onboarding/page.tsx       # 5-step business onboarding wizard
│   │   ├── workspace/page.tsx        # Executive financial overview & switcher
│   │   ├── opportunities/
│   │   │   ├── page.tsx              # Opportunity Studio core decision workspace
│   │   │   └── new/page.tsx          # PO intake (PDF/image OCR + manual entry)
│   │   ├── cash-flow/page.tsx        # Interactive cash flow timeline
│   │   ├── buyers/page.tsx           # Buyer payment behavior & invoice history
│   │   ├── risk/page.tsx             # 5-pillar financial dependency audit
│   │   ├── scenarios/page.tsx        # Interactive scenario laboratory
│   │   ├── funding/page.tsx          # Indian MSME funding discovery navigator
│   │   ├── loan-readiness/page.tsx   # Bank compliance dossier checklist
│   │   ├── loan-comparison/page.tsx  # Side-by-side EMI & credit comparison
│   │   ├── assistant/page.tsx        # Grounded AI financial decision assistant
│   │   ├── reports/page.tsx          # Institutional printable executive report
│   │   ├── documents/page.tsx        # Document room & vault repository
│   │   └── settings/page.tsx         # Legal enterprise parameters & credentials
│   ├── components/
│   │   ├── layout/AppLayout.tsx      # Standard application wrapper
│   │   └── navigation/TopNav.tsx     # Editorial horizontal navigation & ticker
│   ├── data/
│   │   ├── demo/index.ts             # 3 reconcilable Indian MSME demo datasets
│   │   └── funding/schemes.ts        # Official Indian MSME schemes (CGTMSE, MUDRA, etc.)
│   ├── lib/
│   │   ├── calculations/financial.ts # Pure deterministic financial calculation engine
│   │   ├── context/WorkspaceContext.tsx # Central workspace state manager
│   │   └── formatting/currency.ts    # Indian Rupee (INR) and date formatters
│   ├── styles/globals.css            # Tailored editorial styles & print directives
│   └── types/index.ts                # Strict TypeScript domain interfaces
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # 18 Supabase tables, RLS policies, indexes
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── PROJECT_CONTEXT.md
└── README.md
```

---

## 8. Installation & Local Development

### Prerequisites
- **Node.js:** v18.17+ or v20+ (tested on Node v26)
- **Package Manager:** `npm` (v10+)

### Setup Commands
```bash
# 1. Clone repository or navigate to directory
cd "c:\Users\sanaa\OneDrive\Documents\Hackathon Projects\DynaFIN"

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 9. Supabase Stage 2 Connectivity

To connect live Supabase services:
1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/001_initial_schema.sql` in the **Supabase SQL Editor**.
3. Create two private storage buckets in the Supabase Dashboard: `documents` and `reports`.
4. Add your project credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

---

## 10. Security & Ethical Boundaries

- **No Public Data Exposure:** Strict PostgreSQL Row Level Security (RLS) ensures MSMEs only ever access their own financial records.
- **No Fabricated Credit Bureau Records:** The platform does not claim to know a buyer's external credit score from their name alone. Predictions are strictly grounded in empirical invoices uploaded by the user.
- **Never Automatically Reject or Accept:** DYNAFIN is an intelligence and decision-support workspace, leaving final commercial decisions to the business owner.
- **Responsible Financial Disclaimer:** DYNAFIN is not a scheduled commercial bank, registered NBFC, credit rating agency, or licensed investment adviser.

---

## 11. Project Contributors

* **Lead Fintech Architect & Full-Stack Engineer:** `[CONTRIBUTOR_NAME_PLACEHOLDER]`
* **Product Designer & Financial Systems Developer:** `[CONTRIBUTOR_NAME_PLACEHOLDER]`
* **Event:** ARTHATON 2026

---

© 2026 DYNAFIN – OPPORTUNITY IQ. Built for Indian MSME growth.
