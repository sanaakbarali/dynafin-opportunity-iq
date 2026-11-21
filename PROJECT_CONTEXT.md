# DYNAFIN – OPPORTUNITY IQ | PROJECT CONTEXT

**Event:** ARTHATON 2026  
**Application:** DYNAFIN – Opportunity IQ  
**Tagline:** *"Don't just survive growth. Understand it. Prepare for it. Pursue it."*  
**Core Promise:** *"Know the financial risk before you accept the opportunity."*  
**Current Development Stage:** ALL 10 PHASES COMPLETED & PRODUCTION VERIFIED (Supabase PostgreSQL Schema Hardened, RLS Complete, Storage Vault Integrated, Full Dual-Mode Auth & Data Access Layer Operational, Next.js Production Build Passing 25/25 Routes).

---

## 1. Problem Statement: Opportunity Blindness in Indian MSMEs

Indian Micro, Small and Medium Enterprises frequently experience fatal cash-flow contagion after receiving seemingly lucrative purchase orders. The business owner evaluates the top-line selling price (e.g. ₹15,00,000) and knows gross material and labour costs (e.g. ₹9,00,000), expecting ₹6,00,000 contribution.

However, the enterprise experiences a severe working capital deficit because:
- Raw material suppliers require upfront cash or tight 15-day credit.
- Direct labour, electricity, and packaging costs must be paid immediately during production.
- Production and transport require 21–30 days.
- The institutional buyer pays 45–60 days *after* delivery.
- Existing loan EMIs (e.g. ₹42,000/month) continue debiting automatically.

DYNAFIN is **pre-order financial decision intelligence**. It evaluates whether the enterprise has the upfront cash, working capital buffer, capacity headroom, and debt coverage to survive fulfilling the order before committing money, materials, and time.

---

## 2. Technology Architecture & Conventions

### Frontend Stack
- **Framework:** Next.js 14 with App Router (React 18, TypeScript)
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Motion:** Framer Motion (Purposeful, kinetic reveals, scrubbers, and reduced-motion compliant)
- **Icons:** Lucide React (Functional only, zero decorative emojis/AI slop)
- **Charts:** Recharts + Custom SVG Financial Milestones
- **Validation:** Zod schemas
- **Formatters:** Indian Rupee currency standard (`₹15,00,000`, Lakhs/Crores, zero USD/$)

### Backend & Data Tier
- **Database:** Supabase PostgreSQL with 18 relational entities
- **Security:** Strict Row Level Security (RLS) on all 18 tables + Storage buckets
- **Auth:** Supabase Auth (Email/Password, Email OTP verification, Session persistence)
- **Storage:** Private Supabase Storage buckets (`documents` for PO/invoice uploads, `reports` for PDFs)
- **Data Access:** Provider-independent client (`src/lib/supabase/client.ts`, `server.ts`) with dual-mode fallback (offline demo mode alongside live Supabase operations)

---

## 3. Visual Identity: "Industrial Editorial Intelligence"

The visual aesthetic blends a prestigious financial review with modern manufacturing precision.

### Color Tokens
- **Warm Ivory:** `#F3F0E7` (Primary background, paper feel)
- **Deep Charcoal Green:** `#14221E` (Primary dark tone, editorial headers, deep contrast)
- **Sage:** `#879B78` (Secondary operational green, healthy margins)
- **Muted Rust:** `#B66B4D` (Accent, risk flags, deficit alerts, warnings)
- **Warm Amber:** `#D5A34E` (Highlight, milestone checkpoints, active tabs)
- **Warm White:** `#FAF8F3` (Surface cards)
- **Muted Grey:** `#E8E3D5` (Borders and dividers)

### Typography
- **Headlines:** `Instrument Serif` (Editorial serif, intentional hierarchy)
- **Body & Labels:** `Inter` (Functional sans-serif, high legibility)
- **Financial Values & Mono:** `IBM Plex Mono` (Tabular figures, aligned decimals)

---

## 4. Application Routes Map (All 20 Routes Functional)

1. `/` — Cinematic Landing Experience & Live Stress Tester
2. `/login` — MSME Sign-In Portal
3. `/register` — Enterprise Registration
4. `/verify-email` — Security OTP Verification Interface (Suspense-isolated)
5. `/forgot-password` — Password Recovery Interface
6. `/onboarding` — 5-Step MSME Financial Profile Wizard
7. `/workspace` — Executive Financial Snapshot & Multi-PO Pipeline
8. `/opportunities` — Opportunity Studio (Waterfall Breakdown, Working Capital Gap)
9. `/opportunities/new` — Purchase Order Ingestion (OCR Review + Manual Input)
10. `/cash-flow` — Interactive Cash Flow Intelligence (30/60/90-Day Milestones)
11. `/buyers` — Buyer Payment Discipline & Invoice Ledger
12. `/risk` — 5-Pillar Vulnerability Assessment (Cash, Buyer, Supplier, Ops, Debt)
13. `/scenarios` — Scenario Laboratory (Interactive Stress-Test Sliders)
14. `/funding` — Funding Navigator (Verified Indian Schemes: CGTMSE, MUDRA, TReDS, PO Financing)
15. `/loan-readiness` — Bank Loan Compliance Checklist & Scorecard
16. `/loan-comparison` — EMI & Total Cost of Credit Comparison Calculator
17. `/assistant` — Context-Aware AI Financial Decision Assistant
18. `/reports` — Institutional PDF Pre-Order Decision Report
19. `/documents` — Document Room & Repository Vault
20. `/settings` — Enterprise Legal Identifiers (Udyam, GSTIN, PAN) & Architecture Info

---

## 5. Ten-Phase Roadmap & Delivery Status

1. **Phase 1 (Complete):** Supabase Schema Review, RLS Hardening, Storage Configuration & Seed Script.
2. **Phase 2 (Complete):** Live Authentication, Protected Routes & Session Handling (`/login`, `/register`, `/verify-email`, `/forgot-password`, `/auth/callback`, `/onboarding`).
3. **Phase 3 (Complete):** Persistent Business Data & CRUD Operations (`WorkspaceContext.tsx` with profiles, businesses, financials, operations, and trading partners).
4. **Phase 4 (Complete):** Opportunity Evaluation Workflow & Purchase Order Ingestion (`/opportunities`, `/opportunities/new` with multi-table database insertion).
5. **Phase 5 (Complete):** Cash Flow Projections, Buyer Analytics, 5-Pillar Risk Engine & Scenario Simulator (`/cash-flow`, `/buyers`, `/risk`, `/scenarios`).
6. **Phase 6 (Complete):** Private Storage Document Upload & Signed URL Vault (`/documents` with Supabase Storage integration).
7. **Phase 7 (Complete):** Live Grounded AI Financial Assistant (`/assistant`, `/api/assistant` with Gemini API + deterministic grounding).
8. **Phase 8 (Complete):** Funding Scheme Matching, Institutional Reports & Proactive Alerts (`/funding`, `/loan-readiness`, `/loan-comparison`, `/reports`).
9. **Phase 9 (Complete):** Kinetic Motion Polish & Industrial Editorial Design Refinements (Warm Ivory, Charcoal Green, Sage, Rust, Amber, Indian Rupee formatting).
10. **Phase 10 (Complete):** End-to-End Verification, TypeScript 0-Error Check, and 25/25 Route Next.js Production Build Pass.
