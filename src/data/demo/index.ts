import {
  Business,
  BusinessFinancials,
  BusinessOperations,
  Customer,
  CustomerInvoice,
  Supplier,
  Opportunity,
} from '@/types';
import {
  calculateOpportunityEconomics,
  generateCashFlowTimeline,
  calculateRiskAssessment,
} from '@/lib/calculations/financial';

export interface DemoWorkspace {
  business: Business;
  financials: BusinessFinancials;
  operations: BusinessOperations;
  customers: Customer[];
  invoices: CustomerInvoice[];
  suppliers: Supplier[];
  activeOpportunities: Opportunity[];
  baselineCash: number;
}

// --------------------------------------------------------------------------
// BUSINESS 1: SRI TEXTILES (Madurai, Tamil Nadu)
// --------------------------------------------------------------------------
const sriBusiness: Business = {
  id: 'biz-sri-textiles',
  userId: 'user-demo-sri',
  businessName: 'Sri Textiles',
  tradeName: 'Sri Weaving & Dyeing Mills',
  udyamRegNumber: 'UDYAM-TN-12-0048291',
  panNumber: 'AAFFS4921K',
  gstin: '33AAFFS4921K1ZM',
  businessType: 'Proprietorship',
  industry: 'Textile Manufacturing',
  subCategory: 'Yarn Dyeing & Cotton Grey Fabrics',
  locationCity: 'Madurai',
  locationState: 'Tamil Nadu',
  establishedYear: 2018,
  employeeCount: 12,
  isDemo: true,
};

const sriFinancials: BusinessFinancials = {
  businessId: 'biz-sri-textiles',
  averageMonthlyRevenue: 1850000,
  averageMonthlyExpenses: 1520000,
  availableCash: 280000,
  existingLoanOutstanding: 1450000,
  monthlyEmiObligations: 38000,
  accountsReceivable: 920000,
  accountsPayable: 610000,
  monthlyFixedOverheads: 110000,
  monthlyPayroll: 180000,
};

const sriOperations: BusinessOperations = {
  businessId: 'biz-sri-textiles',
  monthlyCapacityUnits: 3500, // meters of woven fabric
  currentCapacityUtilisationPct: 72.0,
  standardLeadTimeDays: 24,
  workforceShiftCount: 1,
  machineryCount: 8,
};

const sriCustomers: Customer[] = [
  {
    id: 'cust-chennai-apparel',
    businessId: 'biz-sri-textiles',
    name: 'Chennai Garment Exporters Pvt Ltd',
    category: 'Corporate / Tier-1',
    standardCreditDays: 45,
    contactPerson: 'K. Rajagopalan',
    email: 'k.raja@chennaigarments.in',
    phone: '+91 94432 11098',
    totalInvoiced: 4850000,
    outstandingAmount: 640000,
    averagePaymentDelayDays: 28,
    onTimePaymentRate: 62.5,
    historicalInvoiceCount: 8,
    confidenceScore: 'High',
  },
  {
    id: 'cust-erode-retail',
    businessId: 'biz-sri-textiles',
    name: 'Kongu Cotton Trading Co',
    category: 'Mid-Market Enterprise',
    standardCreditDays: 30,
    contactPerson: 'S. Shanmugam',
    email: 'shanmugam@kongucotton.com',
    phone: '+91 98421 77654',
    totalInvoiced: 2100000,
    outstandingAmount: 280000,
    averagePaymentDelayDays: 12,
    onTimePaymentRate: 85.0,
    historicalInvoiceCount: 6,
    confidenceScore: 'Moderate',
  },
];

