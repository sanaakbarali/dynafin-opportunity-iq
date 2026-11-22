# DYNAFIN – OPPORTUNITY IQ

> **Don't just survive growth. Understand it. Prepare for it. Pursue it.**

**Know the financial risk before you accept the opportunity.**

**Event:** ARTHATON 2026

[![Live Demo](https://img.shields.io/badge/Live-Demo-879B78?style=for-the-badge)](https://dynafin-opportunity-iq.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-14221E?style=for-the-badge&logo=github)](https://github.com/sanaakbarali/dynafin-opportunity-iq)
[![Framework](https://img.shields.io/badge/Next.js-14-14221E?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase-879B78?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 1. Overview

Indian Micro, Small and Medium Enterprises (MSMEs) frequently face a financial challenge that is not immediately visible: accepting a profitable purchase order does not necessarily mean having enough cash to fulfil it.

A manufacturer may receive a purchase order worth ₹15,00,000 and expect a healthy contribution margin. However, raw material suppliers may demand advance payments, employees must be paid throughout production, electricity and operating expenses continue to accumulate, and the customer may settle the invoice only after 45–90 days.

The result is a mismatch between when money goes out and when it comes in.

This is the problem of **Opportunity Blindness**.

Business owners often evaluate opportunities using the order value and expected profit without having a consolidated understanding of:

- Upfront working capital requirements.
- Supplier advances and production expenses.
- Customer payment timelines and potential delays.
- Existing debt and monthly EMI commitments.
- Available production capacity.
- The financial consequences of unexpected cost increases.

### Our Solution

**DYNAFIN – Opportunity IQ** is an AI-powered financial decision intelligence platform designed for Indian MSMEs.

It evaluates potential business opportunities against a business's financial position, production capacity, payment schedules and existing obligations before the owner commits resources to an order.

DYNAFIN helps business owners understand not only whether an order appears profitable, but also whether the business can financially sustain its execution.

**DYNAFIN is a decision-support platform, not an accounting application, loan approval system or financial institution.**

---

## 2. The Problem We Address

Consider a textile manufacturer receiving a purchase order worth ₹15,00,000.

| Financial component | Amount |
|---|---:|
| Purchase order value | ₹15,00,000 |
| Direct production costs | ₹9,00,000 |
| Gross contribution | ₹6,00,000 |
| Contribution margin | 40% |

At first glance, the order appears attractive.

However:

- Suppliers require advance payments before production.
- Production wages and operating expenses must be paid on time.
- The customer offers payment terms of 45 days.
- Existing loan EMIs continue regardless of order execution.
- A delayed customer payment can increase the cash deficit.

The business could therefore face a liquidity crisis despite having a profitable order.

DYNAFIN addresses this gap by analysing profitability, liquidity, operational capacity and payment risks together.

---

## 3. Key Features and Modules

| Module | Route | Purpose |
|---|---|---|
| Landing Experience | `/` | Introduces DYNAFIN and its opportunity-risk assessment approach. |
| Executive Workspace | `/workspace` | Presents business financial indicators, operational information and opportunity summaries. |
| Opportunity Studio | `/opportunities` | Evaluates purchase orders, direct costs and contribution margins. |
| New Opportunity | `/opportunities/new` | Provides the purchase-order intake interface. |
| Cash Flow Intelligence | `/cash-flow` | Examines cash inflows, outflows and potential liquidity pressure. |
| Buyer Intelligence | `/buyers` | Organises buyer-related information and payment behaviour data. |
| Risk Assessment | `/risk` | Examines five major areas of business vulnerability. |
| Scenario Laboratory | `/scenarios` | Supports what-if analysis for changes in payment delays, costs and advances. |
| Funding Navigator | `/funding` | Presents Indian MSME financing options and funding information. |
| Loan Readiness | `/loan-readiness` | Organises documents and information required for financing applications. |
| Loan Comparison | `/loan-comparison` | Compares financing options using EMI and interest calculations. |
| AI Financial Assistant | `/assistant` | Answers financial questions using available business context and deterministic fallback reasoning. |
| Report Centre | `/reports` | Provides an executive reporting interface. |
| Document Room | `/documents` | Provides a central interface for business document management. |
| Business Settings | `/settings` | Provides business profile and application settings. |

### Five-Pillar Risk Assessment

DYNAFIN examines five important dimensions:

1. **Customer Concentration Risk:** Dependence on a limited number of buyers.
2. **Vendor Dependency Risk:** Dependence on critical suppliers and sourcing arrangements.
3. **Cash Flow Risk:** Ability to meet expenses before customer payments arrive.
4. **Production Capacity Risk:** Available manufacturing capacity and potential delivery constraints.
5. **Debt Service Risk:** Existing EMI obligations and their effect on available liquidity.

The purpose is to help business owners identify vulnerabilities before accepting additional commitments.

---

## 4. How DYNAFIN Works

The platform follows a pre-order financial assessment workflow.

1. **Business Information:** Establish the business profile, available cash, existing obligations and operational information.
2. **Purchase Order Assessment:** Enter the order value, customer advance, payment terms and expected costs.
3. **Financial Evaluation:** Calculate direct costs, gross contribution and contribution margin.
4. **Liquidity Assessment:** Estimate working capital requirements and identify potential cash shortages.
5. **Risk Evaluation:** Examine customer, supplier, capacity, cash-flow and debt-related vulnerabilities.
6. **Scenario Analysis:** Explore the impact of payment delays and cost variations.
7. **Decision Support:** Present financial insights and possible actions for the business owner to evaluate.

DYNAFIN does not automatically accept or reject purchase orders. The final commercial decision remains with the business owner.

---

## 5. Financial Calculation Methodology

DYNAFIN uses deterministic financial calculations for its core numerical assessments. Generative AI is not intended to replace or fabricate financial calculations.

### 5.1 Total Direct Cost

The total direct cost is the sum of expenses directly associated with fulfilling an order.

\[
C_{direct} =
C_{materials}+
C_{labour}+
C_{production}+
C_{packaging}+
C_{logistics}+
C_{utilities}+
C_{other}
\]

### 5.2 Gross Contribution

\[
GC=V_{order}-C_{direct}
\]

Where:

- \(GC\) = Gross contribution.
- \(V_{order}\) = Total purchase order value.
- \(C_{direct}\) = Total direct cost.

### 5.3 Contribution Margin

\[
CM\%=\frac{GC}{V_{order}}\times100
\]

Gross contribution is not the same as net profit. It does not automatically account for every operating expense, financing cost, tax or other business obligation.

### 5.4 Working Capital Gap

The project's working capital estimate uses the following model:

\[
WC_{gap}=
\max(0,C_{direct}-Advance-(Cash\times0.60))
\]

Where:

- \(C_{direct}\) = Total direct costs.
- \(Advance\) = Customer advance received.
- \(Cash\) = Available liquid cash.

The 60% cash factor represents a conservative availability assumption in this model.

**Important:** This working capital estimate is distinct from the peak cash deficit calculated across a time-based cash-flow projection. They should not be treated as interchangeable figures.

### 5.5 Equated Monthly Instalment (EMI)

For reducing-balance loans:

\[
EMI=\frac{P\times r\times(1+r)^n}{(1+r)^n-1}
\]

Where:

- \(P\) = Principal amount.
- \(r\) = Monthly interest rate.
- \(n\) = Loan tenure in months.

\[
r=\frac{\text{Annual Interest Rate}}{12\times100}
\]

### 5.6 Buyer Payment Delay

Average payment delay can be estimated from historical invoice records:

\[
\Delta_{delay}=
\frac{1}{N}\sum_{i=1}^{N}
\max(0,Date_{payment,i}-Date_{due,i})
\]

The availability of sufficient historical invoice data determines the confidence of payment-behaviour assessments.

- High confidence: At least 8 historical invoices.
- Moderate confidence: 3–7 historical invoices.
- Insufficient data: Fewer than 3 historical invoices.

These thresholds are intended for the platform's assessment model and do not represent an external credit rating.

---

## 6. Illustrative Indian MSME Profiles

DYNAFIN includes three illustrative business profiles representing different manufacturing and processing industries.

### 1. Sri Textiles – Madurai, Tamil Nadu

| Parameter | Value |
|---|---:|
| Industry | Textile weaving and dyeing |
| Employees | 12 |
| Business vintage | 8 years |
| Available liquid cash | ₹2,80,000 |
| Purchase order value | ₹15,00,000 |
| Customer advance | 15% |
| Payment terms | 45 days |
| Direct costs | ₹9,00,000 |
| Gross contribution | ₹6,00,000 |
| Contribution margin | 40% |
| Illustrative peak cash deficit | ₹2,85,000 |

### 2. Kovai Precision Engineering – Coimbatore, Tamil Nadu

| Parameter | Value |
|---|---:|
| Industry | CNC machining and light engineering |
| Employees | 18 |
| Business vintage | 11 years |
| Available liquid cash | ₹4,20,000 |
| Purchase order value | ₹28,50,000 |
| Customer advance | 10% |
| Payment terms | 60 days |
| Direct costs | ₹22,00,000 |
| Gross contribution | ₹6,50,000 |
| Contribution margin | 22.8% |

### 3. Trichy Natural Food Processing – Tiruchirappalli, Tamil Nadu

| Parameter | Value |
|---|---:|
| Industry | Agro-processing and cold-pressed edible oils |
| Employees | 9 |
| Business vintage | 5 years |
| Available liquid cash | ₹1,90,000 |
| Purchase order value | ₹8,40,000 |
| Customer advance | 20% |
| Payment terms | 30 days |
| Direct costs | ₹7,10,000 |
| Gross contribution | ₹1,30,000 |
| Contribution margin | 15.5% |

**Note:** These profiles are illustrative demonstration data. They are not verified financial statements or actual customer records.

---

## 7. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide |
| Charts | Recharts |
| Validation | Zod |
| Backend and Database | Supabase, PostgreSQL |
| Authentication | Supabase Auth |
| AI Integration | Google Gemini API with deterministic fallback |
| Deployment | Vercel |
| Version Control | Git and GitHub |

### Technical Architecture

```text
                  DYNAFIN APPLICATION
                         |
             Next.js 14 + React 18
                         |
                Application Modules
                         |
          Workspace Context and State
                         |
              Financial Calculation
                     Engine
                         |
          +--------------+--------------+
          |                             |
     SUPABASE                       AI LAYER
          |                             |
   PostgreSQL Database          Gemini API
          |                             |
   Row Level Security           Deterministic
          |                     Fallback Engine
          |
   Authentication
   Database Records
   Application Data
```

### Backend Architecture

The Supabase database schema includes 18 entities with relationships, indexes and Row Level Security policies.

The migration is maintained at:

`supabase/migrations/001_initial_schema.sql`

The application uses Supabase client and server utilities to support database and authentication integration.

---

## 8. AI Financial Assistant

DYNAFIN includes an AI-assisted financial decision interface designed to help MSME owners understand financial risks associated with purchase orders.

The assistant supports two execution modes.

### Gemini-Powered Mode

When a valid `GEMINI_API_KEY` is configured, the application attempts to use the Google Gemini API to generate contextual responses.

### Deterministic Fallback Mode

When the Gemini key is unavailable or the API request fails, the assistant uses a deterministic financial reasoning engine.

The fallback engine provides responses based on available financial context, including:

- Purchase order value.
- Direct production costs.
- Gross contribution.
- Available cash.
- Working capital requirements.
- Customer advances.
- Debt EMI obligations.
- Production capacity.

This architecture allows the assistant to provide basic financial decision support without depending entirely on an external generative AI service.

**Financial figures should be validated using the underlying calculation logic and business records. AI-generated responses are advisory, not financial guarantees.**

---

## 9. Visual Identity – Industrial Editorial Intelligence

DYNAFIN uses an industrial editorial design language rather than a conventional generic SaaS interface.

The visual direction combines the clarity of a financial publication with the precision of industrial data presentation.

### Colour Palette

| Colour | Hex Code | Usage |
|---|---|---|
| Warm Ivory | `#F3F0E7` | Primary background |
| Deep Charcoal Green | `#14221E` | Primary dark surfaces |
| Sage | `#879B78` | Secondary green |
| Muted Rust | `#B66B4D` | Accent |
| Warm Amber | `#D5A34E` | Highlights |

### Typography

- **Instrument Serif:** Editorial headlines.
- **Inter:** Body text and interface elements.
- **IBM Plex Mono:** Financial values, technical labels and numerical information.

### Design Principles

- Asymmetric editorial layouts.
- Clear financial data hierarchy.
- Industrial visual references.
- Contextual navigation.
- Purposeful transitions and animations.
- Interactive financial visualisations.
- Minimal decorative elements.

---

## 10. Project Structure

```text
dynafin-opportunity-iq/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── assistant/
│   │   │       └── route.ts
│   │   │
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── page.tsx
│   │   │
│   │   ├── assistant/
│   │   ├── buyers/
│   │   ├── cash-flow/
│   │   ├── documents/
│   │   ├── forgot-password/
│   │   ├── funding/
│   │   ├── loan-comparison/
│   │   ├── loan-readiness/
│   │   ├── login/
│   │   ├── onboarding/
│   │   ├── opportunities/
│   │   ├── register/
│   │   ├── reports/
│   │   ├── risk/
│   │   ├── scenarios/
│   │   ├── settings/
│   │   ├── verify-email/
│   │   ├── workspace/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   └── navigation/
│   │
│   ├── data/
│   │   ├── demo/
│   │   └── funding/
│   │
│   ├── lib/
│   │   ├── calculations/
│   │   ├── context/
│   │   ├── formatting/
│   │   └── supabase/
│   │
│   ├── styles/
│   └── types/
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── .env.example
├── .gitignore
├── DEVELOPMENT_STATUS.md
├── PROJECT_CONTEXT.md
├── README.md
├── package.json
├── package-lock.json
├── next.config.mjs
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 11. Installation and Local Development

### Prerequisites

- Node.js 18.17 or later.
- npm 10 or later.
- A Supabase project for live backend connectivity.

### Clone the Repository

```bash
git clone https://github.com/sanaakbarali/dynafin-opportunity-iq.git
```

### Navigate to the Project

```bash
cd dynafin-opportunity-iq
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the project root.

Add the following:

```env
NEXT_PUBLIC_APP_NAME="DYNAFIN"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"

GEMINI_API_KEY=""
```

The Gemini API key is optional because the assistant includes a deterministic fallback.

Never commit `.env.local` or expose private credentials in the repository.

### Configure Supabase Database

1. Create a project in Supabase.
2. Open the SQL Editor.
3. Execute the migration file:

   `supabase/migrations/001_initial_schema.sql`

4. Configure authentication redirect URLs for local development.
5. Verify the database tables and access policies.

### Start Development Server

```bash
npm run dev
```

Open:

`http://localhost:3000`

### Production Build

```bash
npm run build
```

### Start Production Server Locally

```bash
npm run start
```

---

## 12. Supabase Configuration

DYNAFIN uses Supabase as its backend platform.

### Database

The PostgreSQL schema contains 18 entities covering the application's business and financial data requirements.

### Security

Row Level Security policies are included in the database migration to support tenant-level data isolation.

### Authentication

Supabase Authentication is integrated into the application's registration, login and email confirmation workflow.

### Environment Variables

The application supports the following Supabase configuration:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Alternative key name supported by the client configuration |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side administrative key, only where required |

Never expose the service-role key in client-side code or commit it to GitHub.

---

## 13. Production Deployment

DYNAFIN is deployed using **Vercel**, with its source code maintained in GitHub.

### Deployment Workflow

```text
Local Development
       |
       v
    Git Commit
       |
       v
   GitHub Repository
       |
       v
  Vercel Deployment
       |
       v
 Production Application
       |
       v
 Supabase Backend
```

### Deployment Configuration

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy using the Next.js framework configuration.
5. Configure the production URL in Supabase Authentication redirect settings.

Live application:

**[Open DYNAFIN – Opportunity IQ](https://dynafin-opportunity-iq.vercel.app/)**

---

## 14. Security and Responsible Use

DYNAFIN is designed to support responsible financial decision-making.

### Data Protection

- PostgreSQL Row Level Security policies are included in the database migration.
- Application credentials are configured through environment variables.
- Private administrative credentials must remain server-side.
- Business financial information should only be accessed by authorised users.

### Responsible Financial Decision Support

- DYNAFIN does not claim to access external buyer credit bureau records.
- Buyer payment analysis should be based on available historical invoice data.
- Demo data is illustrative and must not be interpreted as verified financial information.
- AI-generated responses should not replace independent financial verification.
- Funding information should be verified with the relevant institution or official government source.
- DYNAFIN does not automatically approve or reject commercial opportunities.
- The final decision remains with the business owner.

DYNAFIN is not a scheduled commercial bank, registered NBFC, credit rating agency or licensed investment adviser.

---

## 15. Current Scope and Limitations

DYNAFIN is developed as a hackathon prototype demonstrating pre-order financial decision intelligence for Indian MSMEs.

The application includes financial assessment interfaces, illustrative business profiles, a deterministic calculation layer, an AI assistant with fallback reasoning, and Supabase integration.

Certain capabilities require further end-to-end validation and production hardening, including:

- Automated extraction and validation of purchase-order documents.
- Complete persistence of every business module in Supabase.
- Historical invoice ingestion and buyer payment analytics.
- Secure document upload, storage and retrieval workflows.
- Comprehensive multi-user and tenant-isolation testing.
- Independent validation of financial projections against real business records.
- Production monitoring and error handling.

The accuracy of financial insights depends on the quality, completeness and correctness of the information supplied by the business.

---

## 16. Future Enhancements

Potential areas for further development include:

- Advanced purchase-order OCR and structured data extraction.
- Integration with accounting and ERP platforms.
- Improved cash-flow forecasting using historical transactions.
- More detailed production scheduling and capacity planning.
- Verified financing and government scheme information integrations.
- Advanced buyer payment behaviour analytics.
- Automated financial report generation.
- Expanded security, audit logging and monitoring.

---

## 17. Project Contributors

**Event:** ARTHATON 2026

**Team Members:**

- Sana Akbar Ali
- Kalanithi A
- Askandar Sherif A

---

## 18. Acknowledgement

DYNAFIN – Opportunity IQ was developed as a solution to the financial visibility challenges faced by Indian MSMEs.

The project aims to help business owners evaluate opportunities with a clearer understanding of profitability, liquidity, operational constraints and financial risk.

**A profitable order should not become a financial crisis.**

---

© 2026 DYNAFIN – OPPORTUNITY IQ. Built for Indian MSME growth.
