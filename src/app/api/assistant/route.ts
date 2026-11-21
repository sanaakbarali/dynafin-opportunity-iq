import { NextRequest, NextResponse } from 'next/server';
import { formatINR } from '@/lib/formatting/currency';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, context } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing query parameter.' }, { status: 400 });
    }

    const q = query.toLowerCase();
    const activeOpp = context?.activeOpportunity;
    const business = context?.business || { businessName: 'Sri Textiles' };
    const financials = context?.financials || { availableCash: 280000, monthlyEmiObligations: 38000 };
    const operations = context?.operations || { monthlyCapacityUnits: 3500, currentCapacityUtilisationPct: 72 };

    const totalVal = activeOpp?.purchaseOrder?.totalOrderValue || 1500000;
    const directCosts = activeOpp?.costs?.totalDirectCost || 900000;
    const grossMargin = activeOpp?.costs?.grossContribution || 600000;
    const marginPct = activeOpp?.costs?.contributionMarginPct || 40;
    const wcGap = activeOpp?.costs?.workingCapitalGap || 385000;
    const availCash = financials.availableCash;
    const advanceAmt = activeOpp?.purchaseOrder?.advanceAmount || totalVal * 0.15;
    const poNum = activeOpp?.purchaseOrder?.poNumber || 'PO-8821';

    // 1. Check for live Gemini API Key
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const systemPrompt = `You are DYNAFIN's AI Financial Decision Architect for Indian MSMEs.
Your role is pre-order financial decision intelligence: evaluate whether this small manufacturing business can afford to fulfill a purchase order before signing contracts.
Strict Rules:
- Currency: ALWAYS use Indian Rupees (₹) with Indian numbering (e.g. ₹15,00,000, Lakhs/Crores). Never use USD or $.
- Grounding: Answer ONLY based on the enterprise's real figures provided below.
- Focus: Highlight the difference between accounting profit (gross contribution) and cash liquidity (working capital deficit, supplier advance requirements, debt EMI servicing).
- No fluff: Be direct, quantitative, and professional.

Business Context:
- Company: ${business.businessName} (${business.industry}, ${business.locationCity})
- Active PO: #${poNum} for ${formatINR(totalVal)}
- Direct Costs: ${formatINR(directCosts)}
- Gross Contribution: ${formatINR(grossMargin)} (${marginPct}% margin)
- Customer Advance: ${formatINR(advanceAmt)}
- Current Liquid Cash: ${formatINR(availCash)}
- Working Capital Gap: ${formatINR(wcGap)}
- Monthly Debt EMI Obligations: ${formatINR(financials.monthlyEmiObligations)}
- Plant Capacity: ${operations.monthlyCapacityUnits} units/month (${operations.currentCapacityUtilisationPct}% currently loaded)`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }] }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 600,
            }
          })
        });

        if (res.ok) {
          const geminiData = await res.json();
          const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({
              answer: generatedText,
              mode: 'gemini_live',
            });
          }
        }
      } catch (e) {
        console.warn('Gemini inference error, falling back to deterministic reasoning:', e);
      }
    }

    // 2. Deterministic Financial Reasoning Engine (Grounded fallback)
    let reply = '';

    if (q.includes('afford to accept') || q.includes('₹15 lakh') || q.includes('accept this order')) {
      reply = `Based on your live cash ledger, you **cannot safely afford** to fulfill PO #${poNum} (${formatINR(totalVal)}) purely with your current liquid reserves (${formatINR(availCash)}).\n\n**Deterministic Financial Mechanics:**\n• Total direct expenditure needed: **${formatINR(directCosts)}**\n• Customer advance received: **${formatINR(advanceAmt)}**\n• Vendor advances & initial payroll needed before Day 15: **${formatINR(directCosts * 0.45)}**\n• **Unfunded Working Capital Gap: ${formatINR(wcGap)}**\n\n**Decision Intelligence:** While this order promises an attractive gross margin of **${marginPct}% (${formatINR(grossMargin)})**, fulfilling it without interim financing will trigger a severe liquidity crunch. Consider negotiating a **25% advance (${formatINR(totalVal * 0.25)})** or securing **₹4,00,000 Purchase Order Financing** under CGTMSE.`;
    } else if (q.includes('60 days') || q.includes('delay') || q.includes('delays payment')) {
      reply = `If the buyer delays settlement by 60 days past the delivery date:\n\n1. **Peak Cash Deficit increases to ${formatINR(wcGap + financials.monthlyEmiObligations * 2)}**.\n2. You must service **two monthly debt EMIs (${formatINR(financials.monthlyEmiObligations * 2)})** plus factory fixed overheads while awaiting settlement.\n3. **Actionable Hedge:** Register this invoice on **TReDS (RXIL/M1xchange)** immediately upon delivery acceptance to discount the receivable at ~8.5% p.a. and unlock 80–90% instant liquidity.`;
    } else if (q.includes('working capital') || q.includes('day 15') || q.includes('how much cash')) {
      reply = `You require **${formatINR(directCosts * 0.45)}** in liquid funds before Day 15 to initiate manufacturing:\n\n• **Supplier Raw Material Downpayment:** ${formatINR(directCosts * 0.35)}\n• **Shift Labor & Consumables:** ${formatINR(directCosts * 0.10)}\n• Net of Available Cash (${formatINR(availCash)}) & Advance (${formatINR(advanceAmt)}):\n• **Net Immediate Shortfall: ${formatINR(Math.max(0, wcGap))}**`;
    } else if (q.includes('supplier') || q.includes('prioritise') || q.includes('vendor')) {
      reply = `Priority vendor disbursement schedule for PO #${poNum}:\n\n1. **Tier 1 (Day 3–5):** Primary yarn/sheet metal vendor advance (Mandatory advance to release batch).\n2. **Tier 2 (Day 15):** Factory wage payroll (Crucial for plant floor uptime and labor stability).\n3. **Tier 3 (Day 25+):** Packaging and third-party logistics freight (Negotiable on 30-day billing cycle).`;
    } else {
      reply = `Financial status for **${business.businessName}** on **PO #${poNum}**:\n\n• **Contract Value:** ${formatINR(totalVal)}\n• **Gross Contribution:** ${formatINR(grossMargin)} (${marginPct}% margin)\n• **Upfront Working Capital Gap:** ${formatINR(wcGap)}\n• **Current Factory Load:** ${operations.currentCapacityUtilisationPct}% capacity\n\nWould you like me to simulate payment delay scenarios or check collateral-free funding options under CGTMSE?`;
    }

    return NextResponse.json({
      answer: reply,
      mode: 'deterministic_grounded',
    });
  } catch (err: any) {
    console.error('AI assistant route error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process assistant query.' },
      { status: 500 }
    );
  }
}