const sriInvoices: CustomerInvoice[] = [
  {
    id: 'inv-sri-001',
    invoiceNumber: 'INV/2026/088',
    customerId: 'cust-chennai-apparel',
    customerName: 'Chennai Garment Exporters Pvt Ltd',
    invoiceDate: '2026-08-10',
    dueDate: '2026-09-24',
    actualPaymentDate: '2026-10-22',
    invoiceAmount: 720000,
    amountReceived: 720000,
    status: 'Paid',
    daysOverdue: 28,
  },
  {
    id: 'inv-sri-002',
    invoiceNumber: 'INV/2026/094',
    customerId: 'cust-chennai-apparel',
    customerName: 'Chennai Garment Exporters Pvt Ltd',
    invoiceDate: '2026-09-15',
    dueDate: '2026-10-30',
    actualPaymentDate: '2026-11-28',
    invoiceAmount: 650000,
    amountReceived: 650000,
    status: 'Paid',
    daysOverdue: 29,
  },
  {
    id: 'inv-sri-003',
    invoiceNumber: 'INV/2026/102',
    customerId: 'cust-chennai-apparel',
    customerName: 'Chennai Garment Exporters Pvt Ltd',
    invoiceDate: '2026-10-05',
    dueDate: '2026-11-19',
    actualPaymentDate: undefined,
    invoiceAmount: 640000,
    amountReceived: 0,
    status: 'Overdue',
    daysOverdue: 14,
  },
  {
    id: 'inv-sri-004',
    invoiceNumber: 'INV/2026/082',
    customerId: 'cust-erode-retail',
    customerName: 'Kongu Cotton Trading Co',
    invoiceDate: '2026-08-01',
    dueDate: '2026-08-31',
    actualPaymentDate: '2026-09-12',
    invoiceAmount: 380000,
    amountReceived: 380000,
    status: 'Paid',
    daysOverdue: 12,
  },
  {
    id: 'inv-sri-005',
    invoiceNumber: 'INV/2026/099',
    customerId: 'cust-erode-retail',
    customerName: 'Kongu Cotton Trading Co',
    invoiceDate: '2026-10-18',
    dueDate: '2026-11-17',
    actualPaymentDate: undefined,
    invoiceAmount: 280000,
    amountReceived: 0,
    status: 'Pending',
    daysOverdue: 0,
  },
];

const sriSuppliers: Supplier[] = [
  {
    id: 'supp-spn-spinners',
    businessId: 'biz-sri-textiles',
    name: 'Meenakshi Spinning Mills',
    materialCategory: 'Cotton Combed Yarn (40s & 60s Count)',
    creditPeriodDays: 15,
    advancePaymentRequiredPct: 40.0,
    leadTimeDays: 6,
    annualSpend: 5400000,
    isSingleSource: true,
  },
  {
    id: 'supp-dye-chem',
    businessId: 'biz-sri-textiles',
    name: 'Vasantha Specialty Chemicals & Dyes',
    materialCategory: 'Azo-Free Reactive Dyes & Fixers',
    creditPeriodDays: 30,
    advancePaymentRequiredPct: 0.0,
    leadTimeDays: 3,
    annualSpend: 980000,
    isSingleSource: false,
  },
];

// Calculate Opportunity Economics for Sri Textiles ₹15 Lakh Order
const sriOrderCosts = calculateOpportunityEconomics({
  totalOrderValue: 1500000,
  advancePercentage: 15, // 15% advance = ₹2,25,000
  rawMaterialCost: 600000,
  labourCost: 200000,
  productionExpenses: 50000,
  packagingCost: 20000,
  transportationLogistics: 30000,
  electricityUtilities: 0,
  otherDirectCosts: 0,
  allocatedOverheads: 75000,
  estimatedFinancingCost: 22000,
  availableCash: sriFinancials.availableCash,
  supplierCreditDays: 15,
});

const sriCashFlowEngine = generateCashFlowTimeline({
  orderDate: '2026-11-25',
  deliveryDeadline: '2026-12-24',
  totalOrderValue: 1500000,
  advancePercentage: 15,
  paymentTermsDays: 45,
  paymentDelayDays: 28, // Based on Chennai Garment Exporters avg historical delay
  costs: sriOrderCosts,
  baselineCash: sriFinancials.availableCash,
  monthlyEmi: sriFinancials.monthlyEmiObligations,
  monthlyFixedOverhead: sriFinancials.monthlyFixedOverheads,
});

