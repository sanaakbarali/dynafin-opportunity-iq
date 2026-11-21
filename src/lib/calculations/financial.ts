import {
  OpportunityCosts,
  PaymentScheduleItem,
  CashFlowTimelinePoint,
  ScenarioSimulationInputs,
  ScenarioSimulationResult,
  CustomerInvoice,
  RiskAssessment,
  RiskLevel,
  BusinessFinancials,
  BusinessOperations,
  LoanComparisonInput,
  LoanComparisonOutput
} from '@/types';

/**
 * Calculates deterministic direct costs, gross contribution, and working capital gap.
 * Distinguishes gross contribution (Order Value - Direct Costs) from net operating surplus.
 */
export function calculateOpportunityEconomics(params: {
  totalOrderValue: number;
  advancePercentage: number;
  rawMaterialCost: number;
  labourCost: number;
  productionExpenses: number;
  packagingCost: number;
  transportationLogistics: number;
  electricityUtilities: number;
  otherDirectCosts: number;
  allocatedOverheads: number;
  estimatedFinancingCost: number;
  availableCash: number;
  supplierCreditDays?: number;
}): OpportunityCosts {
  const {
    totalOrderValue,
    advancePercentage,
    rawMaterialCost,
    labourCost,
    productionExpenses,
    packagingCost,
    transportationLogistics,
    electricityUtilities,
    otherDirectCosts,
    allocatedOverheads,
    estimatedFinancingCost,
    availableCash,
  } = params;

  // Direct costs incurred strictly to fulfill this order
  const totalDirectCost =
    rawMaterialCost +
    labourCost +
    productionExpenses +
    packagingCost +
    transportationLogistics +
    electricityUtilities +
    otherDirectCosts;

  // Gross contribution = Value created after variable direct costs
  const grossContribution = totalOrderValue - totalDirectCost;

  const contributionMarginPct =
    totalOrderValue > 0
      ? Number(((grossContribution / totalOrderValue) * 100).toFixed(2))
      : 0;

  // Net operating surplus after indirect overhead and finance charges
  const netOperatingSurplus =
    grossContribution - allocatedOverheads - estimatedFinancingCost;

  // Upfront cash required before production can ramp up (raw material downpayment + initial payroll + setup)
  const advanceAmountReceived = (totalOrderValue * advancePercentage) / 100;
  
  // Typical MSME upfront requirement: supplier downpayment (often 40-50% of raw materials) + immediate labor
  const rawMaterialAdvanceReq = rawMaterialCost * 0.40;
  const upfrontCashRequired =
    rawMaterialAdvanceReq + (labourCost * 0.50) + (productionExpenses * 0.30);

  // Working capital gap: Peak cash needed to carry the order minus upfront advance received and available buffer
  const immediateShortfall = Math.max(0, upfrontCashRequired - advanceAmountReceived);
  const totalCapitalGap = Math.max(0, totalDirectCost - advanceAmountReceived - (availableCash * 0.60));

  return {
    rawMaterialCost,
    labourCost,
    productionExpenses,
    packagingCost,
    transportationLogistics,
    electricityUtilities,
    otherDirectCosts,
    allocatedOverheads,
    estimatedFinancingCost,
    totalDirectCost,
    grossContribution,
    contributionMarginPct,
    netOperatingSurplus,
    upfrontCashRequired,
    workingCapitalGap: Math.max(immediateShortfall, totalCapitalGap),
  };
}

/**
 * Generates an interactive cash flow timeline modeling opening cash, inflows, outflows,
 * and closing cash over the order lifecycle (up to 120 days).
 */
