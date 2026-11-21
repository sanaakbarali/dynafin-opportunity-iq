export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type OpportunityStatus = 'Evaluating' | 'Accepted' | 'Passed' | 'Negotiating' | 'Archived';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'owner' | 'finance_manager' | 'auditor' | 'viewer';
  isVerified: boolean;
  businessId?: string;
}

export interface Business {
  id: string;
  userId: string;
  businessName: string;
  tradeName?: string;
  udyamRegNumber?: string;
  panNumber?: string;
  gstin?: string;
  businessType: 'Proprietorship' | 'Partnership' | 'Private Limited' | 'LLP' | 'One Person Company';
  industry: string;
  subCategory?: string;
  locationCity: string;
  locationState: string;
  establishedYear: number;
  employeeCount: number;
  isDemo?: boolean;
}

export interface BusinessFinancials {
  businessId: string;
  averageMonthlyRevenue: number;
  averageMonthlyExpenses: number;
  availableCash: number;
  existingLoanOutstanding: number;
  monthlyEmiObligations: number;
  accountsReceivable: number;
  accountsPayable: number;
  monthlyFixedOverheads: number;
  monthlyPayroll: number;
}

export interface BusinessOperations {
  businessId: string;
  monthlyCapacityUnits: number;
  currentCapacityUtilisationPct: number;
  standardLeadTimeDays: number;
  workforceShiftCount: number;
  machineryCount: number;
}

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  invoiceDate: string; // ISO YYYY-MM-DD
  dueDate: string;
  actualPaymentDate?: string;
  invoiceAmount: number;
  amountReceived: number;
  status: 'Paid' | 'Partially Paid' | 'Overdue' | 'Pending';
  daysOverdue: number;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  category: 'Corporate / Tier-1' | 'Mid-Market Enterprise' | 'Government / PSU' | 'Retailer / Distributor' | 'Local MSME';
  standardCreditDays: number;
  contactPerson?: string;
  email?: string;
  phone?: string;
  totalInvoiced: number;
  outstandingAmount: number;
  averagePaymentDelayDays: number;
  onTimePaymentRate: number; // 0 - 100
  historicalInvoiceCount: number;
  confidenceScore: 'High' | 'Moderate' | 'Insufficient Data';
}

export interface Supplier {
  id: string;
  businessId: string;
  name: string;
  materialCategory: string;
  creditPeriodDays: number;
  advancePaymentRequiredPct: number;
  leadTimeDays: number;
  annualSpend: number;
  isSingleSource: boolean;
}

export interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  orderDate: string; // YYYY-MM-DD
  deliveryDeadline: string; // YYYY-MM-DD
  deliveryLocation: string;
  buyerName: string;
  buyerGst?: string;
  totalOrderValue: number;
  advanceAmount: number;
  advancePercentage: number;
  balanceAmount: number;
  paymentTermsDays: number; // e.g. 30 or 60 days post-delivery
  penaltyClauseText?: string;
  penaltyPerDayPct?: number;
  taxRatePct: number;
  items: OrderItem[];
  sourceType: 'pdf_upload' | 'image_upload' | 'manual_entry';
  extractionConfidence?: {
    overall: number; // 0-100
    buyerName: { value: string; confidence: number; isExtracted: boolean };
    totalOrderValue: { value: number; confidence: number; isExtracted: boolean };
    deliveryDeadline: { value: string; confidence: number; isExtracted: boolean };
    paymentTerms: { value: string; confidence: number; isExtracted: boolean };
    advanceAmount: { value: number; confidence: number; isExtracted: boolean };
  };
}

export interface OpportunityCosts {
  rawMaterialCost: number;
  labourCost: number;
  productionExpenses: number;
  packagingCost: number;
  transportationLogistics: number;
  electricityUtilities: number;
  otherDirectCosts: number;
  allocatedOverheads: number;
  estimatedFinancingCost: number;
  // Computed deterministic outputs:
  totalDirectCost: number;
  grossContribution: number;
  contributionMarginPct: number;
  netOperatingSurplus: number;
  upfrontCashRequired: number;
  workingCapitalGap: number;
}

export interface PaymentScheduleItem {
  id: string;
  eventName: string;
  eventType: 'inflow' | 'outflow';
  amount: number;
  scheduledDate: string; // YYYY-MM-DD
  recipientOrSender: string;
  category: 'Customer Advance' | 'Customer Final' | 'Raw Materials' | 'Labour / Payroll' | 'Logistics' | 'Overhead' | 'Financing EMI' | 'Other';
  isConfirmed: boolean;
}