const sriRisk = calculateRiskAssessment({
  orderValue: 1500000,
  grossContribution: sriOrderCosts.grossContribution,
  marginPct: sriOrderCosts.contributionMarginPct,
  upfrontCashRequired: sriOrderCosts.upfrontCashRequired,
  workingCapitalGap: sriOrderCosts.workingCapitalGap,
  peakCashDeficit: sriCashFlowEngine.peakCashDeficit,
  customerHistory: { averageDelayDays: 28, invoiceCount: 8, onTimeRate: 62.5 },
  customerShareOfTotalRevenuePct: 34.0,
  primarySupplierSpendPct: 68.0,
  supplierCreditDays: 15,
  capacityRequiredUnits: 850,
  businessCapacityUnits: sriOperations.monthlyCapacityUnits,
  currentCapacityPct: sriOperations.currentCapacityUtilisationPct,
  availableCash: sriFinancials.availableCash,
  existingMonthlyEmi: sriFinancials.monthlyEmiObligations,
  monthlyRevenue: sriFinancials.averageMonthlyRevenue,
});

const sriOpportunity: Opportunity = {
  id: 'opp-sri-po-8821',
  businessId: 'biz-sri-textiles',
  title: 'PO #CG-2026/8821: 100% Combed Cotton Premium Shirting Fabric',
  buyerName: 'Chennai Garment Exporters Pvt Ltd',
  customerId: 'cust-chennai-apparel',
  status: 'Evaluating',
  createdAt: '2026-11-20T10:30:00Z',
  purchaseOrder: {
    id: 'po-sri-8821',
    poNumber: 'PO-CG-2026/8821',
    orderDate: '2026-11-25',
    deliveryDeadline: '2026-12-24',
    deliveryLocation: 'Warehouse 4, MEPZ SEZ, Tambaram, Chennai',
    buyerName: 'Chennai Garment Exporters Pvt Ltd',
    buyerGst: '33AABCC1234F1Z5',
    totalOrderValue: 1500000,
    advanceAmount: 225000,
    advancePercentage: 15,
    balanceAmount: 1275000,
    paymentTermsDays: 45, // 45 days after delivery inspection
    penaltyClauseText: '0.5% per week of delay up to a maximum cap of 5% total PO value',
    penaltyPerDayPct: 0.07,
    taxRatePct: 5.0, // 5% GST on fabric
    items: [
      {
        id: 'item-1',
        description: '60s Combed Cotton Compact Woven Twill Fabric (Dyed Sky Blue)',
        quantity: 5000,
        unit: 'Meters',
        unitPrice: 180,
        totalAmount: 900000,
      },
      {
        id: 'item-2',
        description: '40s Oxford Weave Premium White Shirting Fabric',
        quantity: 4000,
        unit: 'Meters',
        unitPrice: 150,
        totalAmount: 600000,
      },
    ],
    sourceType: 'pdf_upload',
    extractionConfidence: {
      overall: 94,
      buyerName: { value: 'Chennai Garment Exporters Pvt Ltd', confidence: 98, isExtracted: true },
      totalOrderValue: { value: 1500000, confidence: 96, isExtracted: true },
      deliveryDeadline: { value: '2026-12-24', confidence: 92, isExtracted: true },
      paymentTerms: { value: '45 Days post-delivery inspection', confidence: 95, isExtracted: true },
      advanceAmount: { value: 225000, confidence: 89, isExtracted: true },
    },
  },
  costs: sriOrderCosts,
  paymentSchedule: sriCashFlowEngine.timeline.flatMap((t) => t.events),
  riskAssessment: sriRisk,
  operationalImpact: {
    unitsRequired: 850,
    capacityIncreasePct: 24.3,
    projectedTotalUtilisationPct: 96.3,
    isOverCapacity: false,
    leadTimeFeasibility: 'Tight Schedule',
  },
};

