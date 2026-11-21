'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR, formatIndianDate } from '@/lib/formatting/currency';
import {
  ArrowUpRight,
  Plus,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Coins,
  ShieldAlert,
  Sliders,
  FileText,
  Calendar,
  Building2,
  Package,
  Layers,
  ChevronRight,
  HelpCircle,
  Trash2,
  Loader2,
} from 'lucide-react';

export default function OpportunityStudioPage() {
  const {
    activeOpportunity,
    opportunities,
    setActiveOpportunityId,
    business,
    financials,
    updateOpportunity,
    deleteOpportunity,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'economics' | 'po_details' | 'items'>('economics');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (!activeOpportunity) {
    return (
      <AppLayout>
        <div className="text-center py-20 space-y-4 font-mono">
          <p className="text-charcoal-400">No active opportunities found in this workspace.</p>
          <Link
            href="/opportunities/new"
            className="px-4 py-2 bg-charcoal text-ivory text-xs uppercase"
          >
            Create New Opportunity
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { purchaseOrder, costs, riskAssessment, operationalImpact } = activeOpportunity;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Editorial Header & Opportunity Context Bar */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rust font-semibold">
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>Core Decision Intelligence • Pre-Order Evaluation</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Opportunity Studio
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Evaluating purchase order economics, upfront liquidity burdens, and shop floor feasibility
              before contractual commitment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/opportunities/new"
              className="px-5 py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 text-amber" />
              <span>Evaluate New PO</span>
            </Link>
            <Link
              href="/scenarios"
              className="px-4 py-3 bg-ivory-200 hover:bg-ivory-300 text-charcoal text-xs font-mono uppercase tracking-wider font-semibold transition-colors border border-border-light flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4 text-charcoal-400" />
              <span>Stress-Test in Lab</span>
            </Link>
          </div>
        </div>

        {/* Opportunity Switcher Bar */}
        <div className="bg-ivory-100 p-3 border border-border-light flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-charcoal-400 uppercase text-[11px]">Active PO:</span>
            <select
              value={activeOpportunity.id}
              onChange={(e) => setActiveOpportunityId(e.target.value)}
              className="bg-ivory font-semibold text-charcoal p-1.5 border border-border-light focus:outline-none"
            >
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.purchaseOrder.poNumber} — {opp.buyerName} ({formatINR(opp.purchaseOrder.totalOrderValue)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-charcoal-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="uppercase text-[11px]">Status:</span>
              <select
                value={activeOpportunity.status}
                disabled={isUpdatingStatus}
                onChange={async (e) => {
                  setIsUpdatingStatus(true);
                  try {
                    await updateOpportunity(activeOpportunity.id, {
                      status: e.target.value as any,
                    });
                  } finally {
                    setIsUpdatingStatus(false);
                  }
                }}
                className="bg-ivory font-mono uppercase text-xs font-semibold text-charcoal px-2 py-1 border border-border-light focus:outline-none"
              >
                <option value="Evaluating">Evaluating</option>
                <option value="Accepted">Accepted</option>
                <option value="Negotiating">Negotiating</option>
                <option value="Passed">Passed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <span>Decision: <strong className="text-rust font-mono">{riskAssessment.decisionRecommendation}</strong></span>

            <button
              onClick={() => setShowDeleteModal(true)}
              title="Delete this opportunity"
              className="p-1.5 text-charcoal-400 hover:text-rust transition-colors flex items-center gap-1 border border-border-light hover:border-rust/40 bg-ivory"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-mono">Delete</span>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-ivory border border-border-light shadow-2xl max-w-md w-full p-6 space-y-4 font-mono">
              <div className="flex items-center gap-2 text-rust text-sm font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5" />
                <span>Confirm Opportunity Deletion</span>
              </div>
              <p className="text-xs text-charcoal-400 leading-relaxed font-sans">
                Are you sure you want to delete purchase order <strong className="font-mono text-charcoal">{purchaseOrder.poNumber}</strong> from <strong className="font-mono text-charcoal">{purchaseOrder.buyerName}</strong>? This will permanently remove its financial evaluations, cash milestones, and risk reports.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-border-light text-charcoal text-xs uppercase hover:bg-ivory-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      await deleteOpportunity(activeOpportunity.id);
                      setShowDeleteModal(false);
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-rust hover:bg-rust-dark text-ivory text-xs uppercase font-semibold transition-colors flex items-center gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Permanently</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Primary Decision Banner (Key Takeaways) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Financial Metrics Snapshot */}
          <div className="lg:col-span-8 bg-charcoal text-ivory p-6 sm:p-8 border border-charcoal-300 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-400 pb-4">
              <div>
                <span className="text-[11px] font-mono text-sage-light uppercase tracking-wider block">
                  Buyer & Order Reference
                </span>
                <span className="font-serif text-2xl text-ivory">
                  {purchaseOrder.buyerName}
                </span>
                <span className="text-xs font-mono text-ivory-300 block mt-0.5">
                  {purchaseOrder.poNumber} • Delivery by {formatIndianDate(purchaseOrder.deliveryDeadline)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-sage-light uppercase tracking-wider block">
                  Contract Order Value
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-ivory">
                  {formatINR(purchaseOrder.totalOrderValue)}
                </span>
              </div>
            </div>

            {/* 4 Core Deterministic Decision Figures */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3 bg-charcoal-400 border border-charcoal-300">
                <span className="text-sage-light block text-[11px]">Total Direct Cost</span>
                <span className="text-lg font-bold text-ivory">{formatINR(costs.totalDirectCost)}</span>
                <span className="text-[10px] text-ivory-400 block mt-0.5">Raw materials, labour & freight</span>
              </div>

              <div className="p-3 bg-charcoal-400 border border-charcoal-300">
                <span className="text-sage-light block text-[11px]">Gross Contribution</span>
                <span className="text-lg font-bold text-amber">{formatINR(costs.grossContribution)}</span>
                <span className="text-[10px] text-amber-light block mt-0.5">
                  {costs.contributionMarginPct}% Margin
                </span>
              </div>

              <div className="p-3 bg-charcoal-400 border border-charcoal-300">
                <span className="text-sage-light block text-[11px]">Upfront Cash Needed</span>
                <span className="text-lg font-bold text-rust-light">{formatINR(costs.upfrontCashRequired)}</span>
                <span className="text-[10px] text-ivory-400 block mt-0.5">Required before Day 10</span>
              </div>

              <div className="p-3 bg-charcoal-400 border border-charcoal-300">
                <span className="text-sage-light block text-[11px]">Working Capital Gap</span>
                <span className="text-lg font-bold text-rust-light">{formatINR(costs.workingCapitalGap)}</span>
                <span className="text-[10px] text-rust block mt-0.5">Unfunded deficit</span>
              </div>
            </div>

            {/* Critical Liquidity Warning Banner */}
            <div className="p-4 bg-rust/20 border border-rust/50 text-xs text-ivory-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rust-light flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-mono font-semibold text-rust-light uppercase tracking-wider text-[11px]">
                  Liquidity Warning: Contribution ≠ Immediate Available Cash
                </div>
                <p className="text-[11px] leading-relaxed text-ivory-300">
                  This order delivers an estimated <strong className="text-ivory">{formatINR(costs.grossContribution)} gross contribution</strong>.
                  However, customer advances only cover <strong className="text-ivory">{formatINR(purchaseOrder.advanceAmount)} (15%)</strong>.
                  With available liquid cash at {formatINR(financials.availableCash)}, you face an unfunded peak working capital gap of{' '}
                  <strong className="text-rust-light font-mono">{formatINR(costs.workingCapitalGap)}</strong> during manufacturing.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Operational Load & Feasibility */}
          <div className="lg:col-span-4 bg-ivory border border-border-light shadow-md p-6 sm:p-7 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-light text-xs font-mono">
                <span className="text-charcoal uppercase font-semibold">Shop Floor Impact</span>
                <span className="text-sage-dark font-mono">{operationalImpact.leadTimeFeasibility}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-charcoal-400">Total Factory Capacity:</span>
                  <span className="font-semibold text-charcoal">{financials.availableCash > 0 ? '3,500' : '—'} units/mo</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-charcoal-400">Baseline Plant Utilisation:</span>
                  <span className="font-semibold text-charcoal">72.0%</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-charcoal-400">This Order Utilisation:</span>
                  <span className="font-semibold text-rust">+{operationalImpact.capacityIncreasePct}%</span>
                </div>

                {/* Utilisation Bar */}
                <div className="pt-2">
                  <div className="w-full bg-ivory-200 h-3 border border-border-light flex overflow-hidden">
                    <div className="bg-charcoal w-[72%]" title="Baseline Load" />
                    <div className="bg-amber w-[24%]" title="Order Load" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-charcoal-400 mt-1">
                    <span>Baseline: 72%</span>
                    <span className="font-bold text-charcoal">Peak: 96.3%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-ivory-100 border border-border-light text-xs font-mono text-charcoal-400 space-y-1">
                <div className="text-charcoal font-semibold">Deadline Feasibility:</div>
                <p className="text-[11px] leading-relaxed">
                  24 calendar days to deliver {purchaseOrder.items.reduce((s, i) => s + i.quantity, 0).toLocaleString('en-IN')} units.
                  Zero downtime allowance. Overtime wages or second shift needed.
                </p>
              </div>
            </div>

            <Link
              href="/cash-flow"
              className="w-full py-2.5 bg-charcoal text-ivory hover:bg-charcoal-600 text-xs font-mono uppercase tracking-wider text-center block transition-colors font-semibold"
            >
              Inspect Cash Flow Timeline →
            </Link>
          </div>
        </div>

        {/* Detailed Financial & Contract Breakdown Tabs */}
        <div className="space-y-4">
          <div className="flex border-b border-border-light font-mono text-xs">
            <button
              onClick={() => setActiveTab('economics')}
              className={`px-5 py-2.5 border-b-2 uppercase tracking-wider transition-colors ${
                activeTab === 'economics'
                  ? 'border-charcoal text-charcoal font-bold'
                  : 'border-transparent text-charcoal-400 hover:text-charcoal'
              }`}
            >
              Direct Cost Breakdown & Economics
            </button>
            <button
              onClick={() => setActiveTab('po_details')}
              className={`px-5 py-2.5 border-b-2 uppercase tracking-wider transition-colors ${
                activeTab === 'po_details'
                  ? 'border-charcoal text-charcoal font-bold'
                  : 'border-transparent text-charcoal-400 hover:text-charcoal'
              }`}
            >
              Contract Terms & Extraction Status
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`px-5 py-2.5 border-b-2 uppercase tracking-wider transition-colors ${
                activeTab === 'items'
                  ? 'border-charcoal text-charcoal font-bold'
                  : 'border-transparent text-charcoal-400 hover:text-charcoal'
              }`}
            >
              Line Items ({purchaseOrder.items.length})
            </button>
          </div>

          {/* TAB 1: ECONOMICS & WATERFALL BREAKDOWN */}
          {activeTab === 'economics' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-ivory p-6 sm:p-8 border border-border-light shadow-sm">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-charcoal">
                    Opportunity Direct Cost Analysis
                  </h3>
                  <p className="text-xs text-charcoal-400 font-sans mt-0.5">
                    Itemized direct costs required to complete this order. Unlike accounting overheads,
                    these require immediate cash outflows.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-ivory-100 border border-border-light">
                    <div>
                      <span className="font-semibold text-charcoal">1. Raw Materials & Yarn</span>
                      <span className="text-[10px] text-charcoal-400 block">Cotton yarn 40s/60s count from Meenakshi Spinning</span>
                    </div>
                    <span className="font-bold text-charcoal">{formatINR(costs.rawMaterialCost)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-ivory-100 border border-border-light">
                    <div>
                      <span className="font-semibold text-charcoal">2. Labour & Weaver Wages</span>
                      <span className="text-[10px] text-charcoal-400 block">Loom operators, dyeing specialists & packaging staff</span>
                    </div>
                    <span className="font-bold text-charcoal">{formatINR(costs.labourCost)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-ivory-100 border border-border-light">
                    <div>
                      <span className="font-semibold text-charcoal">3. Production Consumables & Dyes</span>
                      <span className="text-[10px] text-charcoal-400 block">Azo-free reactive dyes and loom lubricants</span>
                    </div>
                    <span className="font-bold text-charcoal">{formatINR(costs.productionExpenses)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-ivory-100 border border-border-light">
                    <div>
                      <span className="font-semibold text-charcoal">4. Packaging & Poly Wrapping</span>
                      <span className="text-[10px] text-charcoal-400 block">Export corrugated cartons & moisture barriers</span>
                    </div>
                    <span className="font-bold text-charcoal">{formatINR(costs.packagingCost)}</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-ivory-100 border border-border-light">
                    <div>
                      <span className="font-semibold text-charcoal">5. Freight & Delivery Logistics</span>
                      <span className="text-[10px] text-charcoal-400 block">Madurai to MEPZ SEZ Tambaram transport</span>
                    </div>
                    <span className="font-bold text-charcoal">{formatINR(costs.transportationLogistics)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-charcoal text-ivory font-bold">
                    <span>Total Direct Fulfillment Cost</span>
                    <span>{formatINR(costs.totalDirectCost)}</span>
                  </div>
                </div>
              </div>

              {/* Waterfall & Surplus Explanation */}
              <div className="lg:col-span-5 bg-ivory-100 p-6 border border-border-light space-y-5">
                <div className="border-b border-border-light pb-3">
                  <span className="text-xs font-mono uppercase text-rust font-semibold">
                    Contribution vs. Operating Surplus
                  </span>
                  <div className="font-serif text-xl text-charcoal mt-1">
                    Financial Reconciliation
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-charcoal-400">Total Purchase Order:</span>
                    <span className="font-bold text-charcoal">{formatINR(purchaseOrder.totalOrderValue)}</span>
                  </div>
                  <div className="flex justify-between text-rust">
                    <span>Less: Total Direct Costs:</span>
                    <span>-{formatINR(costs.totalDirectCost)}</span>
                  </div>
                  <div className="flex justify-between text-amber-dark font-bold pt-1 border-t border-border-light">
                    <span>Gross Contribution:</span>
                    <span>{formatINR(costs.grossContribution)} (40.0%)</span>
                  </div>
                  <div className="flex justify-between text-charcoal-400">
                    <span>Less: Allocated Monthly Overhead:</span>
                    <span>-{formatINR(costs.allocatedOverheads)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-400">
                    <span>Less: Estimated Financing Charges:</span>
                    <span>-{formatINR(costs.estimatedFinancingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sage-dark font-bold pt-2 border-t border-border-light text-sm">
                    <span>Net Operating Surplus:</span>
                    <span>{formatINR(costs.netOperatingSurplus)}</span>
                  </div>
                </div>

                <div className="p-3 bg-ivory border border-border-light text-[11px] font-sans text-charcoal-400 leading-relaxed">
                  <strong className="text-charcoal">Methodology Note:</strong> Gross contribution
                  is the amount remaining from revenue to cover fixed enterprise overheads and debt service.
                  It must not be confused with free liquid cash.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTRACT TERMS & OCR EXTRACTION */}
          {activeTab === 'po_details' && (
            <div className="bg-ivory p-6 sm:p-8 border border-border-light shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border-light pb-4">
                <div>
                  <h3 className="font-serif text-2xl text-charcoal">
                    Contractual Terms & Extraction Status
                  </h3>
                  <p className="text-xs text-charcoal-400 font-sans">
                    Extracted via OCR from uploaded purchase order document with 94% overall certainty.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-sage/20 text-sage-dark border border-sage font-mono text-xs font-semibold">
                  Verified by User
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-mono text-xs">
                <div className="p-3 bg-ivory-100 border border-border-light">
                  <span className="text-charcoal-400 block text-[11px]">PO Number</span>
                  <span className="font-bold text-charcoal">{purchaseOrder.poNumber}</span>
                  <span className="text-[10px] text-sage-dark block">Confidence: 98%</span>
                </div>

                <div className="p-3 bg-ivory-100 border border-border-light">
                  <span className="text-charcoal-400 block text-[11px]">Order Date</span>
                  <span className="font-bold text-charcoal">{formatIndianDate(purchaseOrder.orderDate)}</span>
                  <span className="text-[10px] text-sage-dark block">Confidence: 96%</span>
                </div>

                <div className="p-3 bg-ivory-100 border border-border-light">
                  <span className="text-charcoal-400 block text-[11px]">Delivery Deadline</span>
                  <span className="font-bold text-charcoal">{formatIndianDate(purchaseOrder.deliveryDeadline)}</span>
                  <span className="text-[10px] text-sage-dark block">Confidence: 92%</span>
                </div>

                <div className="p-3 bg-ivory-100 border border-border-light">
                  <span className="text-charcoal-400 block text-[11px]">Payment Credit Terms</span>
                  <span className="font-bold text-charcoal">{purchaseOrder.paymentTermsDays} Days post-delivery</span>
                  <span className="text-[10px] text-sage-dark block">Confidence: 95%</span>
                </div>

                <div className="p-3 bg-ivory-100 border border-border-light">
                  <span className="text-charcoal-400 block text-[11px]">Advance Payment</span>
                  <span className="font-bold text-charcoal">{formatINR(purchaseOrder.advanceAmount)} ({purchaseOrder.advancePercentage}%)</span>
                  <span className="text-[10px] text-sage-dark block">Confidence: 89%</span>
                </div>

                <div className="p-3 bg-ivory-100 border border-border-light">
                  <span className="text-charcoal-400 block text-[11px]">Delivery Location</span>
                  <span className="font-semibold text-charcoal">{purchaseOrder.deliveryLocation}</span>
                </div>
              </div>

              {purchaseOrder.penaltyClauseText && (
                <div className="p-4 bg-rust/10 border border-rust/30 text-xs font-mono space-y-1">
                  <div className="text-rust-dark font-bold uppercase text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rust" />
                    <span>Contractual Penalty Clause Detected</span>
                  </div>
                  <p className="text-charcoal-400 text-[11px] leading-relaxed">
                    "{purchaseOrder.penaltyClauseText}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LINE ITEMS */}
          {activeTab === 'items' && (
            <div className="bg-ivory border border-border-light shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-charcoal text-ivory border-b border-charcoal-400 uppercase text-[11px]">
                  <tr>
                    <th className="p-3.5">#</th>
                    <th className="p-3.5">Product Description</th>
                    <th className="p-3.5 text-right">Quantity</th>
                    <th className="p-3.5 text-right">Unit Price</th>
                    <th className="p-3.5 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {purchaseOrder.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-ivory-100">
                      <td className="p-3.5 text-charcoal-400">{idx + 1}</td>
                      <td className="p-3.5 font-medium text-charcoal">{item.description}</td>
                      <td className="p-3.5 text-right">{item.quantity.toLocaleString('en-IN')} {item.unit}</td>
                      <td className="p-3.5 text-right">{formatINR(item.unitPrice)}</td>
                      <td className="p-3.5 text-right font-bold text-charcoal">{formatINR(item.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-ivory-200 border-t-2 border-charcoal font-bold">
                  <tr>
                    <td colSpan={4} className="p-3.5 text-right uppercase">Total Contract Value</td>
                    <td className="p-3.5 text-right text-sm text-charcoal">{formatINR(purchaseOrder.totalOrderValue)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