export interface CashFlowTimelinePoint {
  date: string; // YYYY-MM-DD
  label: string;
  openingCash: number;
  inflow: number;
  outflow: number;
  netCashFlow: number;
  closingCash: number;
  events: PaymentScheduleItem[];
  isDeficit: boolean;
}

export interface RiskPillar {
  rating: RiskLevel;
  title: string;
  explanation: string;
  supportingFigures: { label: string; value: string; benchmark?: string }[];
  dataSource: string;
  potentialImpact: string;
  recommendedAction: string;
  confidence: 'High' | 'Moderate' | 'Low / Estimated';
}

export interface RiskAssessment {
  overallRating: RiskLevel;
  overallSummary: string;
  customerDependency: RiskPillar;
  supplierDependency: RiskPillar;
  cashFlowDependency: RiskPillar;
  operationalDependency: RiskPillar;
  financialDependency: RiskPillar;
  decisionRecommendation: 'Proceed with Precaution' | 'Restructure Payment Terms' | 'Secure Bridge Financing' | 'High Financial Stress Expected';
}

export interface ScenarioSimulationInputs {
  buyerPaymentDelayDays: number; // 0, 15, 30, 45, 60, 90
  materialCostInflationPct: number; // 0, 5, 10, 15, 20
  productionCostIncreasePct: number; // 0, 5, 10, 15
  advanceReceivedPct: number; // e.g. from 0% to 50%
  deliveryDelayDays: number; // 0, 7, 14, 30
  orderValueAdjustmentPct: number; // -10% to +10%
}

export interface ScenarioSimulationResult {
  scenarioName: string;
  inputs: ScenarioSimulationInputs;
  simulatedTotalCost: number;
  simulatedGrossContribution: number;
  simulatedMarginPct: number;
  simulatedUpfrontCashRequired: number;
  simulatedWorkingCapitalGap: number;
  simulatedPeakCashDeficit: number;
  simulatedDeficitDate: string;
  simulatedClosingCash: number;
  riskRating: RiskLevel;
  cashFlowTimeline: CashFlowTimelinePoint[];
}

export interface Opportunity {
  id: string;
  businessId: string;
  title: string;
  buyerName: string;
  customerId?: string;
  status: OpportunityStatus;
  createdAt: string;
  purchaseOrder: PurchaseOrder;
  costs: OpportunityCosts;
  paymentSchedule: PaymentScheduleItem[];
  riskAssessment: RiskAssessment;
  operationalImpact: {
    unitsRequired: number;
    capacityIncreasePct: number;
    projectedTotalUtilisationPct: number;
    isOverCapacity: boolean;
    leadTimeFeasibility: 'Feasible' | 'Tight Schedule' | 'Bottleneck Warning';
  };
}

export interface FundingScheme {
  id: string;
  name: string;
  provider: string;
  category: 'Government Scheme' | 'Working Capital / CC' | 'PO Financing' | 'Invoice Discounting / TReDS' | 'Term Loan' | 'Equipment Finance';
  purpose: string;
  eligibility: string;
  limitDisplay: string;
  interestRateDisplay: string;
  collateralRequirement: string;
  repaymentPeriod: string;
  requiredDocuments: string[];
  applicationProcedure: string;
  officialSourceUrl: string;
  isVerified: boolean;
}

export interface LoanReadinessItem {
  id: string;
  documentName: string;
  category: 'Identity & Registration' | 'Financial & Tax' | 'Operational & Commercial' | 'Collateral & Banking';
  status: 'Available' | 'Missing' | 'Incomplete' | 'Needs Review';
  importance: 'Mandatory' | 'Recommended' | 'Conditional';
  notes?: string;
  uploadedAt?: string;
  fileSize?: string;
}

export interface LoanComparisonInput {
  loanAmount: number;
  interestRateAnnualPct: number;
  tenureMonths: number;
  processingFeePct: number;
  collateralType: string;
}

export interface LoanComparisonOutput {
  monthlyEmi: number;
  totalRepayment: number;
  totalInterest: number;
  processingFeeAmount: number;
  totalCostOfCredit: number;
  aprEffectivePct: number;
  schedulePreview: { month: number; emi: number; principal: number; interest: number; balance: number }[];
}

export interface UploadedDocument {
  id: string;
  businessId: string;
  opportunityId?: string;
  fileName: string;
  fileType: 'purchase_order' | 'invoice' | 'supplier_quote' | 'bank_statement' | 'financial_statement' | 'loan_doc' | 'udyam_cert' | 'other';
  fileSizeBytes: number;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'extracted' | 'verified';
  storagePath: string;
  extractedSnippet?: string;
}

export interface FinancialAlertNotification {
  id: string;
  businessId: string;
  opportunityId?: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  metricTrigger: string;
  timestamp: string;
  isRead: boolean;
}