// --------------------------------------------------------------------------
// BUSINESS 2: KOVAI PRECISION ENGINEERING (Coimbatore, Tamil Nadu)
// --------------------------------------------------------------------------
const kovaiBusiness: Business = {
  id: 'biz-kovai-precision',
  userId: 'user-demo-kovai',
  businessName: 'Kovai Precision Engineering',
  tradeName: 'Kovai CNC Auto Components',
  udyamRegNumber: 'UDYAM-TN-03-0092147',
  panNumber: 'AACCK8812L',
  gstin: '33AACCK8812L1ZP',
  businessType: 'Private Limited',
  industry: 'Light Engineering',
  subCategory: 'CNC Machined Automotive Flanges & Valve Bodies',
  locationCity: 'Coimbatore',
  locationState: 'Tamil Nadu',
  establishedYear: 2015,
  employeeCount: 18,
  isDemo: true,
};

const kovaiFinancials: BusinessFinancials = {
  businessId: 'biz-kovai-precision',
  averageMonthlyRevenue: 3400000,
  averageMonthlyExpenses: 2850000,
  availableCash: 420000,
  existingLoanOutstanding: 2800000,
  monthlyEmiObligations: 62000,
  accountsReceivable: 1450000,
  accountsPayable: 980000,
  monthlyFixedOverheads: 185000,
  monthlyPayroll: 310000,
};

const kovaiOperations: BusinessOperations = {
  businessId: 'biz-kovai-precision',
  monthlyCapacityUnits: 4800,
  currentCapacityUtilisationPct: 68.0,
  standardLeadTimeDays: 28,
  workforceShiftCount: 2,
  machineryCount: 6,
};

const kovaiCustomers: Customer[] = [
  {
    id: 'cust-tvs-tier1',
    businessId: 'biz-kovai-precision',
    name: 'Sundaram Auto Ancillaries Ltd',
    category: 'Corporate / Tier-1',
    standardCreditDays: 60,
    contactPerson: 'M. Sridhar',
    email: 'm.sridhar@sundaramauto.co.in',
    phone: '+91 98940 33210',
    totalInvoiced: 7800000,
    outstandingAmount: 950000,
    averagePaymentDelayDays: 34,
    onTimePaymentRate: 50.0,
    historicalInvoiceCount: 10,
    confidenceScore: 'High',
  },
];

const kovaiSuppliers: Supplier[] = [
  {
    id: 'supp-steel-forgings',
    businessId: 'biz-kovai-precision',
    name: 'Salem Alloy Steel & Forgings Ltd',
    materialCategory: 'EN8D & EN19 Carbon Alloy Steel Billets',
    creditPeriodDays: 21,
    advancePaymentRequiredPct: 30.0,
    leadTimeDays: 10,
    annualSpend: 9500000,
    isSingleSource: true,
  },
];

const kovaiOrderCosts = calculateOpportunityEconomics({
  totalOrderValue: 2850000,
  advancePercentage: 10,
  rawMaterialCost: 1420000,
  labourCost: 480000,
  productionExpenses: 110000,
  packagingCost: 40000,
  transportationLogistics: 50000,
  electricityUtilities: 100000,
  otherDirectCosts: 0,
  allocatedOverheads: 120000,
  estimatedFinancingCost: 35000,
  availableCash: kovaiFinancials.availableCash,
  supplierCreditDays: 21,
});

const kovaiCashFlowEngine = generateCashFlowTimeline({
  orderDate: '2026-11-20',
  deliveryDeadline: '2026-12-30',
  totalOrderValue: 2850000,
  advancePercentage: 10,
  paymentTermsDays: 60,
  paymentDelayDays: 34,
  costs: kovaiOrderCosts,
  baselineCash: kovaiFinancials.availableCash,
  monthlyEmi: kovaiFinancials.monthlyEmiObligations,
  monthlyFixedOverhead: kovaiFinancials.monthlyFixedOverheads,
});