export function generateCashFlowTimeline(params: {
  orderDate: string; // YYYY-MM-DD
  deliveryDeadline: string; // YYYY-MM-DD
  totalOrderValue: number;
  advancePercentage: number;
  paymentTermsDays: number;
  paymentDelayDays: number;
  costs: OpportunityCosts;
  baselineCash: number;
  monthlyEmi: number;
  monthlyFixedOverhead: number;
  customSchedule?: PaymentScheduleItem[];
}): {
  timeline: CashFlowTimelinePoint[];
  peakCashDeficit: number;
  deficitDate: string;
  fundingGapDays: number;
} {
  const {
    orderDate,
    deliveryDeadline,
    totalOrderValue,
    advancePercentage,
    paymentTermsDays,
    paymentDelayDays,
    costs,
    baselineCash,
    monthlyEmi,
    monthlyFixedOverhead,
  } = params;

  const startDate = new Date(orderDate);
  const deliveryDate = new Date(deliveryDeadline);
  
  // Buyer payment expected date = Delivery + Payment Terms + Delay Days
  const finalPaymentDate = new Date(deliveryDate);
  finalPaymentDate.setDate(
    finalPaymentDate.getDate() + paymentTermsDays + paymentDelayDays
  );

  const advanceAmount = (totalOrderValue * advancePercentage) / 100;
  const balanceAmount = totalOrderValue - advanceAmount;

  // Build scheduled events
  const events: PaymentScheduleItem[] = [];

  // 1. Inflow: Advance (T + 2 days)
  if (advanceAmount > 0) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 2);
    events.push({
      id: 'evt-adv',
      eventName: `Customer Advance (${advancePercentage}%)`,
      eventType: 'inflow',
      amount: advanceAmount,
      scheduledDate: d.toISOString().split('T')[0],
      recipientOrSender: 'Customer',
      category: 'Customer Advance',
      isConfirmed: true,
    });
  }

  // 2. Outflow: Raw material advance (T + 5 days)
  const rmAdvance = costs.rawMaterialCost * 0.50;
  {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 5);
    events.push({
      id: 'evt-rm-adv',
      eventName: 'Supplier Advance (50% Raw Materials)',
      eventType: 'outflow',
      amount: rmAdvance,
      scheduledDate: d.toISOString().split('T')[0],
      recipientOrSender: 'Yarn & Raw Material Suppliers',
      category: 'Raw Materials',
      isConfirmed: false,
    });
  }

  // 3. Outflow: Labour tranche 1 (T + 15 days)
  const labourT1 = costs.labourCost * 0.50;
  {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 15);
    events.push({
      id: 'evt-lab-1',
      eventName: 'Factory Wages - Production Tranche 1',
      eventType: 'outflow',
      amount: labourT1,
      scheduledDate: d.toISOString().split('T')[0],
      recipientOrSender: 'Production Staff',
      category: 'Labour / Payroll',
      isConfirmed: false,
    });
  }

  // 4. Outflow: Raw material balance on delivery at site (T + 20 days)
  const rmBalance = costs.rawMaterialCost - rmAdvance;
  {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 20);
    events.push({
      id: 'evt-rm-bal',
      eventName: 'Supplier Balance Payment',
      eventType: 'outflow',
      amount: rmBalance,
      scheduledDate: d.toISOString().split('T')[0],
      recipientOrSender: 'Material Suppliers',
      category: 'Raw Materials',
      isConfirmed: false,
    });
  }

  // 5. Outflow: Labour tranche 2 + Utilities (T + 30 days)
  const labourT2 = costs.labourCost - labourT1;
  {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 30);
    events.push({
      id: 'evt-lab-2',
      eventName: 'Factory Wages Tranche 2 & Utilities',
      eventType: 'outflow',
      amount: labourT2 + costs.electricityUtilities + costs.productionExpenses,
      scheduledDate: d.toISOString().split('T')[0],
      recipientOrSender: 'Workforce & Utilities Dept',
      category: 'Labour / Payroll',
      isConfirmed: false,
    });
  }

  // 6. Outflow: Packaging & Logistics on Delivery date
  {
    events.push({
      id: 'evt-logistics',
      eventName: 'Dispatch, Packaging & Freight Costs',
      eventType: 'outflow',
      amount: costs.packagingCost + costs.transportationLogistics + costs.otherDirectCosts,
      scheduledDate: deliveryDeadline,
      recipientOrSender: 'Logistics Partner',
      category: 'Logistics',
      isConfirmed: false,
    });
  }

  // 7. Monthly Recurring Outflows: Existing EMI and baseline overhead (at day 30, day 60, day 90)
  [30, 60, 90].forEach((dayOffset, idx) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayOffset);
    events.push({
      id: `evt-emi-${idx}`,
      eventName: `Existing Loan EMI & Facility Interest (Cycle ${idx + 1})`,
      eventType: 'outflow',
      amount: monthlyEmi,
      scheduledDate: d.toISOString().split('T')[0],
      recipientOrSender: 'Bank Loan Obligation',
      category: 'Financing EMI',
      isConfirmed: true,
    });
  });

  // 8. Inflow: Final Customer Payment (Delivery + Payment Terms + Delay)
  {
    events.push({
      id: 'evt-cust-final',
      eventName: `Final Customer Settlement (${100 - advancePercentage}%)`,
      eventType: 'inflow',
      amount: balanceAmount,
      scheduledDate: finalPaymentDate.toISOString().split('T')[0],
      recipientOrSender: 'Customer Account',
      category: 'Customer Final',
      isConfirmed: false,
    });
  }

  // Generate 14-day intervals or key date checkpoints across 120 days
  const checkpoints: string[] = [];
  const maxDays = Math.max(105, Math.ceil((finalPaymentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 10);
  
  for (let offset = 0; offset <= maxDays; offset += 7) {
    const cp = new Date(startDate);
    cp.setDate(cp.getDate() + offset);
    checkpoints.push(cp.toISOString().split('T')[0]);
  }

  // Ensure all exact event dates are in checkpoints
  events.forEach((ev) => {
    if (!checkpoints.includes(ev.scheduledDate)) {
      checkpoints.push(ev.scheduledDate);
    }
  });

  checkpoints.sort();

  let runningCash = baselineCash;
  let peakDeficit = 0;
  let deficitDate = '';
  let deficitStartMs: number | null = null;
  let deficitEndMs: number | null = null;

  const timeline: CashFlowTimelinePoint[] = [];

  checkpoints.forEach((cpDate, idx) => {
    // Find all events occurring on or before cpDate that haven't been accounted for yet,
    // or group by checkpoint interval
    const prevDateStr = idx > 0 ? checkpoints[idx - 1] : '1970-01-01';
    const currentEvents = events.filter(
      (ev) => ev.scheduledDate > prevDateStr && ev.scheduledDate <= cpDate
    );

    const inflow = currentEvents
      .filter((e) => e.eventType === 'inflow')
      .reduce((sum, e) => sum + e.amount, 0);

    const outflow = currentEvents
      .filter((e) => e.eventType === 'outflow')
      .reduce((sum, e) => sum + e.amount, 0);

    const opening = runningCash;
    const net = inflow - outflow;
    runningCash = opening + net;

    if (runningCash < 0) {
      const deficit = Math.abs(runningCash);
      if (deficit > peakDeficit) {
        peakDeficit = deficit;
        deficitDate = cpDate;
      }
      const currentMs = new Date(cpDate).getTime();
      if (deficitStartMs === null) deficitStartMs = currentMs;
      deficitEndMs = currentMs;
    }

    timeline.push({
      date: cpDate,
      label: `T+${Math.round((new Date(cpDate).getTime() - startDate.getTime()) / (1000 * 3600 * 24))}d`,
      openingCash: opening,
      inflow,
      outflow,
      netCashFlow: net,
      closingCash: runningCash,
      events: currentEvents,
      isDeficit: runningCash < 0,
    });
  });

  const fundingGapDays =
    deficitStartMs !== null && deficitEndMs !== null
      ? Math.max(1, Math.round((deficitEndMs - deficitStartMs) / (1000 * 3600 * 24)))
      : 0;

  return {
    timeline,
    peakCashDeficit: peakDeficit,
    deficitDate: deficitDate || checkpoints[0],
    fundingGapDays,
  };
}

/**
 * Simulates what-if scenarios in the Scenario Laboratory:
 * - Customer delays payment (30, 60, 90 days)
 * - Raw material inflation (+10%, +15%)
 * - Production cost hikes
 * - Customer advance variance
 */
export function simulateScenario(params: {
  scenarioName: string;
  inputs: ScenarioSimulationInputs;
  baseOrderValue: number;
  baseDeliveryDays: number;
  baseOrderDate: string;
  baseDeliveryDeadline: string;
  baseCosts: OpportunityCosts;
  baselineCash: number;
  monthlyEmi: number;
  monthlyFixedOverhead: number;
}): ScenarioSimulationResult {
  const {
    scenarioName,
    inputs,
    baseOrderValue,
    baseOrderDate,
    baseDeliveryDeadline,
    baseCosts,
    baselineCash,
    monthlyEmi,
    monthlyFixedOverhead,
  } = params;

  // Apply inputs to order value
  const adjustedOrderValue =
    baseOrderValue * (1 + inputs.orderValueAdjustmentPct / 100);

  // Apply inflation to raw materials
  const adjustedRawMaterial =
    baseCosts.rawMaterialCost * (1 + inputs.materialCostInflationPct / 100);

  // Apply production cost hike
  const adjustedLabour =
    baseCosts.labourCost * (1 + inputs.productionCostIncreasePct / 100);
  const adjustedProduction =
    baseCosts.productionExpenses * (1 + inputs.productionCostIncreasePct / 100);

  // Re-run deterministic opportunity economics
  const simulatedCosts = calculateOpportunityEconomics({
    totalOrderValue: adjustedOrderValue,
    advancePercentage: inputs.advanceReceivedPct,
    rawMaterialCost: adjustedRawMaterial,
    labourCost: adjustedLabour,
    productionExpenses: adjustedProduction,
    packagingCost: baseCosts.packagingCost,
    transportationLogistics: baseCosts.transportationLogistics,
    electricityUtilities: baseCosts.electricityUtilities,
    otherDirectCosts: baseCosts.otherDirectCosts,
    allocatedOverheads: baseCosts.allocatedOverheads,
    estimatedFinancingCost: baseCosts.estimatedFinancingCost,
    availableCash: baselineCash,
  });

  // Calculate new cash-flow timeline
  const { timeline, peakCashDeficit, deficitDate } = generateCashFlowTimeline({
    orderDate: baseOrderDate,
    deliveryDeadline: baseDeliveryDeadline,
    totalOrderValue: adjustedOrderValue,
    advancePercentage: inputs.advanceReceivedPct,
    paymentTermsDays: 30, // Standard baseline
    paymentDelayDays: inputs.buyerPaymentDelayDays,
    costs: simulatedCosts,
    baselineCash,
    monthlyEmi,
    monthlyFixedOverhead,
  });

  // Determine scenario risk rating
  let riskRating: RiskLevel = 'Low';
  if (peakCashDeficit > baselineCash * 1.5 || simulatedCosts.contributionMarginPct < 15) {
    riskRating = 'Critical';
  } else if (peakCashDeficit > baselineCash * 0.8 || inputs.buyerPaymentDelayDays >= 45) {
    riskRating = 'High';
  } else if (peakCashDeficit > 0 || inputs.buyerPaymentDelayDays >= 30) {
    riskRating = 'Moderate';
  }

  const closingCash = timeline.length > 0 ? timeline[timeline.length - 1].closingCash : 0;

  return {
    scenarioName,
    inputs,
    simulatedTotalCost: simulatedCosts.totalDirectCost,
    simulatedGrossContribution: simulatedCosts.grossContribution,
    simulatedMarginPct: simulatedCosts.contributionMarginPct,
    simulatedUpfrontCashRequired: simulatedCosts.upfrontCashRequired,
    simulatedWorkingCapitalGap: simulatedCosts.workingCapitalGap,
    simulatedPeakCashDeficit: peakCashDeficit,
    simulatedDeficitDate: deficitDate,
    simulatedClosingCash: closingCash,
    riskRating,
    cashFlowTimeline: timeline,
  };
}

/**
 * Standard Reducing Balance EMI Calculation with complete Amortization Breakdown
 */
export function calculateEmi(inputs: LoanComparisonInput): LoanComparisonOutput {
  const { loanAmount, interestRateAnnualPct, tenureMonths, processingFeePct } = inputs;

  if (loanAmount <= 0 || tenureMonths <= 0) {
    return {
      monthlyEmi: 0,
      totalRepayment: 0,
      totalInterest: 0,
      processingFeeAmount: 0,
      totalCostOfCredit: 0,
      aprEffectivePct: 0,
      schedulePreview: [],
    };
  }

  const monthlyRate = interestRateAnnualPct / (12 * 100);
  let monthlyEmi = 0;

  if (monthlyRate === 0) {
    monthlyEmi = loanAmount / tenureMonths;
  } else {
    monthlyEmi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const processingFeeAmount = (loanAmount * processingFeePct) / 100;
  const totalRepayment = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);
  const totalCostOfCredit = totalInterest + processingFeeAmount;

  // Generate 6-month preview
  const schedulePreview: { month: number; emi: number; principal: number; interest: number; balance: number }[] = [];
  let remaining = loanAmount;
  const previewCount = Math.min(6, tenureMonths);

  for (let m = 1; m <= previewCount; m++) {
    const intForMonth = remaining * monthlyRate;
    const princForMonth = monthlyEmi - intForMonth;
    remaining = Math.max(0, remaining - princForMonth);
    schedulePreview.push({
      month: m,
      emi: Math.round(monthlyEmi),
      principal: Math.round(princForMonth),
      interest: Math.round(intForMonth),
      balance: Math.round(remaining),
    });
  }

  // Effective APR approximation including upfront fees
  const aprEffectivePct =
    Number((interestRateAnnualPct + (processingFeePct / (tenureMonths / 12))).toFixed(2));

  return {
    monthlyEmi: Math.round(monthlyEmi),
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(totalInterest),
    processingFeeAmount: Math.round(processingFeeAmount),
    totalCostOfCredit: Math.round(totalCostOfCredit),
    aprEffectivePct,
    schedulePreview,
  };
}

/**
 * Calculates the overdue delay in days for a customer invoice.
 * For paid invoices: uses actualPaymentDate - dueDate.
 * For unpaid invoices: uses current calendar date - dueDate.
 */
export function computeInvoiceDaysOverdue(dueDate: string, actualPaymentDate?: string | null): number {
  const due = new Date(dueDate).getTime();
  if (isNaN(due)) return 0;

  if (actualPaymentDate) {
    const paid = new Date(actualPaymentDate).getTime();
    if (!isNaN(paid)) {
      return Math.max(0, Math.round((paid - due) / (1000 * 60 * 60 * 24)));
    }
  }

  const now = Date.now();
  if (now > due) {
    return Math.max(0, Math.round((now - due) / (1000 * 60 * 60 * 24)));
  }
  return 0;
}

/**
 * Computes Customer Payment Behavior from actual invoice records.
 * Explicitly distinguishes sufficient data from sparse data.
 */
export function calculateBuyerStatistics(invoices: CustomerInvoice[]): {
  averageDelayDays: number;
  onTimePaymentRate: number;
  totalInvoiced: number;
  outstandingAmount: number;
  overdueCount: number;
  confidenceScore: 'High' | 'Moderate' | 'Insufficient Data';
  confidenceNote: string;
} {
  if (!invoices || invoices.length === 0) {
    return {
      averageDelayDays: 0,
      onTimePaymentRate: 0,
      totalInvoiced: 0,
      outstandingAmount: 0,
      overdueCount: 0,
      confidenceScore: 'Insufficient Data',
      confidenceNote: 'No past invoice records found. Payment delay predictions cannot be empirically verified.',
    };
  }

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.invoiceAmount, 0);
  const totalReceived = invoices.reduce((sum, inv) => sum + inv.amountReceived, 0);
  const outstandingAmount = Math.max(0, totalInvoiced - totalReceived);
  const overdueCount = invoices.filter((inv) => inv.status === 'Overdue').length;

  const paidInvoices = invoices.filter((inv) => inv.status === 'Paid');
  const onTimeCount = paidInvoices.filter((inv) => inv.daysOverdue <= 0).length;
  const onTimePaymentRate =
    paidInvoices.length > 0
      ? Number(((onTimeCount / paidInvoices.length) * 100).toFixed(1))
      : 0;

  const totalDelayDays = paidInvoices.reduce((sum, inv) => sum + inv.daysOverdue, 0);
  const averageDelayDays =
    paidInvoices.length > 0 ? Math.round(totalDelayDays / paidInvoices.length) : 0;

  let confidenceScore: 'High' | 'Moderate' | 'Insufficient Data' = 'Insufficient Data';
  let confidenceNote = '';

  if (invoices.length >= 8) {
    confidenceScore = 'High';
    confidenceNote = `Based on ${invoices.length} verified historical invoices across 12+ months.`;
  } else if (invoices.length >= 3) {
    confidenceScore = 'Moderate';
    confidenceNote = `Based on ${invoices.length} historical records. Trends may have higher variance.`;
  } else {
    confidenceScore = 'Insufficient Data';
    confidenceNote = `Only ${invoices.length} invoice record(s) available. Historical delay averages are indicative only.`;
  }

  return {
    averageDelayDays,
    onTimePaymentRate,
    totalInvoiced,
    outstandingAmount,
    overdueCount,
    confidenceScore,
    confidenceNote,
  };
}

