'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR } from '@/lib/formatting/currency';
import { calculateEmi } from '@/lib/calculations/financial';
import { LoanComparisonInput } from '@/types';
import {
  Scale,
  Coins,
  ArrowRight,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function LoanComparisonPage() {
  const { activeOpportunity } = useWorkspace();

  // Facility 1: MUDRA Tarun / PSU Bank Working Capital
  const [facility1, setFacility1] = useState<LoanComparisonInput & { name: string; provider: string; type: string }>({
    name: 'Option A: MUDRA Tarun Working Capital Facility',
    provider: 'State Bank of India / Canara Bank',
    type: 'Working Capital Term Loan',
    loanAmount: 1000000, // ₹10,00,000
    interestRateAnnualPct: 9.5, // 9.5% p.a.
    tenureMonths: 36, // 3 Years
    processingFeePct: 0.5, // 0.5%
    collateralType: 'Nil (CGFMU Cover)',
  });

  // Facility 2: Purchase Order Financing
  const [facility2, setFacility2] = useState<LoanComparisonInput & { name: string; provider: string; type: string }>({
    name: 'Option B: Purchase Order Backed Revolving Credit',
    provider: 'MSME Partner NBFC / Fintech',
    type: 'PO Financing (Bullet Repayment)',
    loanAmount: 1000000, // ₹10,00,000
    interestRateAnnualPct: 12.5, // 12.5% p.a.
    tenureMonths: 6, // 6 Months (Linked to PO delivery & settlement)
    processingFeePct: 1.5, // 1.5%
    collateralType: 'Hypothecation of Goods & PO Escrow',
  });

  const output1 = calculateEmi(facility1);
  const output2 = calculateEmi(facility2);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-dark font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-dark" />
              <span>Financing Amortization & Cost Comparison</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Loan & Facility Comparison
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Side-by-side deterministic cost of credit comparison. Evaluate monthly EMI burdens,
              processing deductions, and total interest outgo before executing loan agreements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/funding"
              className="px-5 py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-md"
            >
              <span>Explore Official Schemes</span>
              <ArrowRight className="w-4 h-4 text-amber" />
            </Link>
          </div>
        </div>

        {/* Working Capital Context Pill */}
        {activeOpportunity && (
          <div className="p-4 bg-ivory-100 border border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <span>
              Target Opportunity Working Capital Gap:{' '}
              <strong className="text-rust font-bold">
                {formatINR(activeOpportunity.costs.workingCapitalGap)}
              </strong>{' '}
              ({activeOpportunity.title})
            </span>
            <button
              onClick={() => {
                setFacility1((prev) => ({ ...prev, loanAmount: activeOpportunity.costs.workingCapitalGap }));
                setFacility2((prev) => ({ ...prev, loanAmount: activeOpportunity.costs.workingCapitalGap }));
              }}
              className="text-rust hover:underline font-semibold"
            >
              Match Loan Amounts to Gap ({formatINR(activeOpportunity.costs.workingCapitalGap)}) →
            </button>
          </div>
        )}

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* FACILITY 1 */}
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-light pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-sage-dark font-semibold block">
                Option A • Bank Facility
              </span>
              <h2 className="font-serif text-2xl text-charcoal mt-0.5">
                {facility1.name}
              </h2>
              <span className="text-xs font-mono text-charcoal-400 block mt-1">
                Provider: {facility1.provider}
              </span>
            </div>

            {/* Editable Controls */}
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-charcoal-400 uppercase text-[11px] mb-1">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={facility1.loanAmount}
                  onChange={(e) => setFacility1({ ...facility1, loanAmount: Number(e.target.value) })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-charcoal-400 uppercase text-[11px] mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.25"
                  value={facility1.interestRateAnnualPct}
                  onChange={(e) => setFacility1({ ...facility1, interestRateAnnualPct: Number(e.target.value) })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-charcoal-400 uppercase text-[11px] mb-1">Tenure (Months)</label>
                <input
                  type="number"
                  value={facility1.tenureMonths}
                  onChange={(e) => setFacility1({ ...facility1, tenureMonths: Number(e.target.value) })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-charcoal-400 uppercase text-[11px] mb-1">Processing Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={facility1.processingFeePct}
                  onChange={(e) => setFacility1({ ...facility1, processingFeePct: Number(e.target.value) })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Results */}
            <div className="p-5 bg-charcoal text-ivory border border-charcoal-300 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-baseline border-b border-charcoal-400 pb-3">
                <span className="text-sage-light uppercase text-[11px]">Monthly EMI Debit</span>
                <span className="text-2xl font-bold font-mono text-ivory">
                  {formatINR(output1.monthlyEmi)}/mo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-ivory-400 block">Total Interest Outgo:</span>
                  <span className="font-bold text-amber">{formatINR(output1.totalInterest)}</span>
                </div>
                <div>
                  <span className="text-ivory-400 block">Upfront Processing Fee:</span>
                  <span className="font-bold text-ivory">{formatINR(output1.processingFeeAmount)}</span>
                </div>
                <div>
                  <span className="text-ivory-400 block">Total Repayment:</span>
                  <span className="font-bold text-ivory">{formatINR(output1.totalRepayment)}</span>
                </div>
                <div>
                  <span className="text-ivory-400 block">Effective APR:</span>
                  <span className="font-bold text-sage-light">{output1.aprEffectivePct}%</span>
                </div>
              </div>

              <div className="text-[10px] text-ivory-400 pt-2 border-t border-charcoal-400">
                Collateral Requirement: {facility1.collateralType}
              </div>
            </div>
          </div>

          {/* FACILITY 2 */}
          <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
            <div className="border-b border-border-light pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-rust font-semibold block">
                Option B • Specialist Credit
              </span>
              <h2 className="font-serif text-2xl text-charcoal mt-0.5">
                {facility2.name}
              </h2>
              <span className="text-xs font-mono text-charcoal-400 block mt-1">
                Provider: {facility2.provider}
              </span>
            </div>

            {/* Editable Controls */}
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-charcoal-400 uppercase text-[11px] mb-1">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={facility2.loanAmount}
                  onChange={(e) => setFacility2({ ...facility2, loanAmount: Number(e.target.value) })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-charcoal-400 uppercase text-[11px] mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.25"
                  value={facility2.interestRateAnnualPct}
                  onChange={(e) => setFacility2({ ...facility2, interestRateAnnualPct: Number(e.target.value) })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-charcoal-400 uppercase text-[11px] mb-1">Tenure (Months)</label>
                <input
                  type="number"
                  value={facility2.tenureMonths}
                  onChange={(e) => setFacility2({ ...facility2, tenureMonths: Number(e.target.value) })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-charcoal-400 uppercase text-[11px] mb-1">Processing Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={facility2.processingFeePct}
                  onChange={(e) => setFacility2({ ...facility2, processingFeePct: Number(e.target.value) })}
                  className="w-full p-2 bg-ivory-50 border border-border-light focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Results */}
            <div className="p-5 bg-charcoal text-ivory border border-charcoal-300 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-baseline border-b border-charcoal-400 pb-3">
                <span className="text-sage-light uppercase text-[11px]">Monthly Equated Outgo</span>
                <span className="text-2xl font-bold font-mono text-ivory">
                  {formatINR(output2.monthlyEmi)}/mo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-ivory-400 block">Total Interest Outgo:</span>
                  <span className="font-bold text-amber">{formatINR(output2.totalInterest)}</span>
                </div>
                <div>
                  <span className="text-ivory-400 block">Upfront Processing Fee:</span>
                  <span className="font-bold text-ivory">{formatINR(output2.processingFeeAmount)}</span>
                </div>
                <div>
                  <span className="text-ivory-400 block">Total Repayment:</span>
                  <span className="font-bold text-ivory">{formatINR(output2.totalRepayment)}</span>
                </div>
                <div>
                  <span className="text-ivory-400 block">Effective APR:</span>
                  <span className="font-bold text-sage-light">{output2.aprEffectivePct}%</span>
                </div>
              </div>

              <div className="text-[10px] text-ivory-400 pt-2 border-t border-charcoal-400">
                Collateral Requirement: {facility2.collateralType}
              </div>
            </div>
          </div>

        </div>

        {/* Strategic Comparison Summary */}
        <div className="p-6 bg-ivory border border-border-light shadow-sm space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-charcoal font-semibold text-sm">
            <Info className="w-4 h-4 text-rust" />
            <span>Analytical Decision Summary</span>
          </div>
          <p className="text-xs font-sans text-charcoal-400 leading-relaxed max-w-3xl">
            Option A carries a lower annualized rate ({facility1.interestRateAnnualPct}%), but locks the business into a {facility1.tenureMonths}-month commitment with {formatINR(output1.totalInterest)} in total interest.
            Option B carries a higher headline rate ({facility2.interestRateAnnualPct}%), but matches the order lifecycle ({facility2.tenureMonths} months), resulting in lower total interest outgo ({formatINR(output2.totalInterest)}) and immediate settlement upon buyer payment.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