const kovaiRisk = calculateRiskAssessment({
  orderValue: 2850000,
  grossContribution: kovaiOrderCosts.grossContribution,
  marginPct: kovaiOrderCosts.contributionMarginPct,
  upfrontCashRequired: kovaiOrderCosts.upfrontCashRequired,
  workingCapitalGap: kovaiOrderCosts.workingCapitalGap,
  peakCashDeficit: kovaiCashFlowEngine.peakCashDeficit,
  customerHistory: { averageDelayDays: 34, invoiceCount: 10, onTimeRate: 50.0 },
  customerShareOfTotalRevenuePct: 42.0,
  primarySupplierSpendPct: 75.0,
  supplierCreditDays: 21,
  capacityRequiredUnits: 1200,
  businessCapacityUnits: kovaiOperations.monthlyCapacityUnits,
  currentCapacityPct: kovaiOperations.currentCapacityUtilisationPct,
  availableCash: kovaiFinancials.availableCash,
  existingMonthlyEmi: kovaiFinancials.monthlyEmiObligations,
  monthlyRevenue: kovaiFinancials.averageMonthlyRevenue,
});

const kovaiOpportunity: Opportunity = {
  id: 'opp-kovai-po-4412',
  businessId: 'biz-kovai-precision',
  title: 'PO #SAA-2026/4412: High-Pressure Hydraulic Flanges (Batch Q4)',
  buyerName: 'Sundaram Auto Ancillaries Ltd',
  customerId: 'cust-tvs-tier1',
  status: 'Evaluating',
  createdAt: '2026-11-18T14:15:00Z',
  purchaseOrder: {
    id: 'po-kovai-4412',
    poNumber: 'PO-SAA-2026/4412',
    orderDate: '2026-11-20',
    deliveryDeadline: '2026-12-30',
    deliveryLocation: 'Ancillary Complex, Hosur, Tamil Nadu',
    buyerName: 'Sundaram Auto Ancillaries Ltd',
    buyerGst: '33AABCS9981K1Z2',
    totalOrderValue: 2850000,
    advanceAmount: 285000,
    advancePercentage: 10,
    balanceAmount: 2565000,
    paymentTermsDays: 60,
    penaltyClauseText: '1% per week of delivery delay; vendor bears transit rejection costs',
    penaltyPerDayPct: 0.14,
    taxRatePct: 18.0,
    items: [
      {
        id: 'item-kov-1',
        description: 'CNC Machined Grade-EN19 Hydraulic Flanges (Dia 140mm)',
        quantity: 1500,
        unit: 'Pieces',
        unitPrice: 1900,
        totalAmount: 2850000,
      },
    ],
    sourceType: 'pdf_upload',
    extractionConfidence: {
      overall: 96,
      buyerName: { value: 'Sundaram Auto Ancillaries Ltd', confidence: 99, isExtracted: true },
      totalOrderValue: { value: 2850000, confidence: 97, isExtracted: true },
      deliveryDeadline: { value: '2026-12-30', confidence: 95, isExtracted: true },
      paymentTerms: { value: '60 Days after Goods Receipt Note (GRN)', confidence: 94, isExtracted: true },
      advanceAmount: { value: 285000, confidence: 91, isExtracted: true },
    },
  },
  costs: kovaiOrderCosts,
  paymentSchedule: kovaiCashFlowEngine.timeline.flatMap((t) => t.events),
  riskAssessment: kovaiRisk,
  operationalImpact: {
    unitsRequired: 1200,
    capacityIncreasePct: 25.0,
    projectedTotalUtilisationPct: 93.0,
    isOverCapacity: false,
    leadTimeFeasibility: 'Tight Schedule',
  },
};

// --------------------------------------------------------------------------
// BUSINESS 3: TRICHY NATURAL FOOD PROCESSING (Tiruchirappalli, Tamil Nadu)
// --------------------------------------------------------------------------
const trichyBusiness: Business = {
  id: 'biz-trichy-foods',
  userId: 'user-demo-trichy',
  businessName: 'Trichy Natural Food Processing',
  tradeName: 'Kaveri Agro Organics',
  udyamRegNumber: 'UDYAM-TN-27-0033108',
  panNumber: 'AAKPK3390F',
  gstin: '33AAKPK3390F1Z4',
  businessType: 'Partnership',
  industry: 'Food Processing',
  subCategory: 'Cold Pressed Sesame & Groundnut Oils',
  locationCity: 'Tiruchirappalli',
  locationState: 'Tamil Nadu',
  establishedYear: 2021,
  employeeCount: 9,
  isDemo: true,
};