/**
 * Evaluates the 5-Pillar Financial Dependency and Risk Assessment:
 * 1. Customer Dependency
 * 2. Supplier Dependency
 * 3. Cash-flow Dependency
 * 4. Operational Dependency
 * 5. Financial Dependency
 */
export function calculateRiskAssessment(params: {
  orderValue: number;
  grossContribution: number;
  marginPct: number;
  upfrontCashRequired: number;
  workingCapitalGap: number;
  peakCashDeficit: number;
  customerHistory: { averageDelayDays: number; invoiceCount: number; onTimeRate: number };
  customerShareOfTotalRevenuePct: number;
  primarySupplierSpendPct: number;
  supplierCreditDays: number;
  capacityRequiredUnits: number;
  businessCapacityUnits: number;
  currentCapacityPct: number;
  availableCash: number;
  existingMonthlyEmi: number;
  monthlyRevenue: number;
}): RiskAssessment {
  const {
    orderValue,
    marginPct,
    workingCapitalGap,
    peakCashDeficit,
    customerHistory,
    customerShareOfTotalRevenuePct,
    primarySupplierSpendPct,
    supplierCreditDays,
    capacityRequiredUnits,
    businessCapacityUnits,
    currentCapacityPct,
    availableCash,
    existingMonthlyEmi,
    monthlyRevenue,
  } = params;

  // 1. Customer Dependency
  let custLevel: RiskLevel = 'Low';
  let custExp = 'Customer represents a healthy diversification share with prompt settlement history.';
  if (customerShareOfTotalRevenuePct > 45 || customerHistory.averageDelayDays > 45) {
    custLevel = 'Critical';
    custExp = `Extreme concentration: Represents ${customerShareOfTotalRevenuePct}% of annual sales with historical delays of ${customerHistory.averageDelayDays} days.`;
  } else if (customerShareOfTotalRevenuePct > 30 || customerHistory.averageDelayDays > 25) {
    custLevel = 'High';
    custExp = `High concentration risk: Account represents ${customerShareOfTotalRevenuePct}% of turnover.`;
  } else if (customerShareOfTotalRevenuePct > 15 || customerHistory.averageDelayDays > 10) {
    custLevel = 'Moderate';
    custExp = `Moderate exposure: Moderate payment drift observed on recent invoices.`;
  }

  // 2. Supplier Dependency
  let suppLevel: RiskLevel = 'Low';
  let suppExp = 'Raw materials sourced across multiple vendors with standard 30-day credit windows.';
  if (primarySupplierSpendPct > 70 && supplierCreditDays < 10) {
    suppLevel = 'Critical';
    suppExp = `Single vendor monopolizes ${primarySupplierSpendPct}% of material supply with near-zero credit terms.`;
  } else if (primarySupplierSpendPct > 55 || supplierCreditDays < 15) {
    suppLevel = 'High';
    suppExp = `Primary supplier controls ${primarySupplierSpendPct}% of input materials. Supplier delays directly freeze production.`;
  } else if (primarySupplierSpendPct > 35) {
    suppLevel = 'Moderate';
    suppExp = `Noticeable supplier concentration. Price volatility could erode contribution margin.`;
  }

  // 3. Cash-Flow Dependency
  let cashLevel: RiskLevel = 'Low';
  let cashExp = 'Available liquid reserves and initial advance cover upfront manufacturing milestones comfortably.';
  if (peakCashDeficit > availableCash * 1.2) {
    cashLevel = 'Critical';
    cashExp = `Substantial cash deficit: Negative cash balance anticipated before buyer settlements arrive.`;
  } else if (peakCashDeficit > 0 || workingCapitalGap > availableCash * 0.8) {
    cashLevel = 'High';
    cashExp = `Working capital gap exceeds safe operating buffer. Liquidity crunch likely midway through execution.`;
  } else if (workingCapitalGap > 0) {
    cashLevel = 'Moderate';
    cashExp = `Tight liquidity: Operating buffer dips near zero prior to order delivery.`;
  }

  // 4. Operational Dependency
  const orderUtilisationImpactPct =
    businessCapacityUnits > 0 ? (capacityRequiredUnits / businessCapacityUnits) * 100 : 0;
  const projectedTotalUtilisation = currentCapacityPct + orderUtilisationImpactPct;

  let operLevel: RiskLevel = 'Low';
  let operExp = `Total shop floor utilisation remains manageable at ${projectedTotalUtilisation.toFixed(1)}%.`;
  if (projectedTotalUtilisation > 100) {
    operLevel = 'Critical';
    operExp = `Capacity Overload: New order demands ${orderUtilisationImpactPct.toFixed(1)}% capacity, pushing total plant load to ${projectedTotalUtilisation.toFixed(1)}%. Delivery deadlines will breach without overtime.`;
  } else if (projectedTotalUtilisation > 88) {
    operLevel = 'High';
    operExp = `Tight floor constraint: Factory reaches ${projectedTotalUtilisation.toFixed(1)}% capacity. Zero cushion for machine breakdown.`;
  } else if (projectedTotalUtilisation > 75) {
    operLevel = 'Moderate';
    operExp = `Moderate capacity stretch. Second shift or weekend shifts may be required.`;
  }

  // 5. Financial Dependency
  const emiToRevenuePct = monthlyRevenue > 0 ? (existingMonthlyEmi / monthlyRevenue) * 100 : 0;
  let finLevel: RiskLevel = 'Low';
  let finExp = 'Existing debt obligations are well proportioned to cash inflows.';
  if (emiToRevenuePct > 35 || marginPct < 15) {
    finLevel = 'Critical';
    finExp = `Debt service burden consumes ${emiToRevenuePct.toFixed(1)}% of revenue. Razor-thin margin leaves no safety net for late payments.`;
  } else if (emiToRevenuePct > 22 || marginPct < 22) {
    finLevel = 'High';
    finExp = `Monthly EMI burden of ₹${existingMonthlyEmi.toLocaleString('en-IN')} limits debt capacity for new credit facilities.`;
  } else if (emiToRevenuePct > 15) {
    finLevel = 'Moderate';
    finExp = `Existing loan repayments represent ${emiToRevenuePct.toFixed(1)}% of turnover.`;
  }

  // Overall Risk Rating
  const levels = [custLevel, suppLevel, cashLevel, operLevel, finLevel];
  let overallRating: RiskLevel = 'Low';
  if (levels.includes('Critical')) {
    overallRating = 'Critical';
  } else if (levels.filter((l) => l === 'High').length >= 2 || cashLevel === 'High') {
    overallRating = 'High';
  } else if (levels.includes('Moderate') || levels.includes('High')) {
    overallRating = 'Moderate';
  }

  let decisionRecommendation: 'Proceed with Precaution' | 'Restructure Payment Terms' | 'Secure Bridge Financing' | 'High Financial Stress Expected' = 'Proceed with Precaution';
  if (overallRating === 'Critical') {
    decisionRecommendation = 'High Financial Stress Expected';
  } else if (cashLevel === 'High' || cashLevel === 'Critical') {
    decisionRecommendation = 'Secure Bridge Financing';
  } else if (custLevel === 'High' || suppLevel === 'High') {
    decisionRecommendation = 'Restructure Payment Terms';
  }

  return {
    overallRating,
    overallSummary:
      overallRating === 'Critical'
        ? 'Severe financial stress identified. Order carries positive gross contribution but will create an acute liquidity deficit before buyer receivables arrive.'
        : overallRating === 'High'
        ? 'Notable financial pressure detected. Safe execution requires renegotiating buyer credit days or securing purchase order financing.'
        : overallRating === 'Moderate'
        ? 'Acceptable business risk with manageable operational and working capital considerations.'
        : 'Financially sound opportunity. Operating margins and existing liquidity accommodate order fulfillment smoothly.',
    customerDependency: {
      rating: custLevel,
      title: 'Buyer Concentration & Payment Discipline',
      explanation: custExp,
      supportingFigures: [
        { label: 'Revenue Share', value: `${customerShareOfTotalRevenuePct}%`, benchmark: '< 25%' },
        { label: 'Avg Payment Delay', value: `${customerHistory.averageDelayDays} days`, benchmark: '< 15 days' },
        { label: 'Historical Invoices', value: `${customerHistory.invoiceCount} records` },
      ],
      dataSource: 'Uploaded Customer Ledger & Historical Invoices',
      potentialImpact: 'Delayed receipts push closing cash into overdraft for 2-4 weeks.',
      recommendedAction: 'Mandate 25-30% advance deposit or letter of credit before commencing material purchases.',
      confidence: customerHistory.invoiceCount >= 5 ? 'High' : 'Moderate',
    },
    supplierDependency: {
      rating: suppLevel,
      title: 'Vendor Sourcing & Credit Terms',
      explanation: suppExp,
      supportingFigures: [
        { label: 'Lead Vendor Spend', value: `${primarySupplierSpendPct}%`, benchmark: '< 50%' },
        { label: 'Vendor Credit Days', value: `${supplierCreditDays} days`, benchmark: '> 21 days' },
      ],
      dataSource: 'Supplier Profile & Quotations',
      potentialImpact: 'Strict vendor payment milestones force early cash outflow before product delivery.',
      recommendedAction: 'Negotiate 30-day supplier credit or split procurement between two vendors.',
      confidence: 'High',
    },
    cashFlowDependency: {
      rating: cashLevel,
      title: 'Working Capital & Liquidity Gap',
      explanation: cashExp,
      supportingFigures: [
        { label: 'Working Capital Gap', value: `₹${workingCapitalGap.toLocaleString('en-IN')}` },
        { label: 'Peak Cash Deficit', value: `₹${peakCashDeficit.toLocaleString('en-IN')}` },
        { label: 'Available Cash Buffer', value: `₹${availableCash.toLocaleString('en-IN')}` },
      ],
      dataSource: 'Cash Flow Timeline Engine',
      potentialImpact: 'Inability to disburse payroll or utility dues midway through production.',
      recommendedAction: 'Utilize PO financing, Bill Discounting, or MUDRA working capital facility.',
      confidence: 'High',
    },
    operationalDependency: {
      rating: operLevel,
      title: 'Shop Floor & Capacity Headroom',
      explanation: operExp,
      supportingFigures: [
        { label: 'Baseline Plant Load', value: `${currentCapacityPct}%`, benchmark: '< 80%' },
        { label: 'Order Capacity Load', value: `${orderUtilisationImpactPct.toFixed(1)}%` },
        { label: 'Projected Peak Load', value: `${projectedTotalUtilisation.toFixed(1)}%`, benchmark: '< 90%' },
      ],
      dataSource: 'Business Operations Survey',
      potentialImpact: 'Overtime labour charges increase direct cost by 8-12%, eroding margin.',
      recommendedAction: 'Stagger delivery batches across two shipments rather than a single lump sum delivery.',
      confidence: 'High',
    },
    financialDependency: {
      rating: finLevel,
      title: 'Debt Obligations & Contribution Buffer',
      explanation: finExp,
      supportingFigures: [
        { label: 'Contribution Margin', value: `${marginPct}%`, benchmark: '> 25%' },
        { label: 'Monthly EMI Load', value: `₹${existingMonthlyEmi.toLocaleString('en-IN')}` },
        { label: 'Debt to Revenue', value: `${emiToRevenuePct.toFixed(1)}%`, benchmark: '< 20%' },
      ],
      dataSource: 'Financial Profile & Loan Records',
      potentialImpact: 'Failure to service existing EMI could damage bank credit score (CIBIL MSME).',
      recommendedAction: 'Ring-fence current operational cash reserves strictly for recurring EMI debits.',
      confidence: 'High',
    },
    decisionRecommendation,
  };
}
