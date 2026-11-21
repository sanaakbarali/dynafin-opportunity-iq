'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR, formatIndianDate } from '@/lib/formatting/currency';
import { simulateScenario } from '@/lib/calculations/financial';
import { ScenarioSimulationInputs, ScenarioSimulationResult } from '@/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  Sliders,
  RotateCcw,
  Save,
  Scale,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Clock,
  Coins,
  ChevronRight,
  ArrowRight,
  BookmarkCheck,
} from 'lucide-react';

export default function ScenarioLaboratoryPage() {
  const { activeOpportunity, financials, user, isDemoMode } = useWorkspace();

  // Active Simulation Sliders
  const [inputs, setInputs] = useState<ScenarioSimulationInputs>({
    buyerPaymentDelayDays: 30,
    materialCostInflationPct: 0,
    productionCostIncreasePct: 0,
    advanceReceivedPct: activeOpportunity?.purchaseOrder.advancePercentage || 15,
    deliveryDelayDays: 0,
    orderValueAdjustmentPct: 0,
  });

  const [savedScenarios, setSavedScenarios] = useState<ScenarioSimulationResult[]>([]);
  const [showSavedComparison, setShowSavedComparison] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isSavingScenario, setIsSavingScenario] = useState(false);

  if (!activeOpportunity) {
    return (
      <AppLayout>
        <div className="text-center py-20 font-mono text-xs">
          Please select an active opportunity to simulate scenarios.
        </div>
      </AppLayout>
    );
  }

  const { purchaseOrder, costs } = activeOpportunity;

  // Run Baseline (Original Unmodified PO)
  const baselineResult: ScenarioSimulationResult = useMemo(() => {
    return simulateScenario({
      scenarioName: 'Contract Baseline',
      inputs: {
        buyerPaymentDelayDays: 0,
        materialCostInflationPct: 0,
        productionCostIncreasePct: 0,
        advanceReceivedPct: purchaseOrder.advancePercentage,
        deliveryDelayDays: 0,
        orderValueAdjustmentPct: 0,
      },
      baseOrderValue: purchaseOrder.totalOrderValue,
      baseDeliveryDays: 30,
      baseOrderDate: purchaseOrder.orderDate,
      baseDeliveryDeadline: purchaseOrder.deliveryDeadline,
      baseCosts: costs,
      baselineCash: financials.availableCash,
      monthlyEmi: financials.monthlyEmiObligations,
      monthlyFixedOverhead: financials.monthlyFixedOverheads,
    });
  }, [purchaseOrder, costs, financials]);

  // Run Current Active What-If Simulation
  const simulatedResult: ScenarioSimulationResult = useMemo(() => {
    return simulateScenario({
      scenarioName: 'Active What-If Simulation',
      inputs,
      baseOrderValue: purchaseOrder.totalOrderValue,
      baseDeliveryDays: 30,
      baseOrderDate: purchaseOrder.orderDate,
      baseDeliveryDeadline: purchaseOrder.deliveryDeadline,
      baseCosts: costs,
      baselineCash: financials.availableCash,
      monthlyEmi: financials.monthlyEmiObligations,
      monthlyFixedOverhead: financials.monthlyFixedOverheads,
    });
  }, [purchaseOrder, costs, financials, inputs]);

  // Presets from Section 16
  const applyPreset = (presetName: string, presetInputs: Partial<ScenarioSimulationInputs>) => {
    setInputs((prev) => ({
      ...prev,
      ...presetInputs,
    }));
  };

  // Hydrate saved scenarios from Supabase if authenticated
  useEffect(() => {
    if (user && !isDemoMode && activeOpportunity?.id && !activeOpportunity.id.startsWith('opp-sri-') && !activeOpportunity.id.startsWith('opp-sana-')) {
      const fetchScenarios = async () => {
        try {
          const supabase = getSupabaseBrowserClient();
          const { data } = await supabase
            .from('scenarios')
            .select('*')
            .eq('opportunity_id', activeOpportunity.id)
            .order('created_at', { ascending: true });

          if (data && data.length > 0) {
            const rehydrated = data.map((s: any) =>
              simulateScenario({
                scenarioName: s.scenario_name,
                inputs: {
                  buyerPaymentDelayDays: s.buyer_payment_delay_days,
                  materialCostInflationPct: Number(s.material_cost_inflation_pct),
                  productionCostIncreasePct: Number(s.production_cost_increase_pct),
                  advanceReceivedPct: Number(s.advance_received_pct),
                  deliveryDelayDays: s.delivery_delay_days,
                  orderValueAdjustmentPct: 0,
                },
                baseOrderValue: purchaseOrder.totalOrderValue,
                baseDeliveryDays: 30,
                baseOrderDate: purchaseOrder.orderDate,
                baseDeliveryDeadline: purchaseOrder.deliveryDeadline,
                baseCosts: costs,
                baselineCash: financials.availableCash,
                monthlyEmi: financials.monthlyEmiObligations,
                monthlyFixedOverhead: financials.monthlyFixedOverheads,
              })
            );
            setSavedScenarios(rehydrated);
          }
        } catch (err) {
          console.error('Error fetching scenarios:', err);
        }
      };
      fetchScenarios();
    }
  }, [activeOpportunity?.id, user, isDemoMode, purchaseOrder, costs, financials]);

  const handleReset = () => {
    setInputs({
      buyerPaymentDelayDays: 0,
      materialCostInflationPct: 0,
      productionCostIncreasePct: 0,
      advanceReceivedPct: purchaseOrder.advancePercentage,
      deliveryDelayDays: 0,
      orderValueAdjustmentPct: 0,
    });
  };

  const handleSaveScenario = async () => {
    const name = `Simulation ${savedScenarios.length + 1} (+${inputs.buyerPaymentDelayDays}d delay, +${inputs.materialCostInflationPct}% mat)`;
    setSavedScenarios([...savedScenarios, { ...simulatedResult, scenarioName: name }]);
    setSaveToast(`Scenario "${name}" saved to comparison workspace.`);
    setTimeout(() => setSaveToast(null), 3000);

    if (user && !isDemoMode && activeOpportunity?.id && !activeOpportunity.id.startsWith('opp-sri-') && !activeOpportunity.id.startsWith('opp-sana-')) {
      try {
        setIsSavingScenario(true);
        const supabase = getSupabaseBrowserClient();
        await supabase.from('scenarios').insert({
          opportunity_id: activeOpportunity.id,
          scenario_name: name,
          buyer_payment_delay_days: inputs.buyerPaymentDelayDays,
          material_cost_inflation_pct: inputs.materialCostInflationPct,
          production_cost_increase_pct: inputs.productionCostIncreasePct,
          advance_received_pct: inputs.advanceReceivedPct,
          delivery_delay_days: inputs.deliveryDelayDays,
          simulated_peak_deficit: simulatedResult.simulatedPeakCashDeficit,
          simulated_closing_cash: simulatedResult.simulatedClosingCash,
          simulated_working_capital_gap: simulatedResult.simulatedWorkingCapitalGap,
          simulated_gross_contribution: simulatedResult.simulatedGrossContribution,
        });
      } catch (err) {
        console.error('Error saving scenario to Supabase:', err);
      } finally {
        setIsSavingScenario(false);
      }
    }
  };

  const deltaContribution = simulatedResult.simulatedGrossContribution - baselineResult.simulatedGrossContribution;
  const deltaDeficit = simulatedResult.simulatedPeakCashDeficit - baselineResult.simulatedPeakCashDeficit;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rust font-semibold">
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>Stress-Testing Laboratory</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Scenario Laboratory
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Dynamically stress-test payment delays, raw material inflation, and supplier bottlenecks.
              Watch real-time cash balance and deficit recalculations across the order lifecycle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-ivory-200 hover:bg-ivory-300 text-charcoal border border-border-light font-semibold uppercase flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>
            <button
              onClick={handleSaveScenario}
              className="px-4 py-2.5 bg-charcoal hover:bg-charcoal-600 text-ivory font-semibold uppercase flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Save className="w-3.5 h-3.5 text-amber" />
              <span>Save Scenario</span>
            </button>
            {savedScenarios.length > 0 && (
              <button
                onClick={() => setShowSavedComparison(!showSavedComparison)}
                className="px-4 py-2.5 bg-amber hover:bg-amber-light text-charcoal font-bold uppercase flex items-center gap-1.5 transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Saved ({savedScenarios.length})</span>
              </button>
            )}
          </div>
        </div>

        {saveToast && (
          <div className="p-3 bg-sage/20 border border-sage-dark text-xs font-mono text-charcoal flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage-dark" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Rapid Presets Strip (Section 16 Scenarios) */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-charcoal-400 block">
            Rapid Stress-Test Presets:
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button
              onClick={() => applyPreset('Delay 30', { buyerPaymentDelayDays: 30 })}
              className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 border border-border-light text-charcoal"
            >
              +30d Buyer Delay
            </button>
            <button
              onClick={() => applyPreset('Delay 60', { buyerPaymentDelayDays: 60 })}
              className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 border border-border-light text-charcoal"
            >
              +60d Buyer Delay
            </button>
            <button
              onClick={() => applyPreset('Delay 90', { buyerPaymentDelayDays: 90 })}
              className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 border border-border-light text-charcoal font-semibold text-rust"
            >
              +90d Extreme Delay
            </button>
            <button
              onClick={() => applyPreset('Mat 10%', { materialCostInflationPct: 10 })}
              className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 border border-border-light text-charcoal"
            >
              +10% Raw Material Spike
            </button>
            <button
              onClick={() => applyPreset('Mat 15%', { materialCostInflationPct: 15 })}
              className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 border border-border-light text-charcoal font-semibold text-rust"
            >
              +15% Severe Material Spike
            </button>
            <button
              onClick={() => applyPreset('Zero Advance', { advanceReceivedPct: 0 })}
              className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 border border-border-light text-charcoal"
            >
              0% Advance (100% on Credit)
            </button>
            <button
              onClick={() => applyPreset('Favorable 30% Advance', { advanceReceivedPct: 30, buyerPaymentDelayDays: 0 })}
              className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 border border-border-light text-sage-dark font-semibold"
            >
              30% Advance (Negotiated)
            </button>
          </div>
        </div>

        {/* Main 2-Column Laboratory Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Interactive Sliders Control Panel */}
          <div className="lg:col-span-5 bg-ivory border border-border-light shadow-md p-6 sm:p-7 space-y-6">
            <div className="border-b border-border-light pb-3 flex items-center justify-between">
              <span className="font-serif text-2xl text-charcoal font-normal">
                Simulation Variables
              </span>
              <span className="text-[11px] font-mono uppercase text-rust font-semibold">
                Dynamic Recalculation
              </span>
            </div>

            <div className="space-y-6 font-mono text-xs">
              {/* Slider 1: Customer Payment Delay */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="uppercase text-charcoal-300 font-medium">Customer Payment Delay</label>
                  <span className="font-bold text-sm text-rust">+{inputs.buyerPaymentDelayDays} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="15"
                  value={inputs.buyerPaymentDelayDays}
                  onChange={(e) => setInputs({ ...inputs, buyerPaymentDelayDays: Number(e.target.value) })}
                  className="w-full accent-charcoal bg-ivory-200 h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-charcoal-400">
                  <span>0d (Contract)</span>
                  <span>+30d</span>
                  <span>+60d</span>
                  <span>+90d</span>
                </div>
              </div>

              {/* Slider 2: Raw Material Price Inflation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="uppercase text-charcoal-300 font-medium">Raw Material Price Hike</label>
                  <span className="font-bold text-sm text-rust">+{inputs.materialCostInflationPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="5"
                  value={inputs.materialCostInflationPct}
                  onChange={(e) => setInputs({ ...inputs, materialCostInflationPct: Number(e.target.value) })}
                  className="w-full accent-charcoal bg-ivory-200 h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-charcoal-400">
                  <span>0% (Stable)</span>
                  <span>+10%</span>
                  <span>+15%</span>
                  <span>+25%</span>
                </div>
              </div>

              {/* Slider 3: Production & Labour Expense Increase */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="uppercase text-charcoal-300 font-medium">Labour & Utilities Increase</label>
                  <span className="font-bold text-sm text-charcoal">+{inputs.productionCostIncreasePct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="5"
                  value={inputs.productionCostIncreasePct}
                  onChange={(e) => setInputs({ ...inputs, productionCostIncreasePct: Number(e.target.value) })}
                  className="w-full accent-charcoal bg-ivory-200 h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-charcoal-400">
                  <span>0%</span>
                  <span>+10%</span>
                  <span>+20%</span>
                </div>
              </div>

              {/* Slider 4: Customer Advance Received */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="uppercase text-charcoal-300 font-medium">Customer Advance Deposit</label>
                  <span className="font-bold text-sm text-amber-dark">{inputs.advanceReceivedPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={inputs.advanceReceivedPct}
                  onChange={(e) => setInputs({ ...inputs, advanceReceivedPct: Number(e.target.value) })}
                  className="w-full accent-charcoal bg-ivory-200 h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-charcoal-400">
                  <span>0% (No Advance)</span>
                  <span>15%</span>
                  <span>30%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Slider 5: Delivery Delay */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="uppercase text-charcoal-300 font-medium">Manufacturing Lead Time Delay</label>
                  <span className="font-bold text-sm text-charcoal">+{inputs.deliveryDelayDays} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="7"
                  value={inputs.deliveryDelayDays}
                  onChange={(e) => setInputs({ ...inputs, deliveryDelayDays: Number(e.target.value) })}
                  className="w-full accent-charcoal bg-ivory-200 h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-charcoal-400">
                  <span>0d (On Time)</span>
                  <span>+7d</span>
                  <span>+14d</span>
                  <span>+30d</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Side-by-Side Delta Comparison & Recalculated Projections */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-charcoal text-ivory p-6 sm:p-8 border border-charcoal-300 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-400 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-sage-light uppercase tracking-wider block">
                    Real-Time Stress-Test Results
                  </span>
                  <span className="font-serif text-2xl text-ivory">
                    Baseline vs. Simulated Outcome
                  </span>
                </div>
                <span
                  className={`px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
                    simulatedResult.riskRating === 'Critical'
                      ? 'bg-rust text-ivory'
                      : simulatedResult.riskRating === 'High'
                      ? 'bg-amber text-charcoal'
                      : 'bg-sage-dark text-ivory'
                  }`}
                >
                  {simulatedResult.riskRating} Stress
                </span>
              </div>

              {/* 4 Comparative Metric Pairs */}
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                {/* Metric 1: Peak Deficit */}
                <div className="p-3.5 bg-charcoal-400 border border-charcoal-300 space-y-1">
                  <span className="text-sage-light uppercase text-[11px] block">Peak Cash Deficit</span>
                  <div className="text-xl font-bold text-rust-light font-mono">
                    {formatINR(simulatedResult.simulatedPeakCashDeficit)}
                  </div>
                  <div className="text-[11px] flex justify-between pt-1 border-t border-charcoal-300">
                    <span className="text-ivory-400">Baseline:</span>
                    <span className="text-ivory">{formatINR(baselineResult.simulatedPeakCashDeficit)}</span>
                  </div>
                  {deltaDeficit > 0 && (
                    <span className="text-[10px] text-rust block font-semibold">
                      +{formatINR(deltaDeficit)} deeper deficit
                    </span>
                  )}
                </div>

                {/* Metric 2: Working Capital Gap */}
                <div className="p-3.5 bg-charcoal-400 border border-charcoal-300 space-y-1">
                  <span className="text-sage-light uppercase text-[11px] block">Working Capital Gap</span>
                  <div className="text-xl font-bold text-rust-light font-mono">
                    {formatINR(simulatedResult.simulatedWorkingCapitalGap)}
                  </div>
                  <div className="text-[11px] flex justify-between pt-1 border-t border-charcoal-300">
                    <span className="text-ivory-400">Baseline:</span>
                    <span className="text-ivory">{formatINR(baselineResult.simulatedWorkingCapitalGap)}</span>
                  </div>
                </div>

                {/* Metric 3: Gross Contribution */}
                <div className="p-3.5 bg-charcoal-400 border border-charcoal-300 space-y-1">
                  <span className="text-sage-light uppercase text-[11px] block">Gross Contribution</span>
                  <div className="text-xl font-bold text-amber font-mono">
                    {formatINR(simulatedResult.simulatedGrossContribution)}
                  </div>
                  <div className="text-[11px] flex justify-between pt-1 border-t border-charcoal-300">
                    <span className="text-ivory-400">Baseline:</span>
                    <span className="text-ivory">{formatINR(baselineResult.simulatedGrossContribution)}</span>
                  </div>
                  {deltaContribution < 0 && (
                    <span className="text-[10px] text-rust block">
                      {formatINR(deltaContribution)} margin erosion
                    </span>
                  )}
                </div>

                {/* Metric 4: Closing Cash */}
                <div className="p-3.5 bg-charcoal-400 border border-charcoal-300 space-y-1">
                  <span className="text-sage-light uppercase text-[11px] block">Closing Cash Position</span>
                  <div className="text-xl font-bold text-ivory font-mono">
                    {formatINR(simulatedResult.simulatedClosingCash)}
                  </div>
                  <div className="text-[11px] flex justify-between pt-1 border-t border-charcoal-300">
                    <span className="text-ivory-400">Baseline:</span>
                    <span className="text-ivory">{formatINR(baselineResult.simulatedClosingCash)}</span>
                  </div>
                </div>
              </div>

              {/* Contextual Warning */}
              {simulatedResult.simulatedPeakCashDeficit > financials.availableCash && (
                <div className="p-4 bg-rust/20 border border-rust/50 text-xs text-ivory-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rust-light flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Under this scenario (+{inputs.buyerPaymentDelayDays} days delay), cash reserves reach{' '}
                    <strong className="text-rust-light font-mono">-{formatINR(simulatedResult.simulatedPeakCashDeficit)}</strong>.
                    Without an active working capital line or PO financing bridge, payroll and vendor checks will fail.
                  </p>
                </div>
              )}
            </div>

            {/* Action Routing */}
            <div className="p-5 bg-ivory border border-border-light shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div>
                <span className="font-semibold text-charcoal block">Required Mitigation Financing:</span>
                <span className="text-sm font-bold text-rust">
                  {formatINR(simulatedResult.simulatedPeakCashDeficit)} Bridge Facility
                </span>
              </div>
              <Link
                href="/loan-comparison"
                className="px-5 py-2.5 bg-charcoal text-ivory hover:bg-charcoal-600 font-semibold uppercase flex items-center gap-1.5 transition-colors"
              >
                <span>Compare Bridge Facilities</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber" />
              </Link>
            </div>
          </div>
        </div>

        {/* Saved Scenarios Comparison Drawer */}
        {showSavedComparison && savedScenarios.length > 0 && (
          <div className="p-6 bg-ivory border-2 border-charcoal shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border-light pb-3">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-rust" />
                <h3 className="font-serif text-2xl text-charcoal">
                  Saved Scenario Comparison Matrix
                </h3>
              </div>
              <button
                onClick={() => setShowSavedComparison(false)}
                className="text-charcoal-400 hover:text-charcoal"
              >
                ✕ Close
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-charcoal text-ivory uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Scenario Name</th>
                    <th className="p-3 text-right">Gross Contribution</th>
                    <th className="p-3 text-right">Margin %</th>
                    <th className="p-3 text-right">Peak Cash Deficit</th>
                    <th className="p-3 text-right">Closing Cash</th>
                    <th className="p-3 text-center">Stress Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  <tr className="bg-ivory-100 font-bold">
                    <td className="p-3 text-charcoal">Baseline Contract</td>
                    <td className="p-3 text-right">{formatINR(baselineResult.simulatedGrossContribution)}</td>
                    <td className="p-3 text-right">{baselineResult.simulatedMarginPct}%</td>
                    <td className="p-3 text-right text-rust">{formatINR(baselineResult.simulatedPeakCashDeficit)}</td>
                    <td className="p-3 text-right">{formatINR(baselineResult.simulatedClosingCash)}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-sage/20 text-sage-dark uppercase font-bold text-[10px]">
                        {baselineResult.riskRating}
                      </span>
                    </td>
                  </tr>
                  {savedScenarios.map((sc, idx) => (
                    <tr key={idx} className="hover:bg-ivory-50">
                      <td className="p-3 text-charcoal font-medium">{sc.scenarioName}</td>
                      <td className="p-3 text-right">{formatINR(sc.simulatedGrossContribution)}</td>
                      <td className="p-3 text-right">{sc.simulatedMarginPct}%</td>
                      <td className="p-3 text-right text-rust font-bold">{formatINR(sc.simulatedPeakCashDeficit)}</td>
                      <td className="p-3 text-right">{formatINR(sc.simulatedClosingCash)}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 uppercase font-bold text-[10px] ${
                            sc.riskRating === 'Critical'
                              ? 'bg-rust text-ivory'
                              : sc.riskRating === 'High'
                              ? 'bg-amber text-charcoal'
                              : 'bg-sage-dark text-ivory'
                          }`}
                        >
                          {sc.riskRating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