const trichyFinancials: BusinessFinancials = {
  businessId: 'biz-trichy-foods',
  averageMonthlyRevenue: 1150000,
  averageMonthlyExpenses: 980000,
  availableCash: 190000,
  existingLoanOutstanding: 750000,
  monthlyEmiObligations: 21000,
  accountsReceivable: 410000,
  accountsPayable: 340000,
  monthlyFixedOverheads: 72000,
  monthlyPayroll: 95000,
};

const trichyOperations: BusinessOperations = {
  businessId: 'biz-trichy-foods',
  monthlyCapacityUnits: 6000, // Litres
  currentCapacityUtilisationPct: 60.0,
  standardLeadTimeDays: 14,
  workforceShiftCount: 1,
  machineryCount: 4,
};

const trichyCustomers: Customer[] = [
  {
    id: 'cust-nilgiris-chain',
    businessId: 'biz-trichy-foods',
    name: 'Southern Spice & Grocery Marts',
    category: 'Retailer / Distributor',
    standardCreditDays: 30,
    contactPerson: 'P. Murugan',
    email: 'p.murugan@southernspice.co.in',
    phone: '+91 97870 55432',
    totalInvoiced: 1650000,
    outstandingAmount: 210000,
    averagePaymentDelayDays: 16,
    onTimePaymentRate: 75.0,
    historicalInvoiceCount: 5,
    confidenceScore: 'Moderate',
  },
];

const trichySuppliers: Supplier[] = [
  {
    id: 'supp-oilseeds-fpo',
    businessId: 'biz-trichy-foods',
    name: 'Thanjavur Delta Farmers Producer Co (FPO)',
    materialCategory: 'Organic Sesame & Groundnut Pods',
    creditPeriodDays: 7, // Agriculture cash-settled procurement
    advancePaymentRequiredPct: 60.0,
    leadTimeDays: 4,
    annualSpend: 3800000,
    isSingleSource: true,
  },
];

const trichyOrderCosts = calculateOpportunityEconomics({
  totalOrderValue: 840000,
  advancePercentage: 20,
  rawMaterialCost: 480000,
  labourCost: 75000,
  productionExpenses: 30000,
  packagingCost: 80000,
  transportationLogistics: 45000,
  electricityUtilities: 0,
  otherDirectCosts: 0,
  allocatedOverheads: 40000,
  estimatedFinancingCost: 12000,
  availableCash: trichyFinancials.availableCash,
  supplierCreditDays: 7,
});

const trichyCashFlowEngine = generateCashFlowTimeline({
  orderDate: '2026-11-22',
  deliveryDeadline: '2026-12-18',
  totalOrderValue: 840000,
  advancePercentage: 20,
  paymentTermsDays: 30,
  paymentDelayDays: 16,
  costs: trichyOrderCosts,
  baselineCash: trichyFinancials.availableCash,
  monthlyEmi: trichyFinancials.monthlyEmiObligations,
  monthlyFixedOverhead: trichyFinancials.monthlyFixedOverheads,
});

const trichyRisk = calculateRiskAssessment({
  orderValue: 840000,
  grossContribution: trichyOrderCosts.grossContribution,
  marginPct: trichyOrderCosts.contributionMarginPct,
  upfrontCashRequired: trichyOrderCosts.upfrontCashRequired,
  workingCapitalGap: trichyOrderCosts.workingCapitalGap,
  peakCashDeficit: trichyCashFlowEngine.peakCashDeficit,
  customerHistory: { averageDelayDays: 16, invoiceCount: 5, onTimeRate: 75.0 },
  customerShareOfTotalRevenuePct: 22.0,
  primarySupplierSpendPct: 82.0,
  supplierCreditDays: 7,
  capacityRequiredUnits: 2500,
  businessCapacityUnits: trichyOperations.monthlyCapacityUnits,
  currentCapacityPct: trichyOperations.currentCapacityUtilisationPct,
  availableCash: trichyFinancials.availableCash,
  existingMonthlyEmi: trichyFinancials.monthlyEmiObligations,
  monthlyRevenue: trichyFinancials.averageMonthlyRevenue,
});

