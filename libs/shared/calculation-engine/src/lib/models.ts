/**
 * Calculator mode: Artist/Label (with royalty) or Merch-Only (no artist)
 */
export type CalculatorMode = 'artist-label' | 'merch-only';

/**
 * Royalty base: gross revenue or net revenue
 */
export type RoyaltyBase = 'gross' | 'net';

/**
 * Royalty type: percentage-based or per-unit
 */
export type RoyaltyType = 'percentage' | 'per-unit';

/**
 * Input model for the calculator - supports partial inputs for auto-calculation
 */
/** Which of the three pricing fields was last edited by the user (used when all 3 are set) */
export type PricingFieldLastEdited = 'cost' | 'markup' | 'salePrice';

export interface CalculatorInput {
  mode: CalculatorMode;

  /** When cost, markup, and sale price are all set, use this to decide which to derive */
  pricingFieldLastEdited?: PricingFieldLastEdited;

  // Revenue & Cost (any 2 of 3 can derive the third)
  cost?: number; // COGS per unit
  markupPercent?: number; // Markup percentage (e.g., 50 = 50%)
  salePricePerUnit?: number; // Selling price per unit
  units?: number; // Number of units (optional, for per-unit calculations)

  // Deductions from gross revenue
  returnsPercent?: number; // Returns as % of gross
  shippingCost?: number;
  taxesAmount?: number;
  discountsAmount?: number;
  otherCosts?: number;

  // Royalty (Artist/Label mode only)
  royaltyPercent?: number; // e.g., 10 = 10%
  royaltyBase?: RoyaltyBase; // gross or net
  royaltyPerUnit?: number; // $ per unit (alternative to percentage)
  royaltyType?: RoyaltyType;
}

/**
 * Result model - all calculated values with source flags
 */
export interface CalculatorResult {
  // Revenue chain
  cost: number;
  markupPercent: number;
  revenue: number; // Gross revenue
  netRevenue: number;
  units: number;

  // Deductions breakdown
  returnsAmount: number;
  shippingCost: number;
  taxesAmount: number;
  discountsAmount: number;
  totalDeductions: number;

  // Royalty (Artist/Label mode)
  royaltyAmount: number;
  royaltyPercent: number;
  royaltyBase: RoyaltyBase;

  // Final outcomes
  merchCompanyNet: number;
  artistNet: number;
  grossMarginPercent: number;
  netMarginPercent: number;

  // Flags for UI (user input vs calculated)
  computed: ComputedFlags;
}

export interface ComputedFlags {
  cost: boolean;
  markupPercent: boolean;
  revenue: boolean;
  netRevenue: boolean;
  royaltyAmount: boolean;
  merchCompanyNet: boolean;
}
