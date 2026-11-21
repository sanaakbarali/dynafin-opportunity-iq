'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR, formatIndianDate } from '@/lib/formatting/currency';
import {
  ArrowUpRight,
  Building2,
  Coins,
  Factory,
  ShieldAlert,
  Sliders,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Compass,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';

export default function WorkspacePage() {
  const {
    business,
    financials,
    operations,
    opportunities,
    activeOpportunity,
    notifications,
    switchDemoBusiness,
    activeDemoId,
  } = useWorkspace();

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Editorial Top Heading */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rust font-semibold">
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>Executive Financial Workspace</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              {business.businessName}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              {business.industry} • {business.locationCity}, {business.locationState} • Est. {business.establishedYear} • {business.employeeCount} Employees
              {business.udyamRegNumber && <span className="font-mono text-[11px] block text-charcoal-300 mt-0.5">Udyam: {business.udyamRegNumber}</span>}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/opportunities/new"
              className="px-5 py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 text-amber" />
              <span>Evaluate New Order</span>
            </Link>
            <Link
              href="/reports"
              className="px-4 py-3 bg-ivory-200 hover:bg-ivory-300 text-charcoal text-xs font-mono uppercase tracking-wider font-semibold transition-colors border border-border-light flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-charcoal-400" />
              <span>Executive Report</span>
            </Link>
          </div>
        </div>

        {/* Demo Business Switcher Banner */}
        <div className="bg-ivory-100 p-4 border border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-charcoal">
            <Building2 className="w-4 h-4 text-rust" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Explore Illustrative MSME Profile:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'sri-textiles', name: 'Sri Textiles (Madurai)', sub: 'Textiles' },
              { id: 'kovai-precision', name: 'Kovai Precision (Coimbatore)', sub: 'Light Engg' },
              { id: 'trichy-foods', name: 'Trichy Foods (Trichy)', sub: 'Agro Oils' },
            ].map((biz) => (
              <button
                key={biz.id}
                onClick={() => switchDemoBusiness(biz.id)}
                className={`px-3 py-1.5 border transition-all ${
                  activeDemoId === biz.id || (biz.id === 'sri-textiles' && activeDemoId === 'sana-textiles')
                    ? 'bg-charcoal text-ivory border-charcoal font-bold'
                    : 'bg-ivory hover:bg-ivory-200 text-charcoal-400 border-border-light'
                }`}
              >
                <span>{biz.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Operational & Financial Baseline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          {/* Card 1: Available Liquid Cash */}
          <div className="p-6 bg-charcoal text-ivory border border-charcoal-300 shadow-md space-y-2">
            <span className="text-sage-light uppercase tracking-wider text-[11px] block">
              Available Liquid Buffer
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-ivory">
              {formatINR(financials.availableCash)}
            </div>
            <p className="text-[11px] text-ivory-400 font-sans leading-relaxed pt-1">
              Unencumbered bank balance available to fund upfront supplier advances.
            </p>
          </div>

          {/* Card 2: Debt Service Burden */}
          <div className="p-6 bg-ivory border border-border-light shadow-sm space-y-2">
            <span className="text-rust uppercase tracking-wider text-[11px] block font-semibold">
              Monthly Debt Burden (EMI)
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-charcoal">
              {formatINR(financials.monthlyEmiObligations)}
            </div>
            <p className="text-[11px] text-charcoal-400 font-sans leading-relaxed pt-1">
              Outstanding debt: {formatINR(financials.existingLoanOutstanding)}. Priority debits on 5th of each month.
            </p>
          </div>

          {/* Card 3: Shop Floor Capacity */}
          <div className="p-6 bg-ivory border border-border-light shadow-sm space-y-2">
            <span className="text-charcoal-300 uppercase tracking-wider text-[11px] block">
              Shop Floor Load
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-charcoal">
              {operations.currentCapacityUtilisationPct}%
            </div>
            <p className="text-[11px] text-charcoal-400 font-sans leading-relaxed pt-1">
              Headroom available: {(100 - operations.currentCapacityUtilisationPct).toFixed(1)}% ({operations.monthlyCapacityUnits} units/mo).
            </p>
          </div>

          {/* Card 4: Working Capital Exposure */}
          <div className="p-6 bg-ivory border border-border-light shadow-sm space-y-2">
            <span className="text-charcoal-300 uppercase tracking-wider text-[11px] block">
              Receivables vs Payables
            </span>
            <div className="text-lg font-bold font-mono text-charcoal">
              {formatINR(financials.accountsReceivable)} / {formatINR(financials.accountsPayable)}
            </div>
            <p className="text-[11px] text-charcoal-400 font-sans leading-relaxed pt-1">
              Net working capital gap: {formatINR(Math.abs(financials.accountsReceivable - financials.accountsPayable))}.
            </p>
          </div>
        </div>

        {/* Active Pre-Order Evaluation Feature Section */}
        {activeOpportunity && (
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-rust font-semibold block">
                  Pending Pre-Commitment Opportunity
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mt-1">
                  {activeOpportunity.title}
                </h2>
                <div className="text-xs font-mono text-charcoal-400 mt-1 flex flex-wrap gap-4">
                  <span>Buyer: <strong className="text-charcoal">{activeOpportunity.buyerName}</strong></span>
                  <span>Order Value: <strong className="text-charcoal">{formatINR(activeOpportunity.purchaseOrder.totalOrderValue)}</strong></span>
                  <span>Delivery: <strong className="text-charcoal">{formatIndianDate(activeOpportunity.purchaseOrder.deliveryDeadline)}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/opportunities"
                  className="px-4 py-2.5 bg-charcoal text-ivory hover:bg-charcoal-600 font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Opportunity Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/scenarios"
                  className="px-4 py-2.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal border border-border-light font-mono text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  <span>Simulate Delay</span>
                </Link>
              </div>
            </div>

            {/* Asymmetric 3-Column Decision Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="p-4 bg-ivory-100 border border-border-light space-y-2">
                <span className="text-charcoal-400 block uppercase text-[11px]">1. Order Economics</span>
                <div className="text-base font-bold text-charcoal">
                  Gross Contribution: {formatINR(activeOpportunity.costs.grossContribution)}
                </div>
                <div className="text-sage-dark font-semibold">
                  {activeOpportunity.costs.contributionMarginPct}% Margin
                </div>
                <p className="text-[11px] font-sans text-charcoal-400">
                  Total direct cost to fulfill: {formatINR(activeOpportunity.costs.totalDirectCost)}.
                </p>
              </div>

              <div className="p-4 bg-rust/10 border border-rust/40 space-y-2 text-charcoal">
                <span className="text-rust block uppercase text-[11px] font-bold">2. Peak Cash Deficit</span>
                <div className="text-base font-bold text-rust">
                  Deficit: {formatINR(activeOpportunity.costs.workingCapitalGap)}
                </div>
                <div className="text-rust text-[11px]">
                  Requires Bridge Capital before Day 10
                </div>
                <p className="text-[11px] font-sans text-charcoal-400">
                  Advance received ({activeOpportunity.purchaseOrder.advancePercentage}%) is insufficient for raw materials.
                </p>
              </div>

              <div className="p-4 bg-ivory-100 border border-border-light space-y-2">
                <span className="text-charcoal-400 block uppercase text-[11px]">3. Decision Recommendation</span>
                <div className="text-base font-bold text-charcoal">
                  {activeOpportunity.riskAssessment.decisionRecommendation}
                </div>
                <div className="text-amber-dark font-semibold">
                  Overall Risk: {activeOpportunity.riskAssessment.overallRating}
                </div>
                <p className="text-[11px] font-sans text-charcoal-400">
                  Negotiate 25% advance or apply for verified CGTMSE / PO financing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Decision Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <Link
            href="/cash-flow"
            className="p-5 bg-ivory border border-border-light hover:border-charcoal transition-all group space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-mono uppercase text-rust">
              <span>Cash Flow IQ</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="font-serif text-xl text-charcoal">Interactive Cash Timeline</div>
            <p className="text-xs text-charcoal-400 font-sans leading-relaxed">
              Model day-by-day opening cash, incoming customer receivables, vendor outlays, and closing balances.
            </p>
          </Link>

          <Link
            href="/buyers"
            className="p-5 bg-ivory border border-border-light hover:border-charcoal transition-all group space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-mono uppercase text-amber-dark">
              <span>Buyer Behavior</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="font-serif text-xl text-charcoal">Empirical Payment Delays</div>
            <p className="text-xs text-charcoal-400 font-sans leading-relaxed">
              Verify historical payment discipline from actual customer invoice records rather than credit assumptions.
            </p>
          </Link>

          <Link
            href="/scenarios"
            className="p-5 bg-ivory border border-border-light hover:border-charcoal transition-all group space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-mono uppercase text-charcoal">
              <span>Scenario Lab</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="font-serif text-xl text-charcoal">What-If Stress Testing</div>
            <p className="text-xs text-charcoal-400 font-sans leading-relaxed">
              Test 30, 60, and 90-day buyer payment delays, raw material inflation, and supplier bottlenecks.
            </p>
          </Link>

          <Link
            href="/funding"
            className="p-5 bg-ivory border border-border-light hover:border-charcoal transition-all group space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-mono uppercase text-sage-dark">
              <span>Funding Navigator</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="font-serif text-xl text-charcoal">MSME Schemes & PO Credit</div>
            <p className="text-xs text-charcoal-400 font-sans leading-relaxed">
              Explore CGTMSE collateral-free limits, MUDRA Tarun loans, and TReDS invoice factoring.
            </p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