const trichyOpportunity: Opportunity = {
  id: 'opp-trichy-po-1109',
  businessId: 'biz-trichy-foods',
  title: 'PO #SS-2026/1109: Premium Wood Pressed Gingelly & Groundnut Oil (5L Cans)',
  buyerName: 'Southern Spice & Grocery Marts',
  customerId: 'cust-nilgiris-chain',
  status: 'Evaluating',
  createdAt: '2026-11-19T09:00:00Z',
  purchaseOrder: {
    id: 'po-trichy-1109',
    poNumber: 'PO-SS-2026/1109',
    orderDate: '2026-11-22',
    deliveryDeadline: '2026-12-18',
    deliveryLocation: 'Regional Distribution Center, Madurai Ring Road',
    buyerName: 'Southern Spice & Grocery Marts',
    buyerGst: '33AAGCS2189M1ZU',
    totalOrderValue: 840000,
    advanceAmount: 168000,
    advancePercentage: 20,
    balanceAmount: 672000,
    paymentTermsDays: 30,
    penaltyClauseText: '0.25% per day past agreed scheduled dispatch',
    penaltyPerDayPct: 0.05,
    taxRatePct: 5.0,
    items: [
      {
        id: 'item-trich-1',
        description: 'Virgin Wood Pressed Gingelly (Sesame) Oil (5-Litre Tin Can)',
        quantity: 300,
        unit: 'Tins',
        unitPrice: 1600,
        totalAmount: 480000,
      },
      {
        id: 'item-trich-2',
        description: 'Traditional Mara Chekku Groundnut Oil (5-Litre Tin Can)',
        quantity: 300,
        unit: 'Tins',
        unitPrice: 1200,
        totalAmount: 360000,
      },
    ],
    sourceType: 'manual_entry',
  },
  costs: trichyOrderCosts,
  paymentSchedule: trichyCashFlowEngine.timeline.flatMap((t) => t.events),
  riskAssessment: trichyRisk,
  operationalImpact: {
    unitsRequired: 2500,
    capacityIncreasePct: 41.6,
    projectedTotalUtilisationPct: 101.6,
    isOverCapacity: true,
    leadTimeFeasibility: 'Bottleneck Warning',
  },
};

// --------------------------------------------------------------------------
// REGISTRY OF ALL DEMO WORKSPACES
// --------------------------------------------------------------------------
export const DEMO_WORKSPACES: Record<string, DemoWorkspace> = {
  'sri-textiles': {
    business: sriBusiness,
    financials: sriFinancials,
    operations: sriOperations,
    customers: sriCustomers,
    invoices: sriInvoices,
    suppliers: sriSuppliers,
    activeOpportunities: [sriOpportunity],
    baselineCash: sriFinancials.availableCash,
  },
  // Backward compatibility alias
  'sana-textiles': {
    business: sriBusiness,
    financials: sriFinancials,
    operations: sriOperations,
    customers: sriCustomers,
    invoices: sriInvoices,
    suppliers: sriSuppliers,
    activeOpportunities: [sriOpportunity],
    baselineCash: sriFinancials.availableCash,
  },
  'kovai-precision': {
    business: kovaiBusiness,
    financials: kovaiFinancials,
    operations: kovaiOperations,
    customers: kovaiCustomers,
    invoices: [],
    suppliers: kovaiSuppliers,
    activeOpportunities: [kovaiOpportunity],
    baselineCash: kovaiFinancials.availableCash,
  },
  'trichy-foods': {
    business: trichyBusiness,
    financials: trichyFinancials,
    operations: trichyOperations,
    customers: trichyCustomers,
    invoices: [],
    suppliers: trichySuppliers,
    activeOpportunities: [trichyOpportunity],
    baselineCash: trichyFinancials.availableCash,
  },
};

export const DEFAULT_DEMO_BUSINESS_ID = 'sri-textiles';

export function getDemoWorkspace(businessId: string = DEFAULT_DEMO_BUSINESS_ID): DemoWorkspace {
  return DEMO_WORKSPACES[businessId] || DEMO_WORKSPACES['sri-textiles'];
}
