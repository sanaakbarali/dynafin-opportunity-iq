'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  Coins,
  Cpu,
  Layers,
  CheckCircle,
  FileSpreadsheet,
  ChevronRight,
  Building2,
  Calendar,
} from 'lucide-react';
import { formatINR } from '@/lib/formatting/currency';

export default function LandingPage() {
  // Interactive Demo State for Section 5
  const [delayDays, setDelayDays] = useState<number>(30);
  const [advancePct, setAdvancePct] = useState<number>(15);

  const baseOrderValue = 1500000; // ₹15,00,000
  const directCosts = 900000; // ₹9,00,000
  const grossContribution = baseOrderValue - directCosts; // ₹6,00,000 (40%)
  const availableCash = 280000; // ₹2,80,000

  // Interactive calculations
  const customerAdvance = (baseOrderValue * advancePct) / 100;
  const upfrontManufacturingNeed = 600000 * 0.5 + 200000 * 0.5; // ₹4,00,000
  const immediateGap = Math.max(0, upfrontManufacturingNeed - customerAdvance);
  const totalReceivableBalance = baseOrderValue - customerAdvance;
  const simulatedPeakDeficit = Math.round(
    Math.max(0, directCosts - customerAdvance - availableCash + (delayDays > 30 ? 76000 : 38000))
  );
  const simulatedRiskLevel =
    delayDays >= 60 || simulatedPeakDeficit > availableCash * 1.2
      ? 'Critical Risk'
      : delayDays >= 30
      ? 'High Risk'
      : 'Moderate Risk';

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans selection:bg-amber selection:text-charcoal overflow-x-hidden">
      {/* Top Editorial Bar */}
      <div className="bg-charcoal text-ivory border-b border-charcoal-400 px-4 sm:px-8 py-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl sm:text-2xl tracking-tight font-normal text-ivory">
            DYNAFIN
          </span>
          <span className="hidden sm:inline text-sage-light text-[11px] uppercase tracking-widest border border-sage/40 px-2 py-0.5">
            Opportunity IQ
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <Link
            href="/workspace"
            className="text-ivory-300 hover:text-ivory transition-colors hidden md:inline"
          >
            Demo Workspace
          </Link>
          <Link
            href="/login"
            className="text-ivory-300 hover:text-ivory transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/opportunities"
            className="bg-amber hover:bg-amber-light text-charcoal font-semibold px-3 py-1.5 transition-colors flex items-center gap-1.5"
          >
            <span>Launch IQ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: HERO
          ========================================================================= */}
      <section className="relative border-b border-border-light overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* Left Column: Expressive Editorial Typography */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 border-l-2 border-rust pl-3 py-1 text-xs font-mono uppercase tracking-widest text-rust">
                <span>Pre-Order Financial Decision Intelligence for Indian MSMEs</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-charcoal font-normal">
                Growth is an opportunity. <br />
                <span className="italic font-serif text-rust">
                  But can your business afford it?
                </span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-400 font-sans max-w-2xl leading-relaxed">
                DYNAFIN helps Indian small & medium manufacturers evaluate the true financial
                risk, working capital deficit, and shop floor capacity consequences of a new
                purchase order <span className="font-semibold text-charcoal">before</span> committing money, materials, and time.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/opportunities"
                  className="px-6 py-3.5 bg-charcoal hover:bg-charcoal-600 text-ivory text-sm font-mono tracking-wider uppercase transition-all flex items-center gap-3 border border-charcoal shadow-lg hover:shadow-xl"
                >
                  <span>Evaluate an Opportunity</span>
                  <ArrowRight className="w-4 h-4 text-amber" />
                </Link>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal text-sm font-mono tracking-wider uppercase transition-colors border border-border-light flex items-center gap-2"
                >
                  <span>Explore How It Works</span>
                  <ChevronRight className="w-4 h-4 text-charcoal-400" />
                </a>
              </div>

              {/* Editorial Micro-Metrics */}
              <div className="pt-8 border-t border-border-light/80 grid grid-cols-3 gap-6 font-mono text-xs text-charcoal-300">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-charcoal">₹15 Lakh</div>
                  <div className="text-[11px] text-charcoal-400 mt-0.5">Order Size Focus</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-rust">63%</div>
                  <div className="text-[11px] text-charcoal-400 mt-0.5">MSMEs Suffer Delayed Receipts</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-sage-dark">0-Guesswork</div>
                  <div className="text-[11px] text-charcoal-400 mt-0.5">Deterministic Financial Engine</div>
                </div>
              </div>
            </div>

            {/* Right Column: Industrial Visual Composition & Kinetic Simulation Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-charcoal text-ivory p-6 sm:p-7 border border-charcoal-300 shadow-2xl relative">
                {/* Visual Label */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-charcoal-400 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                    <span className="text-sage-light uppercase tracking-wider">Live Pre-Commitment Diagnostic</span>
                  </div>
                  <span className="text-ivory-400 font-mono text-[11px]">Sri Textiles • Madurai</span>
                </div>

                {/* The Opportunity Snapshot */}
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-sage font-mono uppercase">Purchase Order Evaluation</div>
                    <div className="text-lg font-serif text-ivory mt-0.5">
                      PO #CG-8821: 100% Combed Cotton Shirting
                    </div>
                  </div>

                  <div className="bg-charcoal-400 p-3.5 border border-charcoal-300 grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-sage-light block text-[11px]">Total Order Value</span>
                      <span className="text-base font-bold text-ivory">₹15,00,000</span>
                    </div>
                    <div>
                      <span className="text-sage-light block text-[11px]">Gross Contribution</span>
                      <span className="text-base font-bold text-amber">₹6,00,000 (40%)</span>
                    </div>
                  </div>

                  {/* The Liquidity Illusion Callout */}
                  <div className="p-3 bg-rust/20 border border-rust/40 text-xs text-ivory-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-rust-light font-mono uppercase text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>The Liquidity Paradox</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-ivory-300">
                      On paper, this order delivers <strong className="text-ivory">₹6,00,000 gross margin</strong>.
                      Yet at Day 42, before buyer credit clears, your business will reach a{' '}
                      <strong className="text-rust-light font-mono">₹2,85,000 cash deficit</strong>.
                    </p>
                  </div>

                  {/* Horizontal Timing Bar */}
                  <div className="space-y-1.5 pt-2 font-mono text-[11px]">
                    <div className="flex justify-between text-sage-light">
                      <span>Upfront Cash Needed: ₹4.0L</span>
                      <span>Buyer Settlement: Day 73</span>
                    </div>
                    <div className="w-full bg-charcoal-300 h-2 flex overflow-hidden">
                      <div className="bg-rust w-1/3" title="Raw Material Advance" />
                      <div className="bg-amber w-1/4" title="Labour & Production" />
                      <div className="bg-sage w-5/12" title="Unfunded Wait Period" />
                    </div>
                    <div className="text-[10px] text-charcoal-300 flex justify-between">
                      <span>T+0 PO Signed</span>
                      <span>T+24 Shipped</span>
                      <span>T+73 Payment Arrives</span>
                    </div>
                  </div>

                  <Link
                    href="/opportunities"
                    className="w-full mt-4 py-2.5 bg-ivory text-charcoal hover:bg-ivory-100 font-mono text-xs uppercase tracking-wider font-semibold text-center block transition-colors border border-ivory"
                  >
                    Inspect Full Pre-Order Assessment →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE PROBLEM (PROFITABILITY VS. LIQUIDITY)
          ========================================================================= */}
      <section className="py-20 border-b border-border-light bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-rust block mb-2">
              The Structural Vulnerability of Indian MSMEs
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-charcoal font-normal">
              A profitable order can still create a devastating cash crisis.
            </h2>
            <p className="mt-4 text-charcoal-400 font-sans text-base leading-relaxed">
              Accounting profit is an abstraction of the future. Cash flow is the relentless physical
              reality of today. When an Indian MSME accepts an order, expenses occur in days, but payments
              arrive in months.
            </p>
          </div>

          {/* Animated Horizontal Timeline of Financial Exposure */}
          <div className="bg-ivory p-6 sm:p-8 border border-border-light shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-6 flex items-center justify-between">
              <span>Order Execution Timeline vs. Cash Exposure</span>
              <span className="text-rust font-semibold">Visualizing the 53-Day Liquidity Valley</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="p-4 bg-ivory-100 border-t-4 border-rust space-y-2">
                <div className="text-[11px] font-mono text-rust uppercase font-semibold">Stage 01 • Day 0–5</div>
                <div className="font-serif text-lg text-charcoal">Upfront Outflow</div>
                <p className="text-xs text-charcoal-400 leading-relaxed font-sans">
                  Raw material suppliers demand 40–50% cash advances before dispatching yarn or steel.
                </p>
                <div className="text-xs font-mono text-rust font-semibold pt-1">
                  Cash Impact: -₹2,40,000
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-ivory-100 border-t-4 border-amber space-y-2">
                <div className="text-[11px] font-mono text-amber-dark uppercase font-semibold">Stage 02 • Day 15–25</div>
                <div className="font-serif text-lg text-charcoal">Wages & Utilities</div>
                <p className="text-xs text-charcoal-400 leading-relaxed font-sans">
                  Shop floor workers must be paid weekly. Power discom bills and machine maintenance cannot wait.
                </p>
                <div className="text-xs font-mono text-rust font-semibold pt-1">
                  Cash Impact: -₹1,80,000
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-ivory-100 border-t-4 border-charcoal-300 space-y-2">
                <div className="text-[11px] font-mono text-charcoal-400 uppercase font-semibold">Stage 03 • Day 25–30</div>
                <div className="font-serif text-lg text-charcoal">Goods Delivered</div>
                <p className="text-xs text-charcoal-400 leading-relaxed font-sans">
                  Product arrives at buyer depot. Contract specifies 45 days credit terms from GRN generation.
                </p>
                <div className="text-xs font-mono text-charcoal font-semibold pt-1">
                  Cash Impact: ₹0 (Awaiting Payment)
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 bg-ivory-100 border-t-4 border-sage-dark space-y-2">
                <div className="text-[11px] font-mono text-sage-dark uppercase font-semibold">Stage 04 • Day 73+</div>
                <div className="font-serif text-lg text-charcoal">Buyer Settlement</div>
                <p className="text-xs text-charcoal-400 leading-relaxed font-sans">
                  Corporate buyer clears invoice after 28-day historical payment delay. Profit is finally realized.
                </p>
                <div className="text-xs font-mono text-sage-dark font-semibold pt-1">
                  Cash Inflow: +₹12,75,000
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-charcoal text-ivory flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <span className="text-ivory-300">
                During Days 5 through 73, your business operates in negative cash flow. If you do not have bridge capital, checks bounce.
              </span>
              <span className="text-amber font-bold whitespace-nowrap">
                DYNAFIN Predicts This Gap in Seconds
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE DYNAFIN APPROACH (5 STAGES)
          ========================================================================= */}
      <section id="how-it-works" className="py-20 border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-sage-dark block mb-2">
              Systematic Decision Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-charcoal font-normal">
              Five connected stages to eliminate opportunity blindness.
            </h2>
          </div>

          {/* Asymmetric Editorial Flow */}
          <div className="space-y-6">
            {[
              {
                num: '01',
                title: 'Enter the Opportunity',
                tag: 'Document OCR & PO Digitization',
                desc: 'Upload a purchase order PDF, image, or enter parameters manually. Instant extraction of line items, delivery milestones, credit periods, and penalty clauses.',
                action: 'Try in Opportunity Studio',
                href: '/opportunities',
              },
              {
                num: '02',
                title: 'Understand the Business',
                tag: 'Capacity & Working Capital Baselining',
                desc: 'Cross-reference the new order against existing monthly commitments: available liquid bank balances, recurring loan EMIs, vendor payables, and shop floor machine capacity.',
                action: 'Inspect Workspace Profile',
                href: '/workspace',
              },
              {
                num: '03',
                title: 'Analyse Financial Exposure',
                tag: '5-Pillar Dependency Matrix',
                desc: 'Deterministic evaluation of customer concentration, supplier single-source risk, cash-flow deficit points, capacity overload, and existing debt service burdens.',
                action: 'View Risk Assessment',
                href: '/risk',
              },
              {
                num: '04',
                title: 'Stress-Test Possible Futures',
                tag: 'Interactive Scenario Laboratory',
                desc: 'Simulate what happens if the corporate customer delays payment by 30, 60, or 90 days, or if yarn and steel prices spike by 15% midway through production.',
                action: 'Open Scenario Lab',
                href: '/scenarios',
              },
              {
                num: '05',
                title: 'Make an Informed Decision',
                tag: 'Actionable Intelligence & Bridge Financing',
                desc: 'Never automatically accept or reject. Discover verified Indian MSME schemes (CGTMSE, MUDRA, TReDS, PO Financing) to safely structure and finance the order.',
                action: 'Explore Funding Navigator',
                href: '/funding',
              },
            ].map((step, idx) => (
              <div
                key={step.num}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 bg-ivory border border-border-light hover:border-charcoal transition-colors items-center"
              >
                <div className="lg:col-span-2">
                  <span className="font-serif text-4xl sm:text-5xl text-charcoal font-normal">
                    {step.num}
                  </span>
                </div>
                <div className="lg:col-span-4">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-rust block">
                    {step.tag}
                  </span>
                  <h3 className="font-serif text-2xl text-charcoal mt-1">
                    {step.title}
                  </h3>
                </div>
                <div className="lg:col-span-4">
                  <p className="text-xs sm:text-sm text-charcoal-400 font-sans leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="lg:col-span-2 flex lg:justify-end">
                  <Link
                    href={step.href}
                    className="text-xs font-mono uppercase tracking-wider text-charcoal hover:text-rust transition-colors flex items-center gap-1 font-semibold underline underline-offset-4"
                  >
                    <span>{step.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PRODUCT CAPABILITIES
          ========================================================================= */}
      <section className="py-20 border-b border-border-light bg-charcoal text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-sage block mb-2">
              Fintech Decision Workspace
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-ivory font-normal">
              Built specifically for the operational mechanics of Indian manufacturing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Opportunity Studio',
                desc: 'Upload purchase orders with OCR extraction. Instant calculation of raw material, labour, utility, and direct costs without confusing gross contribution for net profit.',
                tag: 'Pre-Order Intelligence',
                href: '/opportunities',
              },
              {
                title: 'Cash Flow Intelligence',
                desc: 'Interactive financial timeline projecting daily and weekly balances. Pinpoint the exact date of peak cash deficit and duration of your funding gap.',
                tag: 'Cash Timing',
                href: '/cash-flow',
              },
              {
                title: 'Buyer Intelligence',
                desc: 'Analyse corporate customer payment discipline using empirical historical invoices. Know average delay days and on-time consistency before signing contracts.',
                tag: 'Credit Behavior',
                href: '/buyers',
              },
              {
                title: 'Scenario Laboratory',
                desc: 'Dynamic what-if simulator. Move sliders to test 30/60/90-day payment delays, 10–15% material price inflation, and customer advance variances.',
                tag: 'Stress Testing',
                href: '/scenarios',
              },
              {
                title: 'Funding Navigator',
                desc: 'Curated Indian MSME financing products: CGTMSE, MUDRA Tarun, TReDS invoice discounting, PO financing, and SIDBI SMILE schemes with verified criteria.',
                tag: 'Capital Discovery',
                href: '/funding',
              },
              {
                title: 'Report Centre & AI Assistant',
                desc: 'Generate professional executive PDF reports formatted for bank managers and enterprise partners. Query the AI Assistant about specific order risks.',
                tag: 'Decision Support',
                href: '/reports',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-charcoal-500 border border-charcoal-400 hover:border-amber transition-colors space-y-3"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-light">
                  {feature.tag}
                </div>
                <h3 className="font-serif text-2xl text-ivory">{feature.title}</h3>
                <p className="text-xs text-ivory-300 leading-relaxed font-sans">
                  {feature.desc}
                </p>
                <div className="pt-2">
                  <Link
                    href={feature.href}
                    className="text-xs font-mono text-sage-light hover:text-ivory flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>Explore module</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: INTERACTIVE DEMONSTRATION
          ========================================================================= */}
      <section className="py-20 border-b border-border-light bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-rust block mb-2">
              Live Interactive Stress-Test
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-charcoal font-normal">
              Test how a payment delay transforms an order.
            </h2>
            <p className="mt-4 text-charcoal-400 font-sans text-sm sm:text-base leading-relaxed">
              Use the sliders below to adjust the customer payment delay on a sample ₹15 Lakh order.
              Watch how the peak cash deficit and risk status update dynamically.
            </p>
          </div>

          <div className="bg-charcoal text-ivory p-6 sm:p-10 border border-charcoal-300 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-sage-light uppercase">Customer Payment Delay</span>
                    <span className="text-amber font-bold text-sm">+{delayDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="15"
                    value={delayDays}
                    onChange={(e) => setDelayDays(Number(e.target.value))}
                    className="w-full accent-amber bg-charcoal-400 h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-ivory-400 mt-1">
                    <span>On-time (0d)</span>
                    <span>+30 Days</span>
                    <span>+60 Days</span>
                    <span>+90 Days</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-sage-light uppercase">Customer Advance Received</span>
                    <span className="text-amber font-bold text-sm">{advancePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="5"
                    value={advancePct}
                    onChange={(e) => setAdvancePct(Number(e.target.value))}
                    className="w-full accent-amber bg-charcoal-400 h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-ivory-400 mt-1">
                    <span>0% (No Advance)</span>
                    <span>15% Advance</span>
                    <span>30% Advance</span>
                  </div>
                </div>

                <div className="pt-2 text-xs font-mono text-ivory-300 bg-charcoal-400 p-3 border border-charcoal-300">
                  <span className="text-sage font-bold block mb-1">Assumptions:</span>
                  Order: ₹15,00,000 • Direct Costs: ₹9,00,000 • Available Cash: ₹2,80,000 • Monthly EMI: ₹38,000.
                </div>
              </div>

              {/* Dynamic Results Column */}
              <div className="lg:col-span-7 bg-charcoal-400 p-6 sm:p-8 border border-charcoal-300 space-y-6">
                <div className="flex items-center justify-between border-b border-charcoal-300 pb-3">
                  <span className="text-xs font-mono uppercase text-sage-light">Dynamic Projections</span>
                  <span
                    className={`text-xs font-mono uppercase font-bold px-2.5 py-1 ${
                      simulatedRiskLevel === 'Critical Risk'
                        ? 'bg-rust text-ivory'
                        : simulatedRiskLevel === 'High Risk'
                        ? 'bg-amber text-charcoal'
                        : 'bg-sage-dark text-ivory'
                    }`}
                  >
                    {simulatedRiskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <span className="text-ivory-400 block text-[11px]">Gross Contribution</span>
                    <span className="text-lg font-bold text-ivory">{formatINR(grossContribution)}</span>
                    <span className="text-[10px] text-sage block">40.0% Margin</span>
                  </div>
                  <div>
                    <span className="text-ivory-400 block text-[11px]">Advance Inflow</span>
                    <span className="text-lg font-bold text-ivory">{formatINR(customerAdvance)}</span>
                    <span className="text-[10px] text-ivory-300 block">{advancePct}% of PO</span>
                  </div>
                  <div>
                    <span className="text-ivory-400 block text-[11px]">Upfront Capital Gap</span>
                    <span className="text-lg font-bold text-rust-light">{formatINR(immediateGap)}</span>
                    <span className="text-[10px] text-ivory-300 block">Day 0 Requirement</span>
                  </div>
                  <div>
                    <span className="text-ivory-400 block text-[11px]">Peak Cash Deficit</span>
                    <span className="text-xl font-bold text-rust-light">{formatINR(simulatedPeakDeficit)}</span>
                    <span className="text-[10px] text-rust block">Overdraft Trigger</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-ivory-400 block text-[11px]">Decision Recommendation</span>
                    <span className="text-sm font-semibold text-ivory">
                      {simulatedPeakDeficit > availableCash
                        ? 'Restructure Payment Terms or Secure ₹3L PO Financing'
                        : 'Manageable with existing credit limits'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-charcoal-300 flex justify-between items-center text-xs font-mono">
                  <span className="text-ivory-400">Want deeper multi-variable simulations?</span>
                  <Link
                    href="/scenarios"
                    className="text-amber hover:text-amber-light font-bold flex items-center gap-1 underline underline-offset-4"
                  >
                    <span>Open Scenario Laboratory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FINAL CTA
          ========================================================================= */}
      <section className="py-24 bg-ivory-100 text-charcoal border-b border-border-light text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-rust font-semibold">
            The Pre-Order Imperative
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-charcoal font-normal">
            Don't let growth become a financial blind spot.
          </h2>
          <p className="text-base sm:text-lg text-charcoal-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Evaluate your pending purchase orders with deterministic financial intelligence before
            deploying your shop floor and capital.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/opportunities"
              className="px-8 py-4 bg-charcoal hover:bg-charcoal-600 text-ivory text-sm font-mono tracking-wider uppercase transition-all flex items-center gap-3 shadow-xl"
            >
              <span>Start Evaluating Opportunities</span>
              <ArrowRight className="w-4 h-4 text-amber" />
            </Link>
            <Link
              href="/workspace"
              className="px-8 py-4 bg-ivory hover:bg-ivory-200 text-charcoal text-sm font-mono tracking-wider uppercase transition-colors border border-border-light"
            >
              <span>Explore Demo Workspace</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: FOOTER
          ========================================================================= */}
      <footer className="bg-charcoal text-ivory py-16 px-4 sm:px-6 lg:px-8 border-t border-charcoal-400 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl text-ivory font-normal">DYNAFIN</span>
              <span className="font-mono text-[10px] text-sage uppercase tracking-widest border border-sage/40 px-2 py-0.5">
                Opportunity IQ
              </span>
            </div>
            <p className="text-xs font-mono text-sage-light uppercase tracking-wider">
              "Don't just survive growth. Understand it. Prepare for it. Pursue it."
            </p>
            <p className="text-xs text-ivory-400 leading-relaxed max-w-md">
              DYNAFIN is an AI-powered financial decision-support platform designed for Indian
              Micro, Small and Medium Enterprises (MSMEs). Developed for Arthaton 2026.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <div className="text-sage uppercase font-bold text-[11px] tracking-widest">Modules</div>
            <ul className="space-y-2 text-ivory-300">
              <li><Link href="/workspace" className="hover:text-ivory">Workspace</Link></li>
              <li><Link href="/opportunities" className="hover:text-ivory">Opportunity Studio</Link></li>
              <li><Link href="/cash-flow" className="hover:text-ivory">Cash Flow IQ</Link></li>
              <li><Link href="/scenarios" className="hover:text-ivory">Scenario Lab</Link></li>
              <li><Link href="/risk" className="hover:text-ivory">Risk Assessment</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <div className="text-sage uppercase font-bold text-[11px] tracking-widest">Intelligence</div>
            <ul className="space-y-2 text-ivory-300">
              <li><Link href="/buyers" className="hover:text-ivory">Buyer Behavior</Link></li>
              <li><Link href="/funding" className="hover:text-ivory">Funding Navigator</Link></li>
              <li><Link href="/loan-readiness" className="hover:text-ivory">Loan Readiness</Link></li>
              <li><Link href="/assistant" className="hover:text-ivory">AI Assistant</Link></li>
              <li><Link href="/reports" className="hover:text-ivory">Report Centre</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <div className="text-sage uppercase font-bold text-[11px] tracking-widest">Notice & Disclaimer</div>
            <p className="text-[11px] text-ivory-400 leading-relaxed">
              DYNAFIN is a financial decision-support system, not a lending institution, bank,
              or credit rating agency. All simulations and risk indicators are decision-support aids
              based on business inputs and deterministic accounting models.
            </p>
            <div className="text-[10px] text-charcoal-300 pt-2">
              © 2026 DYNAFIN • Arthaton 2026. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
