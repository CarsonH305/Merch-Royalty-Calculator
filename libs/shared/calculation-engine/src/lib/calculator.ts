import type {
  CalculatorInput,
  CalculatorResult,
  ComputedFlags,
  RoyaltyBase,
} from './models';

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Pure calculation engine - framework-agnostic TypeScript.
 * Resolves dependencies and computes derived values when inputs are sufficient.
 * All values rounded to nearest cent (2 decimal places).
 */
export function calculate(input: CalculatorInput): CalculatorResult {
  const computed: ComputedFlags = {
    cost: false,
    markupPercent: false,
    revenue: false,
    netRevenue: false,
    royaltyAmount: false,
    merchCompanyNet: false,
  };

  // Resolve Cost (per unit), Markup%, Sale Price (per unit)
  // Markup is ALWAYS the derived value when both Cost and Sale Price are present (keeps math in sync)
  // Sale Price = Cost * (1 + Markup%); Revenue (total) = Sale Price * Units
  const units = Math.max(1, input.units ?? 1);
  let cost = input.cost ?? 0; // per unit
  let markupPercent = input.markupPercent ?? 0;
  let salePricePerUnit = input.salePricePerUnit ?? 0;

  const hasCost = input.cost !== undefined && input.cost !== null;
  const hasMarkup = input.markupPercent !== undefined && input.markupPercent !== null;
  const hasSalePrice = input.salePricePerUnit !== undefined && input.salePricePerUnit !== null;
  const lastEdited = input.pricingFieldLastEdited;

  const allThree = hasCost && hasMarkup && hasSalePrice;

  if (allThree) {
    // All 3 set: derive based on which one the user last edited
    if (lastEdited === 'salePrice' || !lastEdited) {
      if (cost > 0) {
        markupPercent = round2((salePricePerUnit / cost - 1) * 100);
        computed.markupPercent = true;
      }
    } else if (lastEdited === 'markup' || lastEdited === 'cost') {
      salePricePerUnit = round2(cost * (1 + markupPercent / 100));
      computed.revenue = true;
    } else {
      const divisor = 1 + markupPercent / 100;
      if (divisor > 0) {
        cost = round2(salePricePerUnit / divisor);
        computed.cost = true;
      }
    }
  } else if (hasCost && hasSalePrice) {
    if (cost > 0) {
      markupPercent = round2((salePricePerUnit / cost - 1) * 100);
      computed.markupPercent = true;
    }
  } else if (hasCost && hasMarkup) {
    salePricePerUnit = round2(cost * (1 + markupPercent / 100));
    computed.revenue = true;
  } else if (hasMarkup && hasSalePrice) {
    const divisor = 1 + markupPercent / 100;
    if (divisor > 0) {
      cost = round2(salePricePerUnit / divisor);
      computed.cost = true;
    }
  }

  const revenue = round2(salePricePerUnit * units); // total gross revenue

  // Net revenue = Gross - Deductions
  const returnsAmount = round2((input.returnsPercent ?? 0) / 100 * revenue);
  const shippingCost = round2(input.shippingCost ?? 0);
  const taxesAmount = round2(input.taxesAmount ?? 0);
  const discountsAmount = round2(input.discountsAmount ?? 0);
  const otherCosts = round2(input.otherCosts ?? 0);
  const totalDeductions = round2(returnsAmount + shippingCost + taxesAmount + discountsAmount);
  const netRevenue = round2(Math.max(0, revenue - totalDeductions));
  computed.netRevenue = true;

  // Royalty
  const royaltyBase = input.royaltyBase ?? 'net';
  const royaltyType = input.royaltyType ?? 'percentage';
  let royaltyAmount = 0;
  let royaltyPercent = input.royaltyPercent ?? 0;

  if (input.mode === 'artist-label') {
    if (royaltyType === 'per-unit' && input.royaltyPerUnit !== undefined && input.royaltyPerUnit !== null) {
      royaltyAmount = round2((input.royaltyPerUnit ?? 0) * units);
      computed.royaltyAmount = true;
    } else if (royaltyType === 'percentage' && royaltyPercent > 0) {
      const base = royaltyBase === 'gross' ? revenue : netRevenue;
      royaltyAmount = round2((royaltyPercent / 100) * base);
      computed.royaltyAmount = true;
    }
  }

  // Merch company net = Net revenue - COGS - Royalty - Other costs
  const totalCost = round2(cost * units); // total COGS
  const merchCompanyNet = round2(netRevenue - totalCost - royaltyAmount - otherCosts);
  computed.merchCompanyNet = true;

  // Margins
  const grossMarginPercent = round2(revenue > 0 ? ((revenue - totalCost) / revenue) * 100 : 0);
  const netMarginPercent = round2(netRevenue > 0 ? (merchCompanyNet / netRevenue) * 100 : 0);

  return {
    cost: round2(cost),
    markupPercent: round2(markupPercent),
    revenue: round2(revenue),
    netRevenue,
    units,
    returnsAmount,
    shippingCost,
    taxesAmount,
    discountsAmount,
    totalDeductions,
    royaltyAmount,
    royaltyPercent,
    royaltyBase,
    merchCompanyNet,
    artistNet: royaltyAmount,
    grossMarginPercent,
    netMarginPercent,
    computed,
  };
}
