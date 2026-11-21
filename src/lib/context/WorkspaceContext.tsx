'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import {
  Business,
  BusinessFinancials,
  BusinessOperations,
  Customer,
  Supplier,
  CustomerInvoice,
  Opportunity,
  UserProfile,
  FinancialAlertNotification,
  RiskAssessment,
  ScenarioSimulationInputs,
  ScenarioSimulationResult,
} from '@/types';
import {
  DEMO_WORKSPACES,
  DEFAULT_DEMO_BUSINESS_ID,
  getDemoWorkspace,
} from '@/data/demo';
import {
  calculateOpportunityEconomics,
  generateCashFlowTimeline,
  calculateRiskAssessment,
  simulateScenario,
  computeInvoiceDaysOverdue,
} from '@/lib/calculations/financial';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface WorkspaceContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  activeDemoId: string;
  switchDemoBusiness: (id: string) => void;
  business: Business;
  financials: BusinessFinancials;
  operations: BusinessOperations;
  customers: Customer[];
  suppliers: Supplier[];
  invoices: CustomerInvoice[];
  opportunities: Opportunity[];
  activeOpportunity: Opportunity | null;
  setActiveOpportunityId: (id: string) => void;
  userProfile: UserProfile;
  notifications: FinancialAlertNotification[];
  dismissNotification: (id: string) => void;
  createOpportunity: (opp: Partial<Opportunity>) => Promise<string>;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  runScenario: (inputs: ScenarioSimulationInputs) => ScenarioSimulationResult | null;
  signOut: () => Promise<void>;
  refreshWorkspace: () => Promise<void>;
  saveBusinessProfile: (
    businessData: Partial<Business>,
    financialsData?: Partial<BusinessFinancials>,
    operationsData?: Partial<BusinessOperations>,
    partnersData?: {
      customerName?: string;
      customerCreditDays?: number;
      supplierName?: string;
      supplierCreditDays?: number;
      supplierAdvanceRequiredPct?: number;
    }
  ) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [activeDemoId, setActiveDemoId] = useState<string>(DEFAULT_DEMO_BUSINESS_ID);
  const [workspace, setWorkspace] = useState(() => getDemoWorkspace(DEFAULT_DEMO_BUSINESS_ID));
  const [activeOppId, setActiveOppId] = useState<string>(
    workspace.activeOpportunities[0]?.id || ''
  );

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-demo-sri',
    fullName: 'Senthil Nathan',
    email: 'senthil@sritextiles.in',
    phone: '+91 94432 88123',
    role: 'owner',
    isVerified: true,
  });

  const [notifications, setNotifications] = useState<FinancialAlertNotification[]>([
    {
      id: 'notif-1',
      businessId: 'biz-sri-textiles',
      opportunityId: 'opp-sri-po-8821',
      severity: 'critical',
      title: 'Projected Cash Deficit Detected',
      message: '₹15L PO requires ₹9L upfront cash. At T+42 days, cash balance is projected to reach -₹2,85,000 before buyer payment arrives.',
      metricTrigger: 'cash_deficit',
      timestamp: '2026-11-20T10:45:00Z',
      isRead: false,
    },
    {
      id: 'notif-2',
      businessId: 'biz-sri-textiles',
      opportunityId: 'opp-sri-po-8821',
      severity: 'warning',
      title: 'Historical Buyer Delay Warning',
      message: 'Chennai Garment Exporters averages 28 days of payment delay past contractual credit terms. Factor this delay into your cash buffer.',
      metricTrigger: 'buyer_delay',
      timestamp: '2026-11-20T11:15:00Z',
      isRead: false,
    },
    {
      id: 'notif-3',
      businessId: 'biz-sri-textiles',
      severity: 'info',
      title: 'CGTMSE Pre-qualification Available',
      message: 'Your business qualifies for up to ₹10 Lakhs collateral-free credit under CGTMSE for working capital.',
      metricTrigger: 'funding_match',
      timestamp: '2026-11-20T08:00:00Z',
      isRead: false,
    },
  ]);

  /**
   * Loads authenticated business data from live Supabase PostgreSQL.
   */
  const loadSupabaseWorkspace = useCallback(async (sessionUser: User) => {
    try {
      setIsLoading(true);
      const supabase = getSupabaseBrowserClient();

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (profileData) {
        setUserProfile({
          id: profileData.id,
          fullName: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone || undefined,
          role: profileData.role,
          isVerified: profileData.is_verified,
        });
      }

      // 2. Fetch Business
      const { data: bizList } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', sessionUser.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!bizList || bizList.length === 0) {
        // Authenticated user has not yet completed onboarding
        setIsDemoMode(false);
        setIsLoading(false);
        return;
      }

      const biz = bizList[0];
      const businessId = biz.id;

      // 3. Fetch Financials & Operations in parallel
      const [finRes, opsRes, custRes, suppRes, invRes, oppsRes, notifRes] = await Promise.all([
        supabase.from('business_financials').select('*').eq('business_id', businessId).limit(1),
        supabase.from('business_operations').select('*').eq('business_id', businessId).limit(1),
        supabase.from('customers').select('*').eq('business_id', businessId),
        supabase.from('suppliers').select('*').eq('business_id', businessId),
        supabase.from('customer_invoices_with_overdue').select('*').eq('business_id', businessId),
        supabase.from('opportunities').select(`
          *,
          purchase_orders (*),
          opportunity_costs (*),
          payment_schedules (*),
          risk_assessments (*)
        `).eq('business_id', businessId).order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
      ]);

      const liveFinancials: BusinessFinancials = finRes.data?.[0]
        ? {
            businessId,
            averageMonthlyRevenue: Number(finRes.data[0].average_monthly_revenue),
            averageMonthlyExpenses: Number(finRes.data[0].average_monthly_expenses),
            availableCash: Number(finRes.data[0].available_cash),
            existingLoanOutstanding: Number(finRes.data[0].existing_loan_outstanding),
            monthlyEmiObligations: Number(finRes.data[0].monthly_emi_obligations),
            accountsReceivable: Number(finRes.data[0].accounts_receivable),
            accountsPayable: Number(finRes.data[0].accounts_payable),
            monthlyFixedOverheads: Number(finRes.data[0].monthly_fixed_overheads),
            monthlyPayroll: Number(finRes.data[0].monthly_payroll),
          }
        : workspace.financials;

      const liveOperations: BusinessOperations = opsRes.data?.[0]
        ? {
            businessId,
            monthlyCapacityUnits: opsRes.data[0].monthly_capacity_units,
            currentCapacityUtilisationPct: Number(opsRes.data[0].current_capacity_utilisation_pct),
            standardLeadTimeDays: opsRes.data[0].standard_lead_time_days,
            workforceShiftCount: opsRes.data[0].workforce_shift_count,
            machineryCount: opsRes.data[0].machinery_count,
          }
        : workspace.operations;

      const liveCustomers: Customer[] = (custRes.data || []).map((c: any) => ({
        id: c.id,
        businessId,
        name: c.name,
        category: (c.category as Customer['category']) || 'Mid-Market Enterprise',
        standardCreditDays: c.standard_credit_days || 30,
        contactPerson: c.contact_person || undefined,
        email: c.email || undefined,
        phone: c.phone || undefined,
        totalInvoiced: 0,
        outstandingAmount: 0,
        averagePaymentDelayDays: c.payment_delay_average_days || 15,
        onTimePaymentRate: 85,
        historicalInvoiceCount: 1,
        confidenceScore: 'Moderate',
      }));

      const liveSuppliers: Supplier[] = (suppRes.data || []).map((s: any) => ({
        id: s.id,
        businessId,
        name: s.name,
        materialCategory: s.material_category,
        creditPeriodDays: s.credit_period_days || 15,
        advancePaymentRequiredPct: Number(s.advance_payment_required_pct || 0),
        leadTimeDays: s.lead_time_days || 7,
        annualSpend: 500000,
        isSingleSource: false,
      }));

      const liveInvoices: CustomerInvoice[] = (invRes.data || []).map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        customerId: inv.customer_id,
        customerName: liveCustomers.find((c) => c.id === inv.customer_id)?.name || 'Enterprise Buyer',
        invoiceDate: inv.invoice_date,
        dueDate: inv.due_date,
        actualPaymentDate: inv.actual_payment_date || undefined,
        invoiceAmount: Number(inv.invoice_amount),
        amountReceived: Number(inv.amount_received),
        status: inv.status as CustomerInvoice['status'],
        daysOverdue: Number(inv.days_overdue ?? computeInvoiceDaysOverdue(inv.due_date, inv.actual_payment_date)),
      }));

      // Map Opportunities and reconstruct financial sub-structures
      const liveOpportunities: Opportunity[] = (oppsRes.data || []).map((oppRecord) => {
        const po = oppRecord.purchase_orders?.[0];
        const costRecord = oppRecord.opportunity_costs?.[0];
        const riskRecord = oppRecord.risk_assessments?.[0];

        const purchaseOrder = po
          ? {
              id: po.id,
              poNumber: po.po_number,
              orderDate: po.order_date,
              deliveryDeadline: po.delivery_deadline,
              deliveryLocation: po.delivery_location || '',
              buyerName: oppRecord.buyer_name,
              totalOrderValue: Number(po.total_order_value),
              advanceAmount: Number(po.advance_amount),
              advancePercentage: Number(po.advance_percentage),
              balanceAmount: Number(po.balance_amount),
              paymentTermsDays: po.payment_terms_days,
              penaltyClauseText: po.penalty_clause_text || undefined,
              taxRatePct: Number(po.tax_rate_pct || 18),
              items: Array.isArray(po.items_json) ? (po.items_json as any) : [],
              sourceType: (po.source_type as any) || 'manual_entry',
            }
          : {
              id: `po-${oppRecord.id}`,
              poNumber: 'PO-PENDING',
              orderDate: oppRecord.created_at.split('T')[0],
              deliveryDeadline: oppRecord.created_at.split('T')[0],
              deliveryLocation: '',
              buyerName: oppRecord.buyer_name,
              totalOrderValue: 1000000,
              advanceAmount: 100000,
              advancePercentage: 10,
              balanceAmount: 900000,
              paymentTermsDays: 30,
              taxRatePct: 18,
              items: [],
              sourceType: 'manual_entry' as const,
            };

        const costs = costRecord
          ? {
              rawMaterialCost: Number(costRecord.raw_material_cost),
              labourCost: Number(costRecord.labour_cost),
              productionExpenses: Number(costRecord.production_expenses),
              packagingCost: Number(costRecord.packaging_cost),
              transportationLogistics: Number(costRecord.transportation_logistics),
              electricityUtilities: Number(costRecord.electricity_utilities),
              otherDirectCosts: Number(costRecord.other_direct_costs),
              allocatedOverheads: Number(costRecord.allocated_overheads),
              estimatedFinancingCost: Number(costRecord.estimated_financing_cost),
              totalDirectCost: Number(costRecord.total_direct_cost),
              grossContribution: Number(costRecord.gross_contribution),
              contributionMarginPct: Number(costRecord.contribution_margin_pct),
              netOperatingSurplus: Number(costRecord.gross_contribution) - Number(costRecord.allocated_overheads || 0),
              upfrontCashRequired: Number(costRecord.upfront_cash_required),
              workingCapitalGap: Number(costRecord.working_capital_gap),
            }
          : calculateOpportunityEconomics({
              totalOrderValue: purchaseOrder.totalOrderValue,
              advancePercentage: purchaseOrder.advancePercentage,
              rawMaterialCost: purchaseOrder.totalOrderValue * 0.45,
              labourCost: purchaseOrder.totalOrderValue * 0.15,
              productionExpenses: purchaseOrder.totalOrderValue * 0.05,
              packagingCost: purchaseOrder.totalOrderValue * 0.02,
              transportationLogistics: purchaseOrder.totalOrderValue * 0.03,
              electricityUtilities: 0,
              otherDirectCosts: 0,
              allocatedOverheads: purchaseOrder.totalOrderValue * 0.05,
              estimatedFinancingCost: 15000,
              availableCash: liveFinancials.availableCash,
            });

        const schedules = (oppRecord.payment_schedules || []).map((ps: any) => ({
          date: ps.scheduled_date,
          dayOffset: 0,
          eventName: ps.event_name,
          type: ps.event_type as 'inflow' | 'outflow',
          amount: Number(ps.amount),
          recipientOrSender: ps.recipient_or_sender,
          category: ps.category,
          isConfirmed: ps.is_confirmed || false,
        }));

        const risk: RiskAssessment = riskRecord
          ? {
              overallRating: riskRecord.overall_rating,
              overallSummary: `Risk profile evaluated at ${riskRecord.overall_rating} level based on working capital exposure and supplier/buyer commitments.`,
              customerDependency: riskRecord.customer_dependency_details as any,
              supplierDependency: riskRecord.supplier_dependency_details as any,
              cashFlowDependency: riskRecord.cash_flow_dependency_details as any,
              operationalDependency: riskRecord.operational_dependency_details as any,
              financialDependency: riskRecord.financial_dependency_details as any,
              decisionRecommendation: (Array.isArray(riskRecord.key_recommendations) && riskRecord.key_recommendations[0])
                ? (riskRecord.key_recommendations[0] as any)
                : 'Proceed with Precaution',
            }
          : calculateRiskAssessment({
              orderValue: purchaseOrder.totalOrderValue,
              grossContribution: costs.grossContribution,
              marginPct: costs.contributionMarginPct,
              upfrontCashRequired: costs.upfrontCashRequired,
              workingCapitalGap: costs.workingCapitalGap,
              peakCashDeficit: costs.workingCapitalGap,
              customerHistory: { averageDelayDays: 15, invoiceCount: 1, onTimeRate: 75 },
              customerShareOfTotalRevenuePct: 25,
              primarySupplierSpendPct: 50,
              supplierCreditDays: 15,
              capacityRequiredUnits: 500,
              businessCapacityUnits: liveOperations.monthlyCapacityUnits,
              currentCapacityPct: liveOperations.currentCapacityUtilisationPct,
              availableCash: liveFinancials.availableCash,
              existingMonthlyEmi: liveFinancials.monthlyEmiObligations,
              monthlyRevenue: liveFinancials.averageMonthlyRevenue,
            });

        return {
          id: oppRecord.id,
          businessId,
          title: oppRecord.title,
          buyerName: oppRecord.buyer_name,
          customerId: oppRecord.customer_id || undefined,
          status: oppRecord.status as Opportunity['status'],
          createdAt: oppRecord.created_at,
          purchaseOrder,
          costs,
          paymentSchedule: schedules,
          riskAssessment: risk,
          operationalImpact: {
            unitsRequired: 500,
            capacityIncreasePct: 15,
            projectedTotalUtilisationPct: liveOperations.currentCapacityUtilisationPct + 15,
            isOverCapacity: liveOperations.currentCapacityUtilisationPct + 15 > 100,
            leadTimeFeasibility: 'Feasible',
          },
        };
      });

      const liveNotifications: FinancialAlertNotification[] = (notifRes.data || []).map((n) => ({
        id: n.id,
        businessId: n.business_id,
        opportunityId: n.opportunity_id || undefined,
        severity: n.severity as FinancialAlertNotification['severity'],
        title: n.title,
        message: n.message,
        metricTrigger: n.metric_trigger || undefined,
        timestamp: n.created_at,
        isRead: n.is_read || false,
      }));

      // Update workspace state with live Supabase tenant data
      setWorkspace({
        business: {
          id: biz.id,
          userId: biz.user_id,
          businessName: biz.business_name,
          tradeName: biz.trade_name || undefined,
          udyamRegNumber: biz.udyam_reg_number || undefined,
          panNumber: biz.pan_number || undefined,
          gstin: biz.gstin || undefined,
          businessType: biz.business_type as Business['businessType'],
          industry: biz.industry,
          subCategory: biz.sub_category || undefined,
          locationCity: biz.location_city,
          locationState: biz.location_state,
          establishedYear: biz.established_year,
          employeeCount: biz.employee_count,
          isDemo: biz.is_demo,
        },
        financials: liveFinancials,
        operations: liveOperations,
        customers: liveCustomers,
        suppliers: liveSuppliers,
        invoices: liveInvoices,
        activeOpportunities: liveOpportunities,
        baselineCash: liveFinancials.availableCash,
      });

      if (liveOpportunities.length > 0) {
        setActiveOppId(liveOpportunities[0].id);
      }

      if (liveNotifications.length > 0) {
        setNotifications(liveNotifications);
      }

      setIsDemoMode(false);
    } catch (err) {
      console.error('Error loading Supabase workspace:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workspace.financials, workspace.operations]);

  // Supabase Auth listener
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        loadSupabaseWorkspace(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsDemoMode(true);
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        loadSupabaseWorkspace(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsDemoMode(true);
        setWorkspace(getDemoWorkspace(DEFAULT_DEMO_BUSINESS_ID));
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadSupabaseWorkspace]);

  const switchDemoBusiness = (id: string) => {
    if (DEMO_WORKSPACES[id]) {
      const selected = DEMO_WORKSPACES[id];
      setActiveDemoId(id);
      setWorkspace(selected);
      setActiveOppId(selected.activeOpportunities[0]?.id || '');
      setIsDemoMode(true);
    }
  };

  const activeOpportunity =
    workspace.activeOpportunities.find((o) => o.id === activeOppId) ||
    workspace.activeOpportunities[0] ||
    null;

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const signOut = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('SignOut error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsDemoMode(true);
      setWorkspace(getDemoWorkspace(DEFAULT_DEMO_BUSINESS_ID));
    }
  };

  const refreshWorkspace = async () => {
    if (user) {
      await loadSupabaseWorkspace(user);
    }
  };

  /**
   * Saves or updates the business baseline profile in Supabase.
   */
  const saveBusinessProfile = async (
    businessData: Partial<Business>,
    financialsData?: Partial<BusinessFinancials>,
    operationsData?: Partial<BusinessOperations>,
    partnersData?: {
      customerName?: string;
      customerCreditDays?: number;
      supplierName?: string;
      supplierCreditDays?: number;
      supplierAdvanceRequiredPct?: number;
    }
  ) => {
    if (!user) {
      // In-memory update for demo or unauthenticated mode
      setWorkspace((prev) => ({
        ...prev,
        business: {
          ...prev.business,
          ...businessData,
          businessName: businessData.businessName || prev.business.businessName,
        },
        financials: financialsData ? { ...prev.financials, ...financialsData } : prev.financials,
        operations: operationsData ? { ...prev.operations, ...operationsData } : prev.operations,
      }));
      return;
    }

    const supabase = getSupabaseBrowserClient();

    // 1. Upsert Business
    let bizId = workspace.business.id;
    const isNew = !bizId || isDemoMode || bizId.startsWith('biz-');

    if (isNew) {
      const { data: insertedBiz, error: bizErr } = await supabase
        .from('businesses')
        .insert({
          user_id: user.id,
          business_name: businessData.businessName || 'My Enterprise',
          trade_name: businessData.tradeName || null,
          udyam_reg_number: businessData.udyamRegNumber || null,
          pan_number: businessData.panNumber || null,
          gstin: businessData.gstin || null,
          business_type: businessData.businessType || 'Proprietorship',
          industry: businessData.industry || 'Manufacturing',
          location_city: businessData.locationCity || 'Chennai',
          location_state: businessData.locationState || 'Tamil Nadu',
          established_year: businessData.establishedYear || 2020,
          employee_count: businessData.employeeCount || 5,
        })
        .select()
        .single();

      if (bizErr) throw bizErr;
      bizId = insertedBiz.id;
    } else {
      const { error: bizErr } = await supabase
        .from('businesses')
        .update({
          business_name: businessData.businessName,
          trade_name: businessData.tradeName,
          udyam_reg_number: businessData.udyamRegNumber,
          pan_number: businessData.panNumber,
          gstin: businessData.gstin,
          business_type: businessData.businessType,
          industry: businessData.industry,
          location_city: businessData.locationCity,
          location_state: businessData.locationState,
          established_year: businessData.establishedYear,
          employee_count: businessData.employeeCount,
        })
        .eq('id', bizId);

      if (bizErr) throw bizErr;
    }

    // 2. Upsert Financials
    if (financialsData) {
      const { error: finErr } = await supabase.from('business_financials').upsert(
        {
          business_id: bizId,
          average_monthly_revenue: financialsData.averageMonthlyRevenue || 0,
          average_monthly_expenses: financialsData.averageMonthlyExpenses || 0,
          available_cash: financialsData.availableCash || 0,
          existing_loan_outstanding: financialsData.existingLoanOutstanding || 0,
          monthly_emi_obligations: financialsData.monthlyEmiObligations || 0,
          accounts_receivable: financialsData.accountsReceivable || 0,
          accounts_payable: financialsData.accountsPayable || 0,
          monthly_fixed_overheads: financialsData.monthlyFixedOverheads || 0,
          monthly_payroll: financialsData.monthlyPayroll || 0,
        },
        { onConflict: 'business_id' }
      );
      if (finErr) throw finErr;
    }

    // 3. Upsert Operations
    if (operationsData) {
      const { error: opsErr } = await supabase.from('business_operations').upsert(
        {
          business_id: bizId,
          monthly_capacity_units: operationsData.monthlyCapacityUnits || 1000,
          current_capacity_utilisation_pct: operationsData.currentCapacityUtilisationPct || 65,
          standard_lead_time_days: operationsData.standardLeadTimeDays || 21,
          workforce_shift_count: operationsData.workforceShiftCount || 1,
          machinery_count: operationsData.machineryCount || 4,
        },
        { onConflict: 'business_id' }
      );
      if (opsErr) throw opsErr;
    }

    // 4. Upsert or Insert Trading Partners if provided
    if (partnersData?.customerName?.trim()) {
      const { data: existingCust } = await supabase
        .from('customers')
        .select('id')
        .eq('business_id', bizId)
        .eq('name', partnersData.customerName.trim())
        .limit(1);

      if (!existingCust || existingCust.length === 0) {
        await supabase.from('customers').insert({
          business_id: bizId,
          name: partnersData.customerName.trim(),
          industry: businessData.industry || 'Manufacturing',
          credit_terms_days: partnersData.customerCreditDays || 30,
          payment_delay_average_days: 0,
          share_of_revenue_pct: 25,
        });
      }
    }

    if (partnersData?.supplierName?.trim()) {
      const { data: existingSupp } = await supabase
        .from('suppliers')
        .select('id')
        .eq('business_id', bizId)
        .eq('name', partnersData.supplierName.trim())
        .limit(1);

      if (!existingSupp || existingSupp.length === 0) {
        await supabase.from('suppliers').insert({
          business_id: bizId,
          name: partnersData.supplierName.trim(),
          material_category: 'Raw Materials',
          credit_period_days: partnersData.supplierCreditDays || 15,
          advance_payment_required_pct: partnersData.supplierAdvanceRequiredPct || 0,
          lead_time_days: 7,
        });
      }
    }

    await loadSupabaseWorkspace(user);
  };

  /**
   * Creates a new business opportunity, computes financial mechanics, and persists to Supabase.
   */
  const createOpportunity = async (newOppData: Partial<Opportunity>): Promise<string> => {
    const totalOrderVal = newOppData.purchaseOrder?.totalOrderValue || 1000000;
    const advPct = newOppData.purchaseOrder?.advancePercentage || 10;
    const advAmt = (totalOrderVal * advPct) / 100;
    const balanceAmt = totalOrderVal - advAmt;

    const basePo = newOppData.purchaseOrder || {
      id: `po-${Date.now()}`,
      poNumber: `PO-${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDeadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      deliveryLocation: 'Factory Gate, Works Site',
      buyerName: newOppData.buyerName || 'New Enterprise Buyer',
      totalOrderValue: totalOrderVal,
      advanceAmount: advAmt,
      advancePercentage: advPct,
      balanceAmount: balanceAmt,
      paymentTermsDays: 30,
      taxRatePct: 18,
      items: [],
      sourceType: 'manual_entry',
    };

    // Deterministic calculation
    const costs = calculateOpportunityEconomics({
      totalOrderValue: basePo.totalOrderValue,
      advancePercentage: basePo.advancePercentage,
      rawMaterialCost: newOppData.costs?.rawMaterialCost ?? basePo.totalOrderValue * 0.45,
      labourCost: newOppData.costs?.labourCost ?? basePo.totalOrderValue * 0.15,
      productionExpenses: newOppData.costs?.productionExpenses ?? basePo.totalOrderValue * 0.05,
      packagingCost: newOppData.costs?.packagingCost ?? basePo.totalOrderValue * 0.02,
      transportationLogistics: newOppData.costs?.transportationLogistics ?? basePo.totalOrderValue * 0.03,
      electricityUtilities: newOppData.costs?.electricityUtilities ?? 0,
      otherDirectCosts: newOppData.costs?.otherDirectCosts ?? 0,
      allocatedOverheads: newOppData.costs?.allocatedOverheads ?? basePo.totalOrderValue * 0.05,
      estimatedFinancingCost: newOppData.costs?.estimatedFinancingCost ?? 15000,
      availableCash: workspace.financials.availableCash,
    });

    const cashFlow = generateCashFlowTimeline({
      orderDate: basePo.orderDate,
      deliveryDeadline: basePo.deliveryDeadline,
      totalOrderValue: basePo.totalOrderValue,
      advancePercentage: basePo.advancePercentage,
      paymentTermsDays: basePo.paymentTermsDays,
      paymentDelayDays: 15,
      costs,
      baselineCash: workspace.financials.availableCash,
      monthlyEmi: workspace.financials.monthlyEmiObligations,
      monthlyFixedOverhead: workspace.financials.monthlyFixedOverheads,
    });

    const risk = calculateRiskAssessment({
      orderValue: basePo.totalOrderValue,
      grossContribution: costs.grossContribution,
      marginPct: costs.contributionMarginPct,
      upfrontCashRequired: costs.upfrontCashRequired,
      workingCapitalGap: costs.workingCapitalGap,
      peakCashDeficit: cashFlow.peakCashDeficit,
      customerHistory: { averageDelayDays: 15, invoiceCount: 1, onTimeRate: 70 },
      customerShareOfTotalRevenuePct: 25,
      primarySupplierSpendPct: 50,
      supplierCreditDays: 15,
      capacityRequiredUnits: 500,
      businessCapacityUnits: workspace.operations.monthlyCapacityUnits,
      currentCapacityPct: workspace.operations.currentCapacityUtilisationPct,
      availableCash: workspace.financials.availableCash,
      existingMonthlyEmi: workspace.financials.monthlyEmiObligations,
      monthlyRevenue: workspace.financials.averageMonthlyRevenue,
    });

    // Check if live Supabase persistence should be executed
    if (user && !isDemoMode && workspace.business.id && !workspace.business.id.startsWith('biz-')) {
      try {
        const supabase = getSupabaseBrowserClient();

        // 1. Insert Opportunity
        const { data: oppRow, error: oppErr } = await supabase
          .from('opportunities')
          .insert({
            business_id: workspace.business.id,
            title: newOppData.title || `PO: ${basePo.buyerName}`,
            buyer_name: basePo.buyerName,
            status: 'Evaluating',
            confidence_level: 'High',
          })
          .select()
          .single();

        if (oppErr) throw oppErr;
        const oppId = oppRow.id;

        // 2. Insert Purchase Order
        const { error: poErr } = await supabase.from('purchase_orders').insert({
          opportunity_id: oppId,
          po_number: basePo.poNumber,
          order_date: basePo.orderDate,
          delivery_deadline: basePo.deliveryDeadline,
          delivery_location: basePo.deliveryLocation,
          total_order_value: basePo.totalOrderValue,
          advance_amount: basePo.advanceAmount,
          advance_percentage: basePo.advancePercentage,
          balance_amount: basePo.balanceAmount,
          payment_terms_days: basePo.paymentTermsDays,
          penalty_clause_text: basePo.penaltyClauseText || null,
          tax_rate_pct: basePo.taxRatePct,
          items_json: basePo.items as any,
          source_type: basePo.sourceType || 'manual_entry',
        });
        if (poErr) console.error('PO insert error:', poErr);

        // 3. Insert Opportunity Costs
        const { error: costErr } = await supabase.from('opportunity_costs').insert({
          opportunity_id: oppId,
          raw_material_cost: costs.rawMaterialCost,
          labour_cost: costs.labourCost,
          production_expenses: costs.productionExpenses,
          packaging_cost: costs.packagingCost,
          transportation_logistics: costs.transportationLogistics,
          electricity_utilities: costs.electricityUtilities,
          other_direct_costs: costs.otherDirectCosts,
          allocated_overheads: costs.allocatedOverheads,
          estimated_financing_cost: costs.estimatedFinancingCost,
          total_direct_cost: costs.totalDirectCost,
          gross_contribution: costs.grossContribution,
          contribution_margin_pct: costs.contributionMarginPct,
          upfront_cash_required: costs.upfrontCashRequired,
          working_capital_gap: costs.workingCapitalGap,
        });
        if (costErr) console.error('Costs insert error:', costErr);

        // 4. Insert Payment Schedules
        const scheduleMilestones = cashFlow.timeline.flatMap((t) => t.events).map((e) => ({
          opportunity_id: oppId,
          event_name: e.eventName,
          event_type: e.eventType,
          amount: e.amount,
          scheduled_date: e.scheduledDate,
          recipient_or_sender: e.recipientOrSender,
          category: e.category,
          is_confirmed: false,
        }));

        if (scheduleMilestones.length > 0) {
          await supabase.from('payment_schedules').insert(scheduleMilestones as any);
        }

        // 5. Insert Risk Assessment
        await supabase.from('risk_assessments').insert({
          opportunity_id: oppId,
          overall_rating: risk.overallRating,
          customer_dependency_rating: risk.customerDependency.rating,
          customer_dependency_details: risk.customerDependency as any,
          supplier_dependency_rating: risk.supplierDependency.rating,
          supplier_dependency_details: risk.supplierDependency as any,
          cash_flow_dependency_rating: risk.cashFlowDependency.rating,
          cash_flow_dependency_details: risk.cashFlowDependency as any,
          operational_dependency_rating: risk.operationalDependency.rating,
          operational_dependency_details: risk.operationalDependency as any,
          financial_dependency_rating: risk.financialDependency.rating,
          financial_dependency_details: risk.financialDependency as any,
          key_recommendations: [risk.decisionRecommendation] as any,
        });

        await loadSupabaseWorkspace(user);
        return oppId;
      } catch (err) {
        console.error('Error persisting opportunity to Supabase:', err);
      }
    }

    // In-memory update for demo mode or offline fallback
    const newId = `opp-custom-${Date.now()}`;
    const fullOpportunity: Opportunity = {
      id: newId,
      businessId: workspace.business.id,
      title: newOppData.title || `PO: ${basePo.buyerName}`,
      buyerName: basePo.buyerName,
      customerId: undefined,
      status: 'Evaluating',
      createdAt: new Date().toISOString(),
      purchaseOrder: basePo,
      costs,
      paymentSchedule: cashFlow.timeline.flatMap((t) => t.events),
      riskAssessment: risk,
      operationalImpact: {
        unitsRequired: 500,
        capacityIncreasePct: 15,
        projectedTotalUtilisationPct: workspace.operations.currentCapacityUtilisationPct + 15,
        isOverCapacity: workspace.operations.currentCapacityUtilisationPct + 15 > 100,
        leadTimeFeasibility: 'Feasible',
      },
      ...newOppData,
    };

    setWorkspace((prev) => ({
      ...prev,
      activeOpportunities: [fullOpportunity, ...prev.activeOpportunities],
    }));
    setActiveOppId(newId);
    return newId;
  };

  /**
   * Deletes an opportunity from Supabase and in-memory state.
   */
  const deleteOpportunity = async (id: string) => {
    if (user && !isDemoMode && !id.startsWith('opp-sri-') && !id.startsWith('opp-sana-') && !id.startsWith('opp-kovai-') && !id.startsWith('opp-trichy-')) {
      try {
        const supabase = getSupabaseBrowserClient();
        await supabase.from('opportunities').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting opportunity from Supabase:', err);
      }
    }

    setWorkspace((prev) => {
      const remaining = prev.activeOpportunities.filter((opp) => opp.id !== id);
      if (activeOppId === id && remaining.length > 0) {
        setActiveOppId(remaining[0].id);
      }
      return {
        ...prev,
        activeOpportunities: remaining,
      };
    });
  };

  /**
   * Updates an existing opportunity.
   */
  const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
    if (user && !isDemoMode && !id.startsWith('opp-sri-') && !id.startsWith('opp-sana-') && !id.startsWith('opp-kovai-') && !id.startsWith('opp-trichy-')) {
      try {
        const supabase = getSupabaseBrowserClient();
        if (updates.status) {
          await (supabase.from('opportunities') as any).update({ status: updates.status }).eq('id', id);
        }
      } catch (err) {
        console.error('Error updating opportunity in Supabase:', err);
      }
    }

    setWorkspace((prev) => ({
      ...prev,
      activeOpportunities: prev.activeOpportunities.map((opp) =>
        opp.id === id ? { ...opp, ...updates } : opp
      ),
    }));
  };

  const runScenario = (inputs: ScenarioSimulationInputs): ScenarioSimulationResult | null => {
    if (!activeOpportunity) return null;

    return simulateScenario({
      scenarioName: 'What-If Simulation',
      inputs,
      baseOrderValue: activeOpportunity.purchaseOrder.totalOrderValue,
      baseDeliveryDays: 30,
      baseOrderDate: activeOpportunity.purchaseOrder.orderDate,
      baseDeliveryDeadline: activeOpportunity.purchaseOrder.deliveryDeadline,
      baseCosts: activeOpportunity.costs,
      baselineCash: workspace.financials.availableCash,
      monthlyEmi: workspace.financials.monthlyEmiObligations,
      monthlyFixedOverhead: workspace.financials.monthlyFixedOverheads,
    });
  };

  return (
    <WorkspaceContext.Provider
      value={{
        user,
        isAuthenticated,
        isDemoMode,
        isLoading,
        activeDemoId,
        switchDemoBusiness,
        business: workspace.business,
        financials: workspace.financials,
        operations: workspace.operations,
        customers: workspace.customers,
        suppliers: workspace.suppliers,
        invoices: workspace.invoices,
        opportunities: workspace.activeOpportunities,
        activeOpportunity,
        setActiveOpportunityId: setActiveOppId,
        userProfile,
        notifications,
        dismissNotification,
        createOpportunity,
        updateOpportunity,
        deleteOpportunity,
        runScenario,
        signOut,
        refreshWorkspace,
        saveBusinessProfile,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
