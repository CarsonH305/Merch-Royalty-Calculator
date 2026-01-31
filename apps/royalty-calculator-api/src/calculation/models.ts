export type CalculatorMode = 'artist-label' | 'merch-only';
export type RoyaltyBase = 'gross' | 'net';
export type RoyaltyType = 'percentage' | 'per-unit';

export type PricingFieldLastEdited = 'cost' | 'markup' | 'salePrice';

export interface CalculatorInput {
  mode: CalculatorMode;
  pricingFieldLastEdited?: PricingFieldLastEdited;
  cost?: number;
  markupPercent?: number;
  salePricePerUnit?: number;
  units?: number;
  returnsPercent?: number;
  shippingCost?: number;
  taxesAmount?: number;
  discountsAmount?: number;
  otherCosts?: number;
  royaltyPercent?: number;
  royaltyBase?: RoyaltyBase;
  royaltyPerUnit?: number;
  royaltyType?: RoyaltyType;
}

export interface ComputedFlags {
  cost: boolean;
  markupPercent: boolean;
  revenue: boolean;
  netRevenue: boolean;
  royaltyAmount: boolean;
  merchCompanyNet: boolean;
}

export interface CalculatorResult {
  cost: number;
  markupPercent: number;
  revenue: number;
  netRevenue: number;
  units: number;
  returnsAmount: number;
  shippingCost: number;
  taxesAmount: number;
  discountsAmount: number;
  totalDeductions: number;
  royaltyAmount: number;
  royaltyPercent: number;
  royaltyBase: RoyaltyBase;
  merchCompanyNet: number;
  artistNet: number;
  grossMarginPercent: number;
  netMarginPercent: number;
  computed: ComputedFlags;
}
