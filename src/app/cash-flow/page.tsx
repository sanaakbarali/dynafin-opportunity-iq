'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR, formatIndianDate } from '@/lib/formatting/currency';
import { generateCashFlowTimeline } from '@/lib/calculations/financial';
import {
  Activity,
  Calendar,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Clock,
  Coins,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function CashFlowPage() {
  const { activeOpportunity, financials } = useWorkspace();
  const [selectedHorizonDays, setSelectedHorizonDays] = useState<30 | 60 | 90>(90);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!activeOpportunity) {
    return (
      <AppLayout>
        <div className="text-center py-20 font-mono text-xs">
          Please select an opportunity to generate a Cash Flow Intelligence timeline.
        </div>
      </AppLayout>
    );
  }

  const { purchaseOrder, costs } = activeOpportunity;

  // Generate deterministic cash flow timeline with active opportunity parameters
  const { timeline, peakCashDeficit, deficitDate, fundingGapDays } = generateCashFlowTimeline({
    orderDate: purchaseOrder.orderDate,
    deliveryDeadline: purchaseOrder.deliveryDeadline,
    totalOrderValue: purchaseOrder.totalOrderValue,
    advancePercentage: purchaseOrder.advancePercentage,
    paymentTermsDays: purchaseOrder.paymentTermsDays,
    paymentDelayDays: 28, // Default empirical buyer delay
    costs,
    baselineCash: financials.availableCash,
    monthlyEmi: financials.monthlyEmiObligations,
    monthlyFixedOverhead: financials.monthlyFixedOverheads,
  });

  // Filter timeline according to chosen horizon
  const orderStartDate = new Date(purchaseOrder.orderDate);
  const filteredTimeline = timeline.filter((pt) => {
    const diff = (new Date(pt.date).getTime() - orderStartDate.getTime()) / (1000 * 3600 * 24);
    return diff <= selectedHorizonDays;
  });

  // Default active selected checkpoint
  const activePoint =
    filteredTimeline.find((pt) => pt.date === selectedDate) ||
    filteredTimeline.find((pt) => pt.isDeficit) ||
    filteredTimeline[0];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border-light pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rust font-semibold">
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>Liquidity Forecasting Engine</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal">
              Cash Flow Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 font-sans max-w-2xl">
              Mapping daily cash inflows against supplier advances, workforce wages, discom utility dues,
              and existing bank EMI schedules.
            </p>
          </div>

          {/* Time Horizon Selector */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-charcoal-400 uppercase text-[11px] mr-1">Projection Horizon:</span>
            {[30, 60, 90].map((horizon) => (
              <button
                key={horizon}
                onClick={() => setSelectedHorizonDays(horizon as 30 | 60 | 90)}
                className={`px-3 py-1.5 border transition-all ${
                  selectedHorizonDays === horizon
                    ? 'bg-charcoal text-ivory border-charcoal font-bold'
                    : 'bg-ivory hover:bg-ivory-200 text-charcoal-400 border-border-light'
                }`}
              >
                {horizon} Days
              </button>
            ))}
          </div>
        </div>

        {/* Executive Liquidity Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-5 bg-ivory border border-border-light shadow-sm space-y-1">
            <span className="text-charcoal-400 uppercase text-[11px] block">Opening Cash Balance</span>
            <div className="text-xl font-bold font-mono text-charcoal">
              {formatINR(financials.availableCash)}
            </div>
            <span className="text-[10px] text-sage-dark block">Liquid operating reserves</span>
          </div>

          <div className="p-5 bg-rust/10 border border-rust/40 shadow-sm space-y-1 text-charcoal">
            <span className="text-rust uppercase text-[11px] block font-bold">Peak Projected Cash Deficit</span>
            <div className="text-xl font-bold font-mono text-rust">
              {formatINR(peakCashDeficit)}
            </div>
            <span className="text-[10px] text-rust-dark block">Occurring at {formatIndianDate(deficitDate)}</span>
          </div>

          <div className="p-5 bg-ivory border border-border-light shadow-sm space-y-1">
            <span className="text-charcoal-400 uppercase text-[11px] block">Funding Gap Duration</span>
            <div className="text-xl font-bold font-mono text-charcoal">
              {fundingGapDays > 0 ? `${fundingGapDays} Days` : '0 Days (Covered)'}
            </div>
            <span className="text-[10px] text-charcoal-400 block">Consecutive negative balance days</span>
          </div>

          <div className="p-5 bg-charcoal text-ivory border border-charcoal-300 shadow-sm space-y-1">
            <span className="text-sage-light uppercase text-[11px] block">Closing Projected Balance</span>
            <div className="text-xl font-bold font-mono text-ivory">
              {filteredTimeline.length > 0
                ? formatINR(filteredTimeline[filteredTimeline.length - 1].closingCash)
                : '—'}
            </div>
            <span className="text-[10px] text-sage-light block">After buyer invoice settlement</span>
          </div>
        </div>

        {/* Interactive Cash Flow Timeline Strip */}
        <div className="bg-ivory border border-border-light shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light pb-4">
            <div>
              <h2 className="font-serif text-2xl text-charcoal">
                Interactive Balance Trajectory
              </h2>
              <p className="text-xs text-charcoal-400 font-sans mt-0.5">
                Click any date checkpoint to inspect the specific scheduled inflows and outflows.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-sage-dark inline-block" />
                <span className="text-charcoal-400">Positive Cash</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-rust inline-block" />
                <span className="text-rust font-semibold">Deficit / Overdraft</span>
              </span>
            </div>
          </div>

          {/* Timeline Checkpoints Scroll */}
          <div className="overflow-x-auto pb-4 pt-2">
            <div className="flex items-end gap-3 min-w-[750px]">
              {filteredTimeline.map((pt) => {
                const isSelected = activePoint?.date === pt.date;
                const isDeficit = pt.isDeficit;

                return (
                  <button
                    key={pt.date}
                    onClick={() => setSelectedDate(pt.date)}
                    className={`flex-1 p-3 border transition-all text-left font-mono relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-charcoal bg-charcoal text-ivory shadow-lg scale-105 z-10'
                        : isDeficit
                        ? 'border-rust/40 bg-rust/10 text-charcoal hover:border-rust'
                        : 'border-border-light bg-ivory-100 text-charcoal hover:border-charcoal-300'
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1 flex justify-between">
                      <span>{pt.label}</span>
                      {pt.events.length > 0 && <span>({pt.events.length})</span>}
                    </div>

                    <div className="text-[11px] font-semibold truncate">
                      {formatIndianDate(pt.date, 'short')}
                    </div>

                    <div
                      className={`text-xs font-bold mt-2 font-mono ${
                        isSelected
                          ? isDeficit
                            ? 'text-rust-light'
                            : 'text-amber'
                          : isDeficit
                          ? 'text-rust'
                          : 'text-sage-dark'
                      }`}
                    >
                      {formatINR(pt.closingCash, { compact: true })}
                    </div>

                    {isDeficit && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rust absolute top-2 right-2 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Transaction Ledger */}
          {activePoint && (
            <div className="p-6 bg-ivory-100 border border-border-light space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-light pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-charcoal" />
                  <span className="font-serif text-lg text-charcoal font-medium">
                    Ledger Activity for {formatIndianDate(activePoint.date, 'long')} ({activePoint.label})
                  </span>
                </div>
                <div className="text-xs font-mono">
                  Opening: <span className="font-bold text-charcoal">{formatINR(activePoint.openingCash)}</span> → Closing: <span className={`font-bold ${activePoint.isDeficit ? 'text-rust' : 'text-sage-dark'}`}>{formatINR(activePoint.closingCash)}</span>
                </div>
              </div>

              {activePoint.events.length === 0 ? (
                <p className="text-xs font-mono text-charcoal-400 py-3">
                  No direct supplier or customer milestone transactions scheduled on this checkpoint date.
                </p>
              ) : (
                <div className="space-y-2">
                  {activePoint.events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 bg-ivory border border-border-light flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 flex items-center justify-center font-bold text-xs ${
                            ev.eventType === 'inflow'
                              ? 'bg-sage/20 text-sage-dark'
                              : 'bg-rust/20 text-rust'
                          }`}
                        >
                          {ev.eventType === 'inflow' ? '+' : '-'}
                        </div>
                        <div>
                          <span className="font-semibold text-charcoal">{ev.eventName}</span>
                          <span className="text-[10px] text-charcoal-400 block">
                            Party: {ev.recipientOrSender} • Category: {ev.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-bold text-sm ${
                            ev.eventType === 'inflow' ? 'text-sage-dark' : 'text-rust'
                          }`}
                        >
                          {ev.eventType === 'inflow' ? '+' : '-'}{formatINR(ev.amount)}
                        </span>
                        <span className="text-[10px] text-charcoal-400 block">
                          {ev.isConfirmed ? 'Contractual' : 'Projected'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Strategy Box */}
        <div className="bg-charcoal text-ivory p-6 sm:p-8 border border-charcoal-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber">
              <Coins className="w-4 h-4" />
              <span className="uppercase font-semibold tracking-wider">Working Capital Remediation Strategy</span>
            </div>
            <p className="text-xs sm:text-sm text-ivory-300 font-sans leading-relaxed">
              At {formatIndianDate(deficitDate)}, your business faces a projected shortfall of{' '}
              <strong className="text-ivory font-mono">{formatINR(peakCashDeficit)}</strong>.
              Bridging this via a 60-day Purchase Order Loan or TReDS invoice auction prevents cheque bounces without diluting equity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/funding"
              className="px-5 py-3 bg-amber hover:bg-amber-light text-charcoal font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
            >
              <span>Explore PO Financing</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
